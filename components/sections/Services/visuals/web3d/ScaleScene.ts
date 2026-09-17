import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  LineDashedMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  Points,
  PointsMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector3,
} from 'three';
import type { Material } from 'three';
import { COLORS, Web3dScene, clamp, lerp } from './Web3dScene';

export interface IScaleReadout {
  exponent: number;
  // Масштабная линейка 12rem: мантисса и порядок её длины в метрах.
  barMantissa: number;
  barExponent: number;
  focus: number;
}

export interface IScaleSceneOptions {
  labels: () => (HTMLElement | null)[];
  onReadout: (readout: IScaleReadout) => void;
  onSlider: (value: number) => void;
}

const EXPONENT_MIN = -9.2;
const EXPONENT_MAX = -18;
export const SCALE_SLIDER_MAX = 1000;
// Реальные радиусы, м: атом, ядро урана, протон, кварк (условно — предел меньше 10⁻¹⁸).
const RADII = [1e-10, 7.4e-15, 0.84e-15, 5e-19];
const JUMPS = [-9.4, -13.5, -14.5, -17.7];

const toSlider = (exponent: number) =>
  Math.round(((exponent - EXPONENT_MIN) / (EXPONENT_MAX - EXPONENT_MIN)) * SCALE_SLIDER_MAX);

// Видимость объекта в диапазоне экранных размеров [low, high] с мягкими краями по логарифму.
const visibility = (size: number, low: number, high: number) =>
  clamp(Math.log10(size / low) / 0.5, 0, 1) * clamp(1 - Math.log10(size / high) / 0.5, 0, 1);

// «Сравнение масштабов»: ширина кадра меняется по логарифму, объекты растут и уходят за кадр.
export class ScaleScene extends Web3dScene {
  private world = new Group();
  private atom: Points;
  private atomMaterial: PointsMaterial;
  private nucleus = new Group();
  private proton = new Group();
  private quarks: Mesh[];
  private quark = new Group();
  private quarkGlow: Sprite;
  private contours: LineLoop<BufferGeometry, LineDashedMaterial>[];
  private exponent = EXPONENT_MIN;
  private target = JUMPS[0];
  private time = 0;
  private readout = '';
  private base = new Map<Material, number>();
  private label = new Vector3();

  constructor(
    container: HTMLElement,
    private options: IScaleSceneOptions,
  ) {
    super(container);
    this.addLights();
    this.orbit.auto = 0.08;
    this.camera.position.z = 10;
    this.setShift(0, 0.1);
    this.scene.add(this.world);

    const count = 2200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = Math.pow(Math.random(), 0.5);
      const u = Math.random() * 2 - 1;
      const theta = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      positions.set([s * Math.cos(theta) * r, s * Math.sin(theta) * r, u * r], i * 3);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    this.atomMaterial = new PointsMaterial({
      color: COLORS.cyan,
      size: 0.03,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      map: this.glowTexture(),
    });
    this.atom = new Points(geometry, this.atomMaterial);
    this.world.add(this.atom);

    this.world.add(this.nucleus);
    const nucleon = new SphereGeometry(0.19, 16, 12);
    const protonMaterial = new MeshStandardMaterial({
      color: COLORS.blue,
      roughness: 0.35,
      emissive: 0x0a1880,
      emissiveIntensity: 0.5,
      transparent: true,
    });
    const neutronMaterial = new MeshStandardMaterial({ color: 0x8d949e, roughness: 0.45, transparent: true });
    this.nucleus.add(new Mesh(nucleon, protonMaterial));
    for (let i = 0; i < 60; i += 1) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 60);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.35 + (0.45 * ((i * 7) % 10)) / 10;
      const z = Math.cos(phi) * r;
      if (z > 0.2) continue;
      const mesh = new Mesh(nucleon, i % 2 ? neutronMaterial : protonMaterial);
      mesh.position.set(Math.cos(theta) * Math.sin(phi) * r, Math.sin(theta) * Math.sin(phi) * r, z);
      this.nucleus.add(mesh);
    }

    this.world.add(this.proton);
    this.proton.add(
      new Mesh(
        new SphereGeometry(1, 40, 28),
        new MeshStandardMaterial({
          color: COLORS.blueHover,
          transparent: true,
          opacity: 0.18,
          roughness: 0.2,
          depthWrite: false,
          emissive: COLORS.blue,
          emissiveIntensity: 0.3,
        }),
      ),
    );
    const quarkGeometry = new SphereGeometry(0.09, 16, 12);
    this.quarks = [COLORS.fire, COLORS.ok, COLORS.cyan].map((color, i) => {
      const mesh = new Mesh(quarkGeometry, new MeshBasicMaterial({ color, transparent: true }));
      const angle = i * 2.094;
      mesh.position.set(Math.cos(angle) * 0.45, Math.sin(angle) * 0.45, 0);
      this.proton.add(mesh);
      return mesh;
    });

    this.world.add(this.quark);
    this.quarkGlow = new Sprite(
      new SpriteMaterial({
        map: this.glowTexture('rgba(255,255,255,1)', 'rgba(241,57,17,.7)'),
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    );
    this.quarkGlow.scale.setScalar(1.4);
    this.quark.add(this.quarkGlow);
    this.quark.add(
      new Mesh(new SphereGeometry(0.2, 20, 14), new MeshBasicMaterial({ color: COLORS.fire, transparent: true })),
    );

    const circle: Vector3[] = [];
    for (let k = 0; k <= 128; k += 1) {
      const a = (k / 128) * Math.PI * 2;
      circle.push(new Vector3(Math.cos(a), Math.sin(a), 0));
    }
    this.contours = RADII.map((_, i) => {
      const line = new LineLoop(
        new BufferGeometry().setFromPoints(circle),
        new LineDashedMaterial({
          color: i === 3 ? COLORS.fire : COLORS.cold,
          dashSize: 0.04,
          gapSize: 0.03,
          transparent: true,
          opacity: 0.5,
        }),
      );
      line.computeLineDistances();
      this.scene.add(line);
      return line;
    });
    this.start();
    options.onSlider(toSlider(this.target));
  }

  setSlider(value: number) {
    this.setTarget(EXPONENT_MIN + ((EXPONENT_MAX - EXPONENT_MIN) * value) / SCALE_SLIDER_MAX, 1500);
  }

  jump(index: number) {
    this.setTarget(JUMPS[index], 2500);
  }

  private setTarget(exponent: number, wake: number) {
    this.target = clamp(exponent, EXPONENT_MAX, EXPONENT_MIN);
    this.options.onSlider(toSlider(this.target));
    this.wake(wake);
  }

  protected onKey(event: KeyboardEvent) {
    const { key } = event;
    if (key === '+' || key === '=' || key === 'PageDown') this.setTarget(this.target - 0.5, 1200);
    else if (key === '-' || key === 'PageUp') this.setTarget(this.target + 0.5, 1200);
    else return false;
    return true;
  }

  private setOpacity(object: Object3D, opacity: number) {
    object.visible = opacity > 0.01;
    object.traverse((child) => {
      const material = (child as Mesh).material as Material | undefined;
      if (!material) return;
      if (!this.base.has(material)) this.base.set(material, material.opacity);
      material.opacity = (this.base.get(material) ?? 1) * opacity;
    });
  }

  protected update(dt: number) {
    const moving = this.orbitStep(dt, this.world);
    this.exponent = lerp(this.exponent, this.target, 1 - Math.pow(0.01, dt));
    const changing = Math.abs(this.exponent - this.target) > 0.002;
    if (!this.reduce) this.time += dt;
    const t = this.time;

    const frameWidth = Math.pow(10, this.exponent);
    const visibleHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 360) * this.camera.position.z;
    const unitsPerMeter = (visibleHeight * (this.width / this.height)) / frameWidth;
    const sizes = RADII.map((radius) => radius * unitsPerMeter);

    this.atom.scale.setScalar(sizes[0]);
    this.atomMaterial.size = Math.max(0.02, sizes[0] * 0.018);
    this.atomMaterial.opacity = visibility(sizes[0], 0.03, 5);
    this.atom.visible = this.atomMaterial.opacity > 0.01;

    this.nucleus.scale.setScalar(sizes[1]);
    this.setOpacity(this.nucleus, visibility(sizes[1], 0.02, 4));
    this.nucleus.rotation.y = t * 0.2;

    this.proton.scale.setScalar(sizes[2]);
    this.setOpacity(this.proton, visibility(sizes[2], 0.15, 6));
    this.quarks.forEach((quark, i) => {
      const a = i * 2.094 + t;
      quark.position.set(Math.cos(a) * 0.45, Math.sin(a) * 0.45, Math.sin(a * 1.3) * 0.2);
    });

    this.quark.scale.setScalar(Math.max(sizes[3], 0.02));
    this.setOpacity(this.quark, visibility(sizes[3], 0.004, 12));

    this.contours.forEach((contour, i) => {
      contour.scale.setScalar(Math.max(sizes[i], 1e-6));
      contour.material.opacity =
        0.45 * clamp(Math.log10(sizes[i] / 0.08), 0, 1) * clamp(1 - Math.log10(sizes[i] / 6) / 0.4, 0, 1);
      contour.visible = contour.material.opacity > 0.01;
    });

    const labels = this.options.labels();
    sizes.forEach((size, i) => {
      const label = labels[i];
      if (!label) return;
      label.style.opacity = String(visibility(size, 0.06, 4.5));
      const screen = this.toScreen(this.label.set(size * 0.72, size * 0.72, 0));
      label.style.transform = `translate(${screen.x + 6}px, ${screen.y}px) translateY(-100%)`;
    });

    let focus = 0;
    let best = Infinity;
    sizes.forEach((size, i) => {
      const distance = Math.abs(Math.log10(size / 1.3));
      if (distance < best) {
        best = distance;
        focus = i;
      }
    });
    // Линейка ≈ 12rem ≈ 120 css px на 1440; пересчитываем её длину в метры по текущей ширине кадра.
    const [mantissa, power] = ((frameWidth * 120) / Math.max(this.width, 1)).toExponential(0).split('e');
    const readout: IScaleReadout = {
      exponent: Math.round(this.exponent),
      barMantissa: Number(mantissa),
      barExponent: Number(power),
      focus,
    };
    const key = Object.values(readout).join('|');
    if (key !== this.readout) {
      this.readout = key;
      this.options.onReadout(readout);
    }
    return moving || changing;
  }
}
