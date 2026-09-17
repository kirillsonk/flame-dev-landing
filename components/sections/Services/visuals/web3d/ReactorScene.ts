import {
  AdditiveBlending,
  BackSide,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  Points,
  PointsMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector3,
} from 'three';
import { COLORS, Web3dScene, clamp, lerp } from './Web3dScene';

export interface IReactorReadout {
  rods: number;
  power: number;
  temperature: number;
  // 0–3 — режим по мощности, -1 — только что сработала аварийная защита.
  mode: number;
}

export interface IReactorSceneOptions {
  labels: () => (HTMLElement | null)[];
  onReadout: (readout: IReactorReadout) => void;
}

const BUBBLES = 380;
const START_INSERTION = 0.45;

// «Реактор в разрезе»: глубина стержней управляет свечением активной зоны и скоростью теплоносителя.
export class ReactorScene extends Web3dScene {
  private reactor = new Group();
  private rods: Group[] = [];
  private fuelMaterial: MeshStandardMaterial;
  private coreGlow: Sprite;
  private coreLight: PointLight;
  private bubbles: Points;
  private bubblePositions = new Float32Array(BUBBLES * 3);
  private bubbleSpeeds = new Float32Array(BUBBLES);
  private insertion = START_INSERTION;
  private target = START_INSERTION;
  private scramAt = 0;
  private readout = '';
  private anchors = [new Vector3(2.6, 1.2, -0.4), new Vector3(1.4, -1.6, 1), new Vector3(0.3, 5.2, 0)];
  private anchor = new Vector3();

  constructor(
    container: HTMLElement,
    private options: IReactorSceneOptions,
  ) {
    super(container);
    this.addLights();
    this.camera.position.set(0, 0.6, 20);
    this.setShift(-0.08);
    Object.assign(this.orbit, { yaw: -0.3, pitch: 0.28, auto: 0, minP: -0.1, maxP: 0.9 });
    const { reactor } = this;
    this.scene.add(reactor);
    reactor.position.y = -0.2;
    reactor.scale.setScalar(0.82);

    const cut = Math.PI * 1.25;
    const cutStart = Math.PI * 0.375;
    const steel = new MeshStandardMaterial({ color: 0x6a6a6e, metalness: 0.35, roughness: 0.8, side: DoubleSide });
    reactor.add(new Mesh(new CylinderGeometry(2.6, 2.6, 6.4, 64, 1, true, cutStart, cut), steel));
    reactor.add(
      new Mesh(
        new CylinderGeometry(2.35, 2.35, 6.4, 64, 1, true, cutStart, cut),
        new MeshStandardMaterial({ color: 0x2d2c2c, metalness: 0.3, roughness: 0.7, side: BackSide }),
      ),
    );
    const dome = new Mesh(new SphereGeometry(2.6, 48, 16, cutStart, cut, 0, Math.PI / 2), steel);
    dome.position.y = 3.2;
    dome.rotation.y = Math.PI / 2;
    reactor.add(dome);
    const bottom = new Mesh(new SphereGeometry(2.6, 48, 16, cutStart, cut, Math.PI / 2, Math.PI / 2), steel);
    bottom.position.y = -3.2;
    bottom.rotation.y = Math.PI / 2;
    reactor.add(bottom);

    const edgeMaterial = new MeshStandardMaterial({
      color: COLORS.fire,
      emissive: COLORS.fire,
      emissiveIntensity: 0.25,
      roughness: 0.6,
    });
    [cutStart, cutStart + cut].forEach((angle) => {
      const edge = new Mesh(new BoxGeometry(0.25, 6.4, 0.05), edgeMaterial);
      edge.position.set(Math.sin(angle) * 2.48, 0, Math.cos(angle) * 2.48);
      edge.rotation.y = angle;
      reactor.add(edge);
    });

    this.fuelMaterial = new MeshStandardMaterial({
      color: 0x1a2a6a,
      emissive: COLORS.cyan,
      emissiveIntensity: 0.2,
      roughness: 0.4,
      metalness: 0.2,
    });
    const hex = 0.32;
    const fuelGeometry = new CylinderGeometry(hex * 0.82, hex * 0.82, 3.4, 6);
    const fuel: Mesh[] = [];
    for (let q = -3; q <= 3; q += 1) {
      for (let r = -3; r <= 3; r += 1) {
        if (Math.abs(-q - r) > 3) continue;
        const x = hex * 1.75 * (q + r / 2);
        const z = hex * 1.52 * r;
        if (Math.hypot(x, z) > 2.05) continue;
        const assembly = new Mesh(fuelGeometry, this.fuelMaterial);
        assembly.position.set(x, -0.6, z);
        reactor.add(assembly);
        fuel.push(assembly);
      }
    }

    const rodMaterial = new MeshStandardMaterial({ color: 0x9d9c9e, metalness: 0.9, roughness: 0.25 });
    const driveMaterial = new MeshStandardMaterial({ color: 0x3d3d3e, metalness: 0.6, roughness: 0.4 });
    const rodGeometry = new CylinderGeometry(0.07, 0.07, 3.6, 10);
    const driveGeometry = new CylinderGeometry(0.12, 0.12, 1.4, 10);
    fuel
      .filter((_, index) => index % 3 === 1)
      .forEach((assembly) => {
        const group = new Group();
        const rod = new Mesh(rodGeometry, rodMaterial);
        rod.position.y = -1.8;
        group.add(rod);
        const drive = new Mesh(driveGeometry, driveMaterial);
        drive.position.set(assembly.position.x, 4.7, assembly.position.z);
        reactor.add(drive);
        group.position.set(assembly.position.x, 0, assembly.position.z);
        reactor.add(group);
        this.rods.push(group);
      });

    this.coreGlow = new Sprite(
      new SpriteMaterial({
        map: this.glowTexture('rgba(0,225,253,.9)', 'rgba(16,41,255,.45)'),
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    );
    this.coreGlow.scale.set(7, 7, 1);
    this.coreGlow.position.y = -0.6;
    reactor.add(this.coreGlow);
    this.coreLight = new PointLight(COLORS.cyan, 0, 12, 0);
    this.coreLight.position.y = -0.6;
    reactor.add(this.coreLight);

    for (let i = 0; i < BUBBLES; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * 2.1;
      this.bubblePositions.set([Math.cos(angle) * radius, -2.3 + Math.random() * 5.2, Math.sin(angle) * radius], i * 3);
      this.bubbleSpeeds[i] = 0.5 + Math.random();
    }
    const bubbleGeometry = new BufferGeometry();
    bubbleGeometry.setAttribute('position', new BufferAttribute(this.bubblePositions, 3));
    this.bubbles = new Points(
      bubbleGeometry,
      new PointsMaterial({
        color: 0xb4e9ff,
        size: 0.06,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        map: this.glowTexture(),
        blending: AdditiveBlending,
      }),
    );
    reactor.add(this.bubbles);
    this.start();
  }

  // Доля погружения стержней: 0 — подняты, 1 — полностью в зоне.
  setInsertion(value: number) {
    this.target = clamp(value, 0, 1);
    this.wake(1500);
  }

  scram() {
    this.target = 1;
    this.scramAt = performance.now();
    this.wake(1500);
  }

  reset() {
    this.target = START_INSERTION;
    this.scramAt = 0;
    Object.assign(this.orbit, { yaw: -0.3, pitch: 0.28, vy: 0, vp: 0 });
    this.wake(1500);
  }

  protected update(dt: number) {
    const moving = this.orbitStep(dt, this.reactor);
    const fast = this.target === 1 && this.target > this.insertion + 0.2;
    this.insertion = lerp(this.insertion, this.target, 1 - Math.pow(fast ? 0.00001 : 0.03, dt));
    const changing = Math.abs(this.insertion - this.target) > 0.002;
    const power = Math.pow(clamp(1 - this.insertion, 0, 1), 1.6);

    this.rods.forEach((rod) => {
      rod.position.y = 0.9 + (1 - this.insertion) * 3.3;
    });
    this.fuelMaterial.emissiveIntensity = 0.04 + power * 1.1;
    this.fuelMaterial.emissive.setHex(power > 0.8 ? 0x9ff3ff : COLORS.cyan);
    this.coreGlow.material.opacity = power * 0.95;
    this.coreGlow.scale.setScalar(5 + power * 4);
    this.coreLight.intensity = power * 3 * Math.PI;

    if (!this.reduce || changing) {
      const speed = 0.3 + power * 2.6;
      const positions = this.bubblePositions;
      for (let i = 0; i < BUBBLES; i += 1) {
        let y = positions[i * 3 + 1] + dt * speed * this.bubbleSpeeds[i];
        if (y > 2.9) y = -2.3;
        positions[i * 3 + 1] = y;
      }
      this.bubbles.geometry.attributes.position.needsUpdate = true;
    }
    (this.bubbles.material as PointsMaterial).opacity = 0.15 + power * 0.6;

    const scrammed = this.scramAt > 0 && performance.now() - this.scramAt < 2500;
    const mode = scrammed ? -1 : power < 0.05 ? 0 : power < 0.55 ? 1 : power < 0.9 ? 2 : 3;
    const readout: IReactorReadout = {
      rods: Math.round(this.insertion * 100),
      power: Math.round(power * 3200),
      temperature: Math.round(40 + power * 285),
      mode,
    };
    const key = Object.values(readout).join('|');
    if (key !== this.readout) {
      this.readout = key;
      this.options.onReadout(readout);
    }

    const labels = this.options.labels();
    this.reactor.updateMatrixWorld();
    this.anchors.forEach((point, index) => {
      const label = labels[index];
      if (!label) return;
      const screen = this.toScreen(this.reactor.localToWorld(this.anchor.copy(point)));
      label.style.transform = `translate(${screen.x + 8}px, ${screen.y}px) translateY(-50%)`;
    });
    return moving || changing || scrammed;
  }
}
