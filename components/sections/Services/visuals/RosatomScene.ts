import {
  AmbientLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  TorusGeometry,
  WebGLRenderer,
} from 'three';

export class RosatomScene {
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private group = new Group();
  private target = { x: 0, y: 0 };
  private frame = 0;
  private container: HTMLElement;
  private reduced: boolean;

  constructor(container: HTMLElement) {
    this.container = container;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const { clientWidth: w, clientHeight: h } = container;
    this.camera = new PerspectiveCamera(35, w / h, 0.1, 100);
    this.camera.position.z = 7;

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    container.appendChild(this.renderer.domElement);

    const core = new Mesh(new SphereGeometry(0.7, 48, 48), new MeshStandardMaterial({ color: 0x3b78ff, roughness: 0.3, metalness: 0.4 }));
    this.group.add(core);

    const ringMaterial = new MeshStandardMaterial({ color: 0xfcfbfb, roughness: 0.2, metalness: 0.8 });
    const tilts = [0, Math.PI / 3, -Math.PI / 3];
    tilts.forEach((tilt, i) => {
      const ring = new Mesh(new TorusGeometry(1.8, 0.05, 16, 120), ringMaterial);
      ring.rotation.x = Math.PI / 2 + tilt * 0.4;
      ring.rotation.y = tilt + i * 0.2;
      this.group.add(ring);
    });

    this.scene.add(this.group);
    this.scene.add(new AmbientLight(0xffffff, 0.6));
    const key = new PointLight(0x6394ff, 40);
    key.position.set(3, 3, 4);
    this.scene.add(key);
    const fill = new PointLight(0xd7141a, 12);
    fill.position.set(-3, -2, 3);
    this.scene.add(fill);

    window.addEventListener('pointermove', this.onPointer, { passive: true });
    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVisibility);
    this.tick();
  }

  private onPointer = (e: PointerEvent) => {
    const rect = this.container.getBoundingClientRect();
    this.target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 1.2;
    this.target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 1.2;
  };

  private onResize = () => {
    const { clientWidth: w, clientHeight: h } = this.container;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(this.frame);
    } else {
      this.tick();
    }
  };

  private tick = () => {
    this.frame = requestAnimationFrame(this.tick);
    this.group.rotation.y += (this.target.x - this.group.rotation.y) * 0.05 + (this.reduced ? 0 : 0.003);
    this.group.rotation.x += (this.target.y - this.group.rotation.x) * 0.05;
    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    cancelAnimationFrame(this.frame);
    window.removeEventListener('pointermove', this.onPointer);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.group.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.geometry.dispose();
        (obj.material as MeshStandardMaterial).dispose();
      }
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
