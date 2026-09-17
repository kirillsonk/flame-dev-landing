import {
  AmbientLight,
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  TorusGeometry,
  WebGLRenderer,
} from 'three';

export class RosatomScene {
  private scene = new Scene();
  private camera = new PerspectiveCamera(35, 1, 0.1, 100);
  private renderer: WebGLRenderer;
  private group = new Group();
  private electrons: Group[] = [];
  private coreMaterial = new MeshStandardMaterial({
    color: 0x3b78ff,
    emissive: 0x174ccc,
    emissiveIntensity: 0.6,
    roughness: 0.22,
    metalness: 0.55,
  });
  private target = { x: 0.2, y: 0 };
  private frame = 0;
  private last = 0;
  private angle = 0;
  private visible = false;
  private paused = false;
  private media = window.matchMedia('(prefers-reduced-motion: reduce)');
  private visual: HTMLElement | null;
  private observer: IntersectionObserver;
  private resize: ResizeObserver;

  constructor(private container: HTMLElement) {
    this.visual = container.closest<HTMLElement>('[data-part="visual"]');
    this.visual?.addEventListener('demo-visibility-change', this.sync);
    this.camera.position.z = 7.2;
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    container.appendChild(this.renderer.domElement);
    const nucleus = new Mesh(new SphereGeometry(0.65, 40, 32), this.coreMaterial);
    this.group.add(nucleus);
    const ringMaterial = new MeshStandardMaterial({
      color: 0x93bcff,
      emissive: 0x2359ba,
      emissiveIntensity: 0.55,
      metalness: 0.7,
      roughness: 0.2,
    });
    for (let i = 0; i < 3; i += 1) {
      const orbit = new Group();
      orbit.rotation.set(Math.PI / 2 + i * 0.75, (i * Math.PI) / 3, i * 0.3);
      orbit.add(new Mesh(new TorusGeometry(1.85, 0.024, 12, 128), ringMaterial));
      const rotor = new Group();
      const electron = new Mesh(
        new SphereGeometry(0.12, 20, 16),
        new MeshStandardMaterial({ color: 0xffffff, emissive: 0x90bcff, emissiveIntensity: 2 }),
      );
      electron.position.x = 1.85;
      rotor.rotation.z = i * 2;
      rotor.add(electron);
      orbit.add(rotor);
      this.electrons.push(rotor);
      this.group.add(orbit);
    }
    const halo = new Mesh(new TorusGeometry(0.88, 0.012, 8, 80), ringMaterial);
    halo.rotation.x = 0.4;
    this.group.add(halo);
    this.scene.add(this.group);
    const vertices = Array.from({ length: 240 }, (_, i) => Math.sin(i * 127.1 + 17) * (i % 3 === 2 ? 3 : 6));
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    this.scene.add(
      new Points(
        geometry,
        new PointsMaterial({ color: 0x638ad0, size: 0.025, transparent: true, opacity: 0.65 }),
      ),
    );
    this.scene.add(new AmbientLight(0xc4d8ff, 1.5));
    const key = new PointLight(0x9bbfff, 65);
    key.position.set(3, 3, 4);
    this.scene.add(key);
    const rim = new PointLight(0x3b78ff, 40);
    rim.position.set(-3, -2, 1);
    this.scene.add(rim);
    this.resize = new ResizeObserver(this.onResize);
    this.resize.observe(container);
    this.observer = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.sync();
    });
    this.observer.observe(container);
    container.addEventListener('pointermove', this.onPointer, { passive: true });
    container.addEventListener('keydown', this.onKey);
    document.addEventListener('visibilitychange', this.sync);
    this.media.addEventListener('change', this.sync);
    this.onResize();
  }
  private onResize = () => {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.position.z = this.camera.aspect < 1 ? 9 : 7.2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.render();
  };
  private onPointer = (event: PointerEvent) => {
    const rect = this.container.getBoundingClientRect();
    this.target.y = ((event.clientX - rect.left) / rect.width) * 1.8 - 0.9;
    this.target.x = (event.clientY - rect.top) / rect.height - 0.5;
    if (this.media.matches || this.paused) this.render(true);
  };
  private onKey = (event: KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    this.target.y += event.key === 'ArrowLeft' ? -0.2 : event.key === 'ArrowRight' ? 0.2 : 0;
    this.target.x += event.key === 'ArrowUp' ? -0.2 : event.key === 'ArrowDown' ? 0.2 : 0;
    this.render(true);
  };
  setMode(wireframe: boolean) {
    this.coreMaterial.wireframe = wireframe;
    this.render();
  }
  setPaused(paused: boolean) {
    this.paused = paused;
    this.sync();
  }
  reset() {
    this.angle = 0;
    this.target = { x: 0.2, y: 0 };
    this.render(true);
  }
  private render(immediate = false) {
    const ease = immediate ? 1 : 0.06;
    this.group.rotation.x += (this.target.x - this.group.rotation.x) * ease;
    this.group.rotation.y += (this.target.y + this.angle - this.group.rotation.y) * ease;
    this.renderer.render(this.scene, this.camera);
  }
  private sync = () => {
    cancelAnimationFrame(this.frame);
    this.last = 0;
    if (this.visible && !this.visual?.inert && !document.hidden && !this.media.matches && !this.paused)
      this.frame = requestAnimationFrame(this.tick);
    else this.render(true);
  };
  private tick = (time: number) => {
    const delta = this.last ? Math.min((time - this.last) / 1000, 0.05) : 0;
    this.last = time;
    this.angle += delta * 0.12;
    this.electrons.forEach((electron, index) => {
      electron.rotation.z += delta * (0.65 + index * 0.2);
    });
    this.render();
    this.frame = requestAnimationFrame(this.tick);
  };
  dispose() {
    cancelAnimationFrame(this.frame);
    this.observer.disconnect();
    this.resize.disconnect();
    this.visual?.removeEventListener('demo-visibility-change', this.sync);
    this.container.removeEventListener('pointermove', this.onPointer);
    this.container.removeEventListener('keydown', this.onKey);
    document.removeEventListener('visibilitychange', this.sync);
    this.media.removeEventListener('change', this.sync);
    this.scene.traverse((object) => {
      if (object instanceof Mesh || object instanceof Points) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
