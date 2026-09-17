import {
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Line,
  LineDashedMaterial,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
} from 'three';
import type { MeshStandardMaterialParameters } from 'three';
import { COLORS, lerp } from './Web3dScene';

interface IWalker {
  body: Group;
  arms: Group[];
  from: Vector3;
  to: Vector3;
  speed: number;
  phase: number;
}

interface IWorker {
  arm: Group;
  phase: number;
}

interface IBird {
  bird: Group;
  wings: Group[];
  radius: number;
  height: number;
  speed: number;
  phase: number;
}

// Кольцевая дорога вокруг реактора и машзала, в обход градирен, пруда и ОРУ.
const ROAD = [
  [-4.6, 3.1],
  [0, 3.3],
  [4.9, 2.8],
  [5.6, -0.5],
  [4.9, -4],
  [0, -4.4],
  [-5.2, -3.8],
  [-6.2, -0.5],
];
const ROAD_WIDTH = 0.9;
const TRUCK_SPEED = 0.022;
const CRANE = new Vector3(3.5, 0, -2.6);
const BENCH = new Vector3(-4.2, 0, 5.6);
const BIRD_COUNT = 6;

const flat = (color: number, extra: MeshStandardMaterialParameters = {}) =>
  new MeshStandardMaterial({ color, flatShading: true, roughness: 0.8, metalness: 0.05, ...extra });

// «Жизнь» на макете: грузовики по кольцу, поворотный кран, рабочие в касках, обед у пруда и чайки.
export class PlantLife {
  private road = new CatmullRomCurve3(
    ROAD.map(([x, z]) => new Vector3(x, 0.03, z)),
    true,
  );
  private trucks: Group[] = [];
  private walkers: IWalker[] = [];
  private workers: IWorker[] = [];
  private birds: IBird[] = [];
  private eater: Group;
  private jib = new Group();
  private hook = new Group();
  private cable: Mesh;
  private beacon = flat(COLORS.fire, { emissive: COLORS.fire, emissiveIntensity: 1 });
  private point = new Vector3();
  private tangent = new Vector3();

  constructor(site: Group) {
    site.add(this.buildRoad());

    [flat(COLORS.blue), flat(0xcfd4da)].forEach((cargo, index) => {
      const truck = this.buildTruck(cargo);
      truck.userData.offset = index / 2;
      site.add(truck);
      this.trucks.push(truck);
    });

    this.cable = new Mesh(new BoxGeometry(0.03, 1, 0.03), flat(0x3d3d3e));
    site.add(this.buildCrane());

    const vests = [flat(0xf3a43b), flat(COLORS.gold), flat(COLORS.cyan)];
    [
      { from: [-3.4, 2.2], to: [3.4, 2.2], speed: 0.45, phase: 0 },
      { from: [6.3, 1.3], to: [9.2, 1.3], speed: 0.35, phase: 0.6 },
      { from: [-1.2, -2.6], to: [-4.2, -2.4], speed: 0.4, phase: 1.3 },
    ].forEach(({ from, to, speed, phase }, index) => {
      const { body, arms } = this.buildWorker(vests[index]);
      site.add(body);
      this.walkers.push({
        body,
        arms,
        from: new Vector3(from[0], 0, from[1]),
        to: new Vector3(to[0], 0, to[1]),
        speed,
        phase,
      });
    });

    // Бригада у крана принимает груз и машет руками.
    [
      [2.1, -3.3, 0],
      [2.7, -3.5, 1.7],
    ].forEach(([x, z, phase], index) => {
      const { body, arms } = this.buildWorker(vests[index]);
      body.position.set(x, 0, z);
      body.lookAt(CRANE.x, 0, CRANE.z);
      site.add(body);
      this.workers.push({ arm: arms[1], phase });
    });

    this.eater = this.buildLunch(site, vests[2]);

    // Чайки кружат над площадкой стайкой: у каждой свой радиус, высота и взмах.
    const birdMaterial = flat(0xfcfbfb);
    for (let i = 0; i < BIRD_COUNT; i += 1) {
      const { bird, wings } = this.buildBird(birdMaterial);
      site.add(bird);
      this.birds.push({
        bird,
        wings,
        radius: 8 + (i % 3) * 1.4,
        height: 6.5 + (i % 2) * 1.2,
        speed: 0.16 + (i % 3) * 0.03,
        phase: i * 0.5,
      });
    }
  }

  update(time: number) {
    this.trucks.forEach((truck) => {
      const u = (time * TRUCK_SPEED + (truck.userData.offset as number)) % 1;
      this.road.getPointAt(u, this.point);
      this.road.getTangentAt(u, this.tangent);
      truck.position.copy(this.point);
      truck.rotation.y = Math.atan2(this.tangent.x, this.tangent.z);
    });

    this.walkers.forEach(({ body, arms, from, to, speed, phase }) => {
      const length = from.distanceTo(to);
      const cycle = ((time * speed) / length + phase) % 2;
      const forward = cycle < 1;
      const t = forward ? cycle : 2 - cycle;
      body.position.set(lerp(from.x, to.x, t), Math.abs(Math.sin(time * 7 + phase)) * 0.04, lerp(from.z, to.z, t));
      const heading = Math.atan2(to.x - from.x, to.z - from.z);
      body.rotation.y = forward ? heading : heading + Math.PI;
      arms.forEach((arm, side) => {
        arm.rotation.x = Math.sin(time * 7 + phase + side * Math.PI) * 0.6;
      });
    });

    this.workers.forEach(({ arm, phase }) => {
      arm.rotation.x = -2.4 + Math.sin(time * 5 + phase) * 0.5;
    });

    // Стрела ходит между площадкой и машзалом, груз поднимается и опускается.
    this.jib.rotation.y = Math.sin(time * 0.3) * 1.1 + 0.4;
    const drop = 1.6 + Math.sin(time * 0.6) * 1.2;
    this.hook.position.y = -drop;
    this.cable.scale.y = drop;
    this.cable.position.y = -drop / 2;
    this.beacon.emissiveIntensity = Math.sin(time * 4) > 0.3 ? 2 : 0.15;

    // Обед: рука подносит бургер ко рту, задерживается на укусе и опускается.
    const bite = Math.max(0, Math.min(1, Math.sin(time * 1.2) * 2));
    this.eater.rotation.x = lerp(-0.5, -2.35, bite);

    this.birds.forEach(({ bird, wings, radius, height, speed, phase }) => {
      const angle = time * speed + phase;
      bird.position.set(
        Math.cos(angle) * radius,
        height + Math.sin(time * 0.8 + phase * 3) * 0.4,
        Math.sin(angle) * radius,
      );
      bird.rotation.y = Math.atan2(-Math.sin(angle), Math.cos(angle));
      bird.rotation.z = -0.25;
      const flap = 0.25 + Math.sin(time * 9 + phase * 7) * 0.45;
      wings[0].rotation.z = flap;
      wings[1].rotation.z = -flap;
    });
  }

  private buildRoad() {
    const group = new Group();
    const points = this.road.getSpacedPoints(160);
    const positions: number[] = [];
    const indices: number[] = [];
    points.forEach((point, index) => {
      const next = points[(index + 1) % points.length];
      const dx = next.x - point.x;
      const dz = next.z - point.z;
      const size = Math.hypot(dx, dz) || 1;
      const nx = (-dz / size) * (ROAD_WIDTH / 2);
      const nz = (dx / size) * (ROAD_WIDTH / 2);
      positions.push(point.x + nx, 0.02, point.z + nz, point.x - nx, 0.02, point.z - nz);
      if (index < points.length - 1) {
        const a = index * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    });
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    group.add(new Mesh(geometry, flat(0x1c1b1b, { side: DoubleSide })));

    const marking = new Line(
      new BufferGeometry().setFromPoints(points.map((point) => point.clone().setY(0.04))),
      new LineDashedMaterial({ color: COLORS.dim, dashSize: 0.3, gapSize: 0.3, transparent: true, opacity: 0.6 }),
    );
    marking.computeLineDistances();
    group.add(marking);
    return group;
  }

  private buildTruck(cargoMaterial: MeshStandardMaterial) {
    const truck = new Group();
    const cab = new Mesh(new BoxGeometry(0.5, 0.45, 0.38), flat(0xfcfbfb));
    cab.position.set(0, 0.34, 0.42);
    const glass = new Mesh(new BoxGeometry(0.42, 0.16, 0.02), flat(0x3d3d3e, { metalness: 0.5, roughness: 0.2 }));
    glass.position.set(0, 0.44, 0.62);
    const cargo = new Mesh(new BoxGeometry(0.56, 0.56, 0.8), cargoMaterial);
    cargo.position.set(0, 0.4, -0.2);
    const chassis = new Mesh(new BoxGeometry(0.46, 0.08, 1.3), flat(0x2d2c2c));
    chassis.position.set(0, 0.12, 0.05);
    truck.add(cab, glass, cargo, chassis);

    const wheelGeometry = new CylinderGeometry(0.1, 0.1, 0.08, 10);
    const wheelMaterial = flat(0x1a1a1a);
    [0.42, -0.4].forEach((z) => {
      [-0.26, 0.26].forEach((x) => {
        const wheel = new Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, 0.1, z);
        truck.add(wheel);
      });
    });
    const lightMaterial = flat(COLORS.gold, { emissive: COLORS.gold, emissiveIntensity: 1.5 });
    [-0.17, 0.17].forEach((x) => {
      const light = new Mesh(new BoxGeometry(0.08, 0.05, 0.02), lightMaterial);
      light.position.set(x, 0.2, 0.62);
      truck.add(light);
    });
    truck.scale.setScalar(1.3);
    return truck;
  }

  private buildCrane() {
    const crane = new Group();
    crane.position.copy(CRANE);
    const yellow = flat(COLORS.gold);
    const base = new Mesh(new BoxGeometry(0.7, 0.2, 0.7), flat(0x3d3d3e));
    base.position.y = 0.1;
    const mast = new Mesh(new BoxGeometry(0.22, 4.4, 0.22), yellow);
    mast.position.y = 2.3;
    crane.add(base, mast);

    this.jib.position.y = 4.5;
    crane.add(this.jib);
    const arm = new Mesh(new BoxGeometry(0.16, 0.16, 3.4), yellow);
    arm.position.z = 0.9;
    const cabin = new Mesh(new BoxGeometry(0.3, 0.26, 0.3), flat(0xfcfbfb));
    cabin.position.set(0.22, -0.1, 0);
    const counterweight = new Mesh(new BoxGeometry(0.4, 0.3, 0.4), flat(0x5a5a5e));
    counterweight.position.set(0, -0.05, -0.6);
    const beacon = new Mesh(new SphereGeometry(0.06, 8, 6), this.beacon);
    beacon.position.y = 0.14;
    this.jib.add(arm, cabin, counterweight, beacon);

    const trolley = new Group();
    trolley.position.set(0, -0.08, 2.3);
    this.jib.add(trolley);
    trolley.add(this.cable);
    const load = new Mesh(new BoxGeometry(0.45, 0.3, 0.45), flat(COLORS.blue));
    load.position.y = -0.15;
    this.hook.add(load);
    trolley.add(this.hook);
    return crane;
  }

  private buildWorker(vest: MeshStandardMaterial) {
    const body = new Group();
    const legs = new Mesh(new BoxGeometry(0.14, 0.2, 0.08), flat(0x2d2c2c));
    legs.position.y = 0.1;
    const torso = new Mesh(new BoxGeometry(0.2, 0.2, 0.11), vest);
    torso.position.y = 0.3;
    const head = new Mesh(new SphereGeometry(0.06, 8, 6), flat(0xe0b89a));
    head.position.y = 0.46;
    const helmet = new Mesh(new SphereGeometry(0.07, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2), flat(0xfcfbfb));
    helmet.position.y = 0.48;
    body.add(legs, torso, head, helmet);

    const armGeometry = new BoxGeometry(0.05, 0.18, 0.05);
    const arms = [-0.13, 0.13].map((x) => {
      const pivot = new Group();
      pivot.position.set(x, 0.39, 0);
      const arm = new Mesh(armGeometry, vest);
      arm.position.y = -0.09;
      pivot.add(arm);
      body.add(pivot);
      return pivot;
    });
    body.scale.setScalar(1.4);
    return { body, arms, legs };
  }

  // Скамейка у пруда: рабочий сидит лицом к воде и ест бургер. Возвращает руку с бургером.
  private buildLunch(site: Group, vest: MeshStandardMaterial) {
    const bench = new Group();
    bench.position.copy(BENCH);
    bench.lookAt(-8, 0, 5);
    site.add(bench);
    const wood = flat(0x8a5a3b);
    const seat = new Mesh(new BoxGeometry(0.9, 0.05, 0.28), wood);
    seat.position.y = 0.22;
    const back = new Mesh(new BoxGeometry(0.9, 0.22, 0.04), wood);
    back.position.set(0, 0.38, -0.14);
    bench.add(seat, back);
    [-0.38, 0.38].forEach((x) => {
      const leg = new Mesh(new BoxGeometry(0.05, 0.2, 0.24), flat(0x3d3d3e));
      leg.position.set(x, 0.1, 0);
      bench.add(leg);
    });

    const { body, arms, legs } = this.buildWorker(vest);
    body.position.set(0.15, -0.04, -0.02);
    legs.rotation.x = Math.PI / 2;
    legs.position.set(0, 0.2, 0.1);
    const shins = new Mesh(new BoxGeometry(0.14, 0.18, 0.08), legs.material);
    shins.position.set(0, 0.11, 0.2);
    body.add(shins);
    arms[0].rotation.x = -0.5;
    bench.add(body);

    const burger = new Group();
    burger.position.y = -0.2;
    const bun = flat(0xd89a4e);
    const layers: [Mesh, number][] = [
      [new Mesh(new CylinderGeometry(0.045, 0.045, 0.02, 10), bun), 0],
      [new Mesh(new CylinderGeometry(0.05, 0.05, 0.02, 10), flat(0x5a3322)), 0.02],
      [new Mesh(new CylinderGeometry(0.052, 0.052, 0.008, 10), flat(COLORS.ok)), 0.034],
      [new Mesh(new SphereGeometry(0.045, 10, 4, 0, Math.PI * 2, 0, Math.PI / 2), bun), 0.04],
    ];
    layers.forEach(([mesh, y]) => {
      mesh.position.y = y;
      burger.add(mesh);
    });
    arms[1].add(burger);
    return arms[1];
  }

  // Чайка: тело-капля и два крыла на шарнирах, летит вдоль +z.
  private buildBird(material: MeshStandardMaterial) {
    const bird = new Group();
    const body = new Mesh(new ConeGeometry(0.035, 0.22, 5), material);
    body.rotation.x = Math.PI / 2;
    bird.add(body);
    const wings = [-1, 1].map((side) => {
      const pivot = new Group();
      const wing = new Mesh(new BoxGeometry(0.28, 0.01, 0.07), material);
      wing.position.x = side * 0.14;
      pivot.add(wing);
      bird.add(pivot);
      return pivot;
    });
    bird.scale.setScalar(1.1);
    return { bird, wings };
  }
}
