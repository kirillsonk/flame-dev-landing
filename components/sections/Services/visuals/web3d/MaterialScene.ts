import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  BackSide,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  TorusGeometry,
} from 'three';
import type { Material } from 'three';
import { COLORS, Web3dScene, clamp, lerp } from './Web3dScene';

const START = { azimuth: 0.8, elevation: 0.7, roughness: 0.18 };

// «Лаборатория материалов»: PBR-шар в студийном окружении, свет вращается перетаскиванием.
export class MaterialScene extends Web3dScene {
  private key = new DirectionalLight(0xffffff, 2.2 * Math.PI);
  private bulb: Sprite;
  private ball: Mesh;
  private core = new Group();
  private halo: Mesh<SphereGeometry, ShaderMaterial>;
  private materials: (MeshStandardMaterial | MeshPhysicalMaterial)[];
  private environment: Scene;
  private pmrem: PMREMGenerator;
  private index = 0;
  private roughness = START.roughness;
  private azimuth = START.azimuth;
  private elevation = START.elevation;
  private turning = false;
  private haloAmount = 0;

  constructor(container: HTMLElement) {
    super(container);
    this.orbit.enabled = false;
    this.camera.position.set(0, 0.6, 10);
    this.camera.lookAt(0, 0.2, 0);
    this.setShift(-0.12, 0.24);
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.9;
    this.scene.add(new AmbientLight(0xb4bbc4, 0.15 * Math.PI), this.key);

    this.environment = new Scene();
    this.environment.background = new Color(0x050505);
    const panel = (color: number, x: number, y: number, z: number, w: number, h: number) => {
      const mesh = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color, side: DoubleSide }));
      mesh.position.set(x, y, z);
      mesh.lookAt(0, 0, 0);
      this.environment.add(mesh);
    };
    panel(0xffffff, 0, 6, 0, 6, 6);
    panel(COLORS.blue, -7, 1, 2, 4, 8);
    panel(COLORS.cyan, 7, 0, -2, 3, 7);
    panel(0x666666, 0, 1, -8, 10, 2);
    panel(0x0a0a0a, 0, -6, 0, 20, 20);
    this.pmrem = new PMREMGenerator(this.renderer);
    this.scene.environment = this.track(this.pmrem.fromScene(this.environment, 0.04).texture);

    this.bulb = new Sprite(
      new SpriteMaterial({
        map: this.glowTexture('rgba(255,255,255,1)', 'rgba(255,255,255,.5)'),
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    );
    this.bulb.scale.setScalar(0.9);
    this.scene.add(this.bulb);

    const pedestal = new Mesh(
      new CylinderGeometry(2.3, 2.5, 0.35, 64),
      new MeshStandardMaterial({ color: 0x121212, roughness: 0.7, metalness: 0.1 }),
    );
    pedestal.position.y = -1.95;
    this.scene.add(pedestal);
    const ring = new Mesh(new TorusGeometry(2.32, 0.025, 8, 120), new MeshBasicMaterial({ color: COLORS.cyan }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.77;
    this.scene.add(ring);
    const shadow = new Sprite(
      new SpriteMaterial({
        map: this.glowTexture('rgba(0,0,0,.8)', 'rgba(0,0,0,.4)'),
        transparent: true,
        depthWrite: false,
      }),
    );
    shadow.scale.set(3.6, 1, 1);
    shadow.position.set(0, -1.74, 0.2);
    this.scene.add(shadow);

    const nucleon = new SphereGeometry(0.22, 20, 14);
    const proton = new MeshStandardMaterial({
      color: COLORS.blue,
      roughness: 0.35,
      emissive: COLORS.blue,
      emissiveIntensity: 0.4,
    });
    const neutron = new MeshStandardMaterial({ color: 0x8d949e, roughness: 0.35 });
    for (let i = 0; i < 12; i += 1) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 12);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const mesh = new Mesh(nucleon, i % 2 ? neutron : proton);
      mesh.position.set(
        Math.cos(theta) * Math.sin(phi) * 0.35,
        Math.sin(theta) * Math.sin(phi) * 0.35,
        Math.cos(phi) * 0.35,
      );
      this.core.add(mesh);
    }
    this.core.visible = false;
    this.scene.add(this.core);

    this.materials = [
      new MeshStandardMaterial({ color: 0xe6e8ec, metalness: 1, roughness: 0.18, envMapIntensity: 1.2 }),
      new MeshPhysicalMaterial({
        color: 0xdff8ff,
        metalness: 0,
        roughness: 0.05,
        transmission: 1,
        ior: 1.5,
        thickness: 1,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.4,
      }),
      new MeshPhysicalMaterial({
        color: 0xb4bbc4,
        metalness: 0,
        roughness: 0.55,
        clearcoat: 0.4,
        clearcoatRoughness: 0.3,
      }),
      new MeshStandardMaterial({
        color: 0x0b1440,
        emissive: COLORS.cyan,
        emissiveIntensity: 0.7,
        metalness: 0.2,
        roughness: 0.3,
      }),
    ];
    this.ball = new Mesh(new SphereGeometry(1.7, 96, 64), this.materials[0]);
    this.scene.add(this.ball);

    // Френелевский ореол для «свечения».
    this.halo = new Mesh(
      new SphereGeometry(1.95, 64, 48),
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: BackSide,
        uniforms: { color: { value: new Color(COLORS.cyan) }, amount: { value: 0 } },
        vertexShader:
          'varying vec3 vNormal;varying vec3 vView;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vNormal=normalize(normalMatrix*normal);vView=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
        fragmentShader:
          'uniform vec3 color;uniform float amount;varying vec3 vNormal;varying vec3 vView;void main(){float f=pow(1.-abs(dot(vNormal,vView)),2.5);gl_FragColor=vec4(color*f*amount*1.6,f*amount);}',
      }),
    );
    this.halo.visible = false;
    this.scene.add(this.halo);
    this.start();
  }

  setMaterial(index: number) {
    this.index = index;
    this.ball.material = this.materials[index];
    this.core.visible = index === 1;
    this.applyRoughness();
    this.wake(1200);
  }

  setRoughness(value: number) {
    this.roughness = clamp(value, 0, 1);
    this.applyRoughness();
    this.wake();
  }

  setLight(color: string) {
    this.key.color.set(color);
    this.bulb.material.color.set(color);
    this.wake();
  }

  setTurning(turning: boolean) {
    this.turning = turning;
    this.wake();
  }

  reset(color: string) {
    this.azimuth = START.azimuth;
    this.elevation = START.elevation;
    this.roughness = START.roughness;
    this.setLight(color);
    this.setMaterial(0);
  }

  private applyRoughness() {
    const material = this.materials[this.index];
    const { roughness, index } = this;
    material.roughness = index === 1 ? roughness * 0.4 : index === 2 ? 0.3 + roughness * 0.7 : roughness;
  }

  protected onLayout() {
    this.camera.position.set(0, 0.6, this.portrait ? 15 : 10);
    this.camera.lookAt(0, 0.2, 0);
  }

  protected onDrag(dx: number, dy: number) {
    this.azimuth -= dx * 0.01;
    this.elevation = clamp(this.elevation - dy * 0.008, -0.2, 1.4);
    return true;
  }

  protected onKey(event: KeyboardEvent) {
    const { key } = event;
    if (key === 'ArrowLeft') this.azimuth += 0.15;
    else if (key === 'ArrowRight') this.azimuth -= 0.15;
    else if (key === 'ArrowUp') this.elevation = clamp(this.elevation + 0.1, -0.2, 1.4);
    else if (key === 'ArrowDown') this.elevation = clamp(this.elevation - 0.1, -0.2, 1.4);
    else return false;
    return true;
  }

  protected update(dt: number, time: number) {
    if (this.turning && !this.reduce) this.azimuth += dt * 0.6;
    const radius = 5;
    this.key.position.set(
      Math.cos(this.elevation) * Math.sin(this.azimuth) * radius,
      Math.sin(this.elevation) * radius,
      Math.cos(this.elevation) * Math.cos(this.azimuth) * radius,
    );
    this.bulb.position.copy(this.key.position).multiplyScalar(0.75);
    const glowing = this.index === 3 ? 1 : 0;
    this.haloAmount = lerp(this.haloAmount, glowing, 0.12);
    this.halo.material.uniforms.amount.value = this.haloAmount;
    this.halo.visible = this.haloAmount > 0.01;
    if (!this.reduce) {
      if (glowing) this.materials[3].emissiveIntensity = 0.6 + Math.sin(time * 2) * 0.12;
      this.ball.rotation.y += dt * 0.2;
      this.core.rotation.y -= dt * 0.4;
    }
    return Math.abs(this.haloAmount - glowing) > 0.01 || (this.turning && !this.reduce);
  }

  protected disposeExtra(materials: Set<Material>) {
    this.materials.forEach((material) => materials.add(material));
    this.environment.traverse((object) => {
      if (object instanceof Mesh) {
        object.geometry.dispose();
        (object.material as Material).dispose();
      }
    });
    this.pmrem.dispose();
  }
}
