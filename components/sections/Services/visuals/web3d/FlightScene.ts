import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
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

export interface IFlightSceneOptions {
  exponents: number[];
  onStop: (index: number) => void;
  onExponent: (exponent: number) => void;
  progress: HTMLElement | null;
}

const setOpacity = (object: Object3D, opacity: number) => {
  object.visible = opacity > 0.01;
  object.traverse((child) => {
    const material = (child as Mesh).material as Material | undefined;
    if (material) material.opacity = opacity;
  });
};

// «Полёт в микромир»: камера стоит, а слои молекула → облако → ядро → кварки масштабируются по логарифму глубины.
export class FlightScene extends Web3dScene {
  private world = new Group();
  private molecule = new Group();
  private cloud: Points;
  private cloudMaterial: PointsMaterial;
  private nucleus = new Group();
  private nucleusGlow: Sprite;
  private quarkLayer = new Group();
  private quarks: Mesh[];
  private gluons: LineSegments<BufferGeometry, LineBasicMaterial>;
  private depth = 0;
  private target = 0;
  private idle = 0;
  private time = 0;
  private stop = -1;
  private exponent = 0;
  private lastStop: number;

  constructor(
    container: HTMLElement,
    private options: IFlightSceneOptions,
  ) {
    super(container);
    this.lastStop = options.exponents.length - 1;
    this.addLights();
    this.camera.position.set(0, 0, 10);
    this.camera.near = 0.01;
    this.setShift(0, 0.12);
    this.scene.add(this.world);
    const glow = this.glowTexture();

    this.world.add(this.molecule);
    const oxygen = new MeshStandardMaterial({
      color: COLORS.blue,
      roughness: 0.3,
      emissive: 0x0a1880,
      emissiveIntensity: 0.5,
      transparent: true,
    });
    const hydrogen = new MeshStandardMaterial({ color: COLORS.cold, roughness: 0.35, transparent: true });
    this.molecule.add(new Mesh(new SphereGeometry(1, 40, 28), oxygen));
    const angle = ((104.5 / 2) * Math.PI) / 180;
    [-1, 1].forEach((side) => {
      const atom = new Mesh(new SphereGeometry(0.62, 32, 20), hydrogen);
      atom.position.set(Math.sin(angle) * side * 1.35, -Math.cos(angle) * 1.35, 0);
      this.molecule.add(atom);
    });

    const count = 2600;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = i % 3 === 0 ? 0.25 + Math.random() * 0.2 : Math.pow(Math.random(), 0.6) * 0.95;
      const u = Math.random() * 2 - 1;
      const theta = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      positions.set([s * Math.cos(theta) * r, s * Math.sin(theta) * r, u * r], i * 3);
    }
    const cloudGeometry = new BufferGeometry();
    cloudGeometry.setAttribute('position', new BufferAttribute(positions, 3));
    this.cloudMaterial = new PointsMaterial({
      color: COLORS.cyan,
      size: 0.05,
      map: glow,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    this.cloud = new Points(cloudGeometry, this.cloudMaterial);
    this.world.add(this.cloud);

    this.world.add(this.nucleus);
    const nucleonGeometry = new SphereGeometry(0.2, 24, 16);
    const proton = new MeshStandardMaterial({
      color: COLORS.blue,
      roughness: 0.35,
      emissive: 0x0a1880,
      emissiveIntensity: 0.5,
      transparent: true,
    });
    const neutron = new MeshStandardMaterial({ color: 0x8d949e, roughness: 0.45, transparent: true });
    this.nucleus.add(new Mesh(nucleonGeometry, proton));
    for (let i = 1; i < 16; i += 1) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 16);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const nucleon = new Mesh(nucleonGeometry, i % 2 ? neutron : proton);
      nucleon.position.set(
        Math.cos(theta) * Math.sin(phi) * 0.36,
        Math.sin(theta) * Math.sin(phi) * 0.36,
        Math.cos(phi) * 0.36,
      );
      this.nucleus.add(nucleon);
    }
    this.nucleusGlow = new Sprite(
      new SpriteMaterial({
        map: this.glowTexture('rgba(58,86,255,1)', 'rgba(16,41,255,.4)'),
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    );
    this.nucleusGlow.scale.setScalar(2);
    this.nucleus.add(this.nucleusGlow);

    this.world.add(this.quarkLayer);
    this.quarks = [COLORS.fire, COLORS.ok, COLORS.cyan].map((color) => {
      const quark = new Mesh(new SphereGeometry(0.05, 20, 14), new MeshBasicMaterial({ color, transparent: true }));
      const halo = new Sprite(
        new SpriteMaterial({ map: glow, color, transparent: true, depthWrite: false, blending: AdditiveBlending }),
      );
      halo.scale.setScalar(0.4);
      quark.add(halo);
      this.quarkLayer.add(quark);
      return quark;
    });
    this.gluons = new LineSegments(
      new BufferGeometry().setFromPoints(Array.from({ length: 6 }, () => new Vector3())),
      new LineBasicMaterial({ color: COLORS.gold, transparent: true }),
    );
    this.quarkLayer.add(this.gluons);
    this.start();
  }

  goTo(index: number) {
    this.target = clamp(index, 0, this.lastStop);
    this.wake(1500);
  }

  step(direction: number) {
    const next = direction > 0 ? Math.floor(this.target + 1e-3) + 1 : Math.ceil(this.target - 1e-3) - 1;
    this.goTo(next);
  }

  protected onDrag(dx: number, dy: number, event: PointerEvent) {
    // Мышью тянем по вертикали; на тач-экране вертикаль отдана прокрутке страницы, поэтому свайп по горизонтали.
    const delta = event.pointerType === 'touch' ? dx : dy;
    this.target = clamp(this.target - delta * 0.01, 0, this.lastStop);
    return true;
  }

  protected onRelease() {
    this.target = Math.round(this.target);
  }

  protected onKey(event: KeyboardEvent) {
    const { key } = event;
    if (key === 'ArrowDown' || key === 'PageDown' || key === ' ') this.step(1);
    else if (key === 'ArrowUp' || key === 'PageUp') this.step(-1);
    else if (key === 'Home') this.goTo(0);
    else if (key === 'End') this.goTo(this.lastStop);
    else return false;
    return true;
  }

  private exponentAt(value: number) {
    const { exponents } = this.options;
    const index = Math.floor(clamp(value, 0, this.lastStop - 0.001));
    const fraction = clamp(value, 0, this.lastStop) - index;
    return lerp(exponents[index], exponents[Math.min(this.lastStop, index + 1)], fraction);
  }

  protected update(dt: number) {
    const previous = this.depth;
    this.depth = lerp(this.depth, this.target, 1 - Math.pow(0.02, dt));
    if (Math.abs(this.depth - this.target) < 0.0005) this.depth = this.target;
    if (!this.dragging) {
      this.idle += dt;
      const between = Math.abs(this.target - Math.round(this.target)) > 0.001;
      if (this.idle > 0.35 && between && Math.abs(this.depth - this.target) < 0.05) this.target = Math.round(this.target);
    }
    if (Math.abs(previous - this.depth) > 1e-4 || this.dragging) this.idle = 0;
    if (!this.reduce) this.time += dt;

    const p = this.depth;
    const t = this.time;
    const exponent = this.exponentAt(p);
    const zoom = Math.pow(10, -9 - exponent);

    this.molecule.scale.setScalar(zoom);
    setOpacity(this.molecule, clamp(1 - (p - 0.25) / 0.5, 0, 1));

    this.cloud.scale.setScalar(zoom * 0.7);
    this.cloud.rotation.y = t * 0.1;
    this.cloudMaterial.size = 0.05 * zoom * 0.7;
    this.cloudMaterial.opacity = clamp((p - 0.1) / 0.5, 0, 1) * clamp(1 - (p - 1.4) / 0.8, 0, 1);
    this.cloud.visible = this.cloudMaterial.opacity > 0.01 && zoom < 400;

    this.nucleus.scale.setScalar(Math.max(zoom * 4.5e-5, 1e-6));
    setOpacity(this.nucleus, clamp((p - 1.6) / 1.2, 0, 1) * clamp(1 - (p - 3.35) / 0.5, 0, 1));
    this.nucleusGlow.material.opacity *= 0.7;
    this.nucleus.rotation.y = t * 0.2;

    this.quarkLayer.scale.setScalar(Math.max(zoom * 2e-5, 1e-6));
    const quarkOpacity = clamp((p - 3.3) / 0.5, 0, 1);
    setOpacity(this.quarkLayer, quarkOpacity);
    this.quarks.forEach((quark, i) => {
      const a = t * 0.9 + i * 2.094;
      quark.position.set(Math.cos(a) * 0.11, Math.sin(a) * 0.11, Math.sin(a * 1.3) * 0.04);
    });
    const points = this.gluons.geometry.attributes.position;
    for (let i = 0; i < 3; i += 1) {
      const a = this.quarks[i].position;
      const b = this.quarks[(i + 1) % 3].position;
      points.setXYZ(i * 2, a.x, a.y, a.z);
      points.setXYZ(i * 2 + 1, b.x, b.y, b.z);
    }
    points.needsUpdate = true;
    this.gluons.material.opacity = quarkOpacity * 0.5;

    this.world.rotation.set(0.15 + p * 0.1, t * 0.08 + p * 0.6, 0);

    const rounded = Math.round(exponent);
    if (rounded !== this.exponent) {
      this.exponent = rounded;
      this.options.onExponent(rounded);
    }
    if (this.options.progress) this.options.progress.style.transform = `scaleX(${p / this.lastStop})`;
    const stop = clamp(Math.round(p), 0, this.lastStop);
    if (stop !== this.stop) {
      this.stop = stop;
      this.options.onStop(stop);
    }
    return Math.abs(p - this.target) > 0.0005;
  }
}
