import {
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  GridHelper,
  Group,
  LatheGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector2,
  Vector3,
} from 'three';
import type { MeshStandardMaterialParameters } from 'three';
import { PlantLife } from './PlantLife';
import { COLORS, Web3dScene, clamp, lerp } from './Web3dScene';

export interface IPlantSceneOptions {
  hotspots: () => (HTMLElement | null)[];
  onSelect: (index: number) => void;
}

interface ICameraState {
  yaw: number;
  pitch: number;
  distance: number;
  target: Vector3;
}

// Точки интереса: позиция хотспота и ракурс камеры [yaw, pitch, distance].
const HOTSPOTS = [
  { point: [-2.2, 3.6, 0], view: [0.5, 0.45, 9] },
  { point: [2.2, 2.1, 0], view: [-0.4, 0.35, 9] },
  { point: [-1, 6.6, -7], view: [2.6, 0.3, 13] },
  { point: [7.5, 1.4, 3.5], view: [-1.2, 0.5, 9] },
  { point: [-8, 0.4, 5], view: [0.9, 0.6, 10] },
];
const OVERVIEW = { yaw: 0.7, pitch: 0.55, distance: 30, target: [0, 1.5, 0] };
const MIN_DISTANCE = 7;
const MAX_DISTANCE = 40;

const flat = (color: number, extra: MeshStandardMaterialParameters = {}) =>
  new MeshStandardMaterial({ color, flatShading: true, roughness: 0.8, metalness: 0.05, ...extra });

// «Облёт макета станции»: low-poly АЭС, камера плавно подлетает к выбранному объекту.
export class PlantScene extends Web3dScene {
  private site = new Group();
  private puffs: Sprite[] = [];
  private life: PlantLife;
  private view: ICameraState = {
    yaw: OVERVIEW.yaw,
    pitch: OVERVIEW.pitch,
    distance: OVERVIEW.distance,
    target: new Vector3(...OVERVIEW.target),
  };
  private goal: ICameraState = {
    yaw: OVERVIEW.yaw,
    pitch: OVERVIEW.pitch,
    distance: OVERVIEW.distance,
    target: new Vector3(...OVERVIEW.target),
  };
  private points = HOTSPOTS.map(({ point }) => new Vector3(point[0], point[1], point[2]));
  private selected = -1;
  private time = 0;

  constructor(
    container: HTMLElement,
    private options: IPlantSceneOptions,
  ) {
    super(container);
    this.addLights();
    this.orbit.enabled = false;
    const { site } = this;
    this.scene.add(site);

    const ground = new Mesh(new CylinderGeometry(14, 14.4, 0.6, 10), flat(0x2d2c2c));
    ground.position.y = -0.3;
    site.add(ground);
    const grid = new GridHelper(26, 26, 0x3d3d3e, 0x333232);
    grid.position.y = 0.01;
    site.add(grid);

    const reactor = new Group();
    reactor.position.set(-2.2, 0, 0);
    site.add(reactor);
    const shell = new Mesh(new CylinderGeometry(1.8, 1.8, 2.6, 14), flat(0xb4bbc4));
    shell.position.y = 1.3;
    reactor.add(shell);
    const dome = new Mesh(new SphereGeometry(1.8, 14, 7, 0, Math.PI * 2, 0, Math.PI / 2), flat(0xcfd4da));
    dome.position.y = 2.6;
    reactor.add(dome);
    const band = new Mesh(
      new CylinderGeometry(1.83, 1.83, 0.18, 14),
      flat(COLORS.blue, { emissive: COLORS.blue, emissiveIntensity: 0.3 }),
    );
    band.position.y = 2.2;
    reactor.add(band);

    const hall = new Mesh(new BoxGeometry(4.4, 2.2, 2.6), flat(0x9d9c9e));
    hall.position.set(2.2, 1.1, 0);
    site.add(hall);
    const roof = new Mesh(new BoxGeometry(4.5, 0.2, 2.7), flat(0x5a5a5e));
    roof.position.set(2.2, 2.3, 0);
    site.add(roof);
    const windowMaterial = flat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.5 });
    const windowGeometry = new BoxGeometry(0.5, 0.5, 0.02);
    for (let i = 0; i < 5; i += 1) {
      const pane = new Mesh(windowGeometry, windowMaterial);
      pane.position.set(0.6 + i * 0.8, 1.3, 1.31);
      site.add(pane);
    }

    const profile: Vector2[] = [];
    for (let i = 0; i <= 8; i += 1) {
      const f = i / 8;
      profile.push(new Vector2(2.1 - Math.sin(f * Math.PI * 0.85) * 0.9 + f * 0.2, f * 5.6));
    }
    const towerGeometry = new LatheGeometry(profile, 16);
    const towerMaterial = flat(0x8d949e, { side: DoubleSide });
    const steam = this.glowTexture('rgba(255,255,255,.9)', 'rgba(220,230,240,.35)');
    [
      [-3.5, -7],
      [1.5, -7],
    ].forEach(([x, z]) => {
      const tower = new Mesh(towerGeometry, towerMaterial);
      tower.position.set(x, 0, z);
      site.add(tower);
      for (let i = 0; i < 14; i += 1) {
        const puff = new Sprite(new SpriteMaterial({ map: steam, transparent: true, depthWrite: false, opacity: 0 }));
        puff.userData = { base: tower.position, phase: i / 14 };
        site.add(puff);
        this.puffs.push(puff);
      }
    });

    const yard = new Group();
    yard.position.set(7.5, 0, 3.5);
    site.add(yard);
    const steel = flat(0x9d9c9e);
    const poleGeometry = new BoxGeometry(0.12, 2.2, 0.12);
    const beamGeometry = new BoxGeometry(0.1, 0.1, 2.1);
    for (let i = 0; i < 3; i += 1) {
      [-1, 1].forEach((z) => {
        const pole = new Mesh(poleGeometry, steel);
        pole.position.set(-1.2 + i * 1.2, 1.1, z);
        yard.add(pole);
      });
      const beam = new Mesh(beamGeometry, steel);
      beam.position.set(-1.2 + i * 1.2, 2.2, 0);
      yard.add(beam);
    }
    const transformerGeometry = new BoxGeometry(0.6, 0.6, 0.6);
    const transformerMaterial = flat(0x3d3d3e);
    for (let i = 0; i < 4; i += 1) {
      const transformer = new Mesh(transformerGeometry, transformerMaterial);
      transformer.position.set(-1.6 + i, 0.3, 2);
      yard.add(transformer);
    }
    const wireMaterial = new LineBasicMaterial({ color: COLORS.gold, transparent: true, opacity: 0.6 });
    [-0.6, 0, 0.6].forEach((offset) => {
      const curve = new CatmullRomCurve3([
        new Vector3(8.7, 2.2, 3.5 + offset),
        new Vector3(10.5, 1.7, 3.5 + offset),
        new Vector3(13.2, 2.4, 3.5 + offset),
      ]);
      site.add(new Line(new BufferGeometry().setFromPoints(curve.getPoints(20)), wireMaterial));
    });

    const pond = new Mesh(
      new CircleGeometry(3.4, 9),
      new MeshStandardMaterial({
        color: COLORS.blue,
        roughness: 0.15,
        metalness: 0.4,
        emissive: COLORS.blue,
        emissiveIntensity: 0.25,
        flatShading: true,
      }),
    );
    pond.rotation.x = -Math.PI / 2;
    pond.position.set(-8, 0.03, 5);
    site.add(pond);

    const treeGeometry = new ConeGeometry(0.45, 1.3, 6);
    const treeMaterial = flat(0x2a6e45);
    for (let i = 0; i < 34; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 9.5 + Math.random() * 3.8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      if (Math.hypot(x + 8, z - 5) < 4.2 || Math.hypot(x - 10, z - 3.5) < 2) continue;
      const tree = new Mesh(treeGeometry, treeMaterial);
      tree.position.set(x, 0.65, z);
      tree.scale.setScalar(0.7 + Math.random() * 0.6);
      site.add(tree);
    }
    this.life = new PlantLife(site);
    this.start();
  }

  focus(index: number) {
    const count = HOTSPOTS.length;
    this.selected = (index + count) % count;
    const { point, view } = HOTSPOTS[this.selected];
    this.goal.target.set(point[0], point[1] * 0.55, point[2]);
    [this.goal.yaw, this.goal.pitch, this.goal.distance] = view;
    this.options.onSelect(this.selected);
    this.wake(2500);
  }

  step(direction: number) {
    if (this.selected < 0) this.focus(direction > 0 ? 0 : HOTSPOTS.length - 1);
    else this.focus(this.selected + direction);
  }

  zoom(direction: number) {
    this.goal.distance = clamp(this.goal.distance + direction * 4, MIN_DISTANCE, MAX_DISTANCE);
    this.wake(1500);
  }

  overview() {
    this.selected = -1;
    this.goal.target.set(OVERVIEW.target[0], OVERVIEW.target[1], OVERVIEW.target[2]);
    this.goal.yaw = OVERVIEW.yaw;
    this.goal.pitch = OVERVIEW.pitch;
    this.goal.distance = OVERVIEW.distance;
    this.options.onSelect(-1);
    this.wake(2500);
  }

  protected onDrag(dx: number, dy: number) {
    this.goal.yaw -= dx * 0.006;
    this.goal.pitch = clamp(this.goal.pitch + dy * 0.004, 0.12, 1.25);
    return true;
  }

  protected onKey(event: KeyboardEvent) {
    const { key } = event;
    if (key === 'ArrowLeft') this.goal.yaw += 0.2;
    else if (key === 'ArrowRight') this.goal.yaw -= 0.2;
    else if (key === 'ArrowUp') this.goal.pitch = clamp(this.goal.pitch + 0.1, 0.12, 1.25);
    else if (key === 'ArrowDown') this.goal.pitch = clamp(this.goal.pitch - 0.1, 0.12, 1.25);
    else if (key === '+' || key === '=') this.goal.distance = clamp(this.goal.distance - 3, MIN_DISTANCE, MAX_DISTANCE);
    else if (key === '-') this.goal.distance = clamp(this.goal.distance + 3, MIN_DISTANCE, MAX_DISTANCE);
    else return false;
    return true;
  }

  protected update(dt: number) {
    const { view, goal, camera } = this;
    const k = 1 - Math.pow(0.03, dt);
    view.yaw = lerp(view.yaw, goal.yaw, k);
    view.pitch = lerp(view.pitch, goal.pitch, k);
    view.distance = lerp(view.distance, goal.distance, k);
    view.target.lerp(goal.target, k);
    if (!this.reduce && this.selected < 0 && !this.dragging) goal.yaw += dt * 0.04;
    camera.position.set(
      view.target.x + Math.sin(view.yaw) * Math.cos(view.pitch) * view.distance,
      view.target.y + Math.sin(view.pitch) * view.distance,
      view.target.z + Math.cos(view.yaw) * Math.cos(view.pitch) * view.distance,
    );
    camera.lookAt(view.target);

    if (!this.reduce) this.time += dt;
    this.puffs.forEach((puff) => {
      const { base, phase } = puff.userData as { base: Vector3; phase: number };
      const f = this.reduce ? phase : (phase + this.time * 0.08) % 1;
      const drift = this.reduce ? 0 : Math.sin(f * 6 + phase * 20) * 0.5;
      const sway = this.reduce ? 0 : Math.cos(phase * 30) * 0.4;
      puff.position.set(base.x + drift + f * 1.5, 5.8 + f * 4, base.z + sway);
      puff.scale.setScalar(1.5 + f * 3.5);
      puff.material.opacity = Math.sin(f * Math.PI) * (this.reduce ? 0.3 : 0.35);
    });
    this.life.update(this.time);

    camera.updateMatrixWorld();
    const hotspots = this.options.hotspots();
    this.points.forEach((point, index) => {
      const element = hotspots[index];
      if (!element) return;
      const screen = this.toScreen(point);
      const hidden = screen.z > 1 || screen.x < 0 || screen.x > this.width || screen.y < 0 || screen.y > this.height;
      element.dataset.hidden = String(hidden);
      element.style.transform = `translate(${screen.x}px, ${screen.y}px)`;
    });
    return (
      Math.abs(view.yaw - goal.yaw) +
        Math.abs(view.pitch - goal.pitch) +
        Math.abs(view.distance - goal.distance) +
        view.target.distanceTo(goal.target) >
      0.002
    );
  }
}
