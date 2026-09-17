import {
  AmbientLight,
  CanvasTexture,
  DirectionalLight,
  PointLight,
  Line,
  Mesh,
  Object3D,
  PerspectiveCamera,
  Points,
  Scene,
  Sprite,
  Vector3,
  WebGLRenderer,
} from 'three';
import type { Material, Texture } from 'three';

export const COLORS = {
  blue: 0x1029ff,
  blueHover: 0x3a56ff,
  cyan: 0x00e1fd,
  fire: 0xf13911,
  gold: 0xf3c96b,
  ok: 0x31d269,
  cold: 0xb4bbc4,
  dim: 0x9d9c9e,
  text: 0xfcfbfb,
  elevated: 0x3d3d3e,
};

export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export interface IScreenPoint {
  x: number;
  y: number;
  z: number;
}

// Общий движок 3D-демо: рендерер, цикл кадров с паузой вне экрана/в неактивной сцене/скрытой вкладке,
// перетаскивание, клавиши и освобождение GPU-ресурсов. Колесо мыши не слушаем — прокрутка страницы свободна.
export abstract class Web3dScene {
  protected scene = new Scene();
  protected camera = new PerspectiveCamera(38, 1, 0.05, 500);
  protected renderer: WebGLRenderer;
  protected width = 1;
  protected height = 1;
  protected orbit = { yaw: 0.4, pitch: 0.22, vy: 0, vp: 0, auto: 0.12, enabled: true, minP: -1.25, maxP: 1.25 };
  protected dragging = false;
  private shift = { x: 0, y: 0 };
  private textures: Texture[] = [];
  private frame = 0;
  private last = 0;
  private awakeUntil = 0;
  private visible = false;
  private pointer: { x: number; y: number; moved: number } | null = null;
  private media = window.matchMedia('(prefers-reduced-motion: reduce)');
  private visual: HTMLElement | null;
  private observer: IntersectionObserver;
  private resize: ResizeObserver;
  private point = new Vector3();

  constructor(protected container: HTMLElement) {
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.setClearColor(0x000000, 0);
    container.appendChild(this.renderer.domElement);
    this.camera.position.set(0, 0, 12);
    this.visual = container.closest<HTMLElement>('[data-part="visual"]');
    this.observer = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.sync();
    });
    this.resize = new ResizeObserver(this.onResize);
  }

  protected get reduce() {
    return this.media.matches;
  }

  // Вызывается наследником в конце конструктора, когда сцена уже собрана.
  protected start() {
    const { container } = this;
    this.visual?.addEventListener('demo-visibility-change', this.sync);
    document.addEventListener('visibilitychange', this.sync);
    this.media.addEventListener('change', this.sync);
    container.addEventListener('pointerdown', this.onPointerDown);
    container.addEventListener('pointermove', this.onPointerMove);
    container.addEventListener('pointerup', this.onPointerUp);
    container.addEventListener('pointercancel', this.onPointerCancel);
    container.addEventListener('keydown', this.onKeyDown);
    this.resize.observe(container);
    this.observer.observe(container);
    this.onResize();
  }

  protected abstract update(dt: number, time: number): boolean;
  protected onDrag(dx: number, dy: number, event: PointerEvent): boolean {
    void event;
    if (!this.orbit.enabled) return false;
    this.orbit.vy = dx * 0.006;
    this.orbit.vp = dy * 0.006;
    this.orbit.yaw += this.orbit.vy;
    this.orbit.pitch = clamp(this.orbit.pitch + this.orbit.vp, this.orbit.minP, this.orbit.maxP);
    return true;
  }
  protected onRelease() {}
  protected onKey(event: KeyboardEvent): boolean {
    void event;
    return false;
  }
  protected onLayout() {}

  // Смещение камеры, чтобы объект не прятался под панелями: по горизонтали в широкой рамке, по вертикали в узкой.
  protected setShift(x: number, y = 0) {
    this.shift = { x, y };
    this.applyShift();
    this.camera.updateProjectionMatrix();
  }

  // Свет прототипов (r128, legacy lights) переведён в физические единицы three: интенсивность × π, без затухания.
  protected addLights() {
    const ambient = new AmbientLight(0xb4bbc4, 0.55 * Math.PI);
    const key = new DirectionalLight(0xffffff, 1.05 * Math.PI);
    key.position.set(4, 6, 8);
    const rim = new PointLight(COLORS.cyan, 1.1 * Math.PI, 60, 0);
    rim.position.set(-7, -3, 5);
    this.scene.add(ambient, key, rim);
    return { ambient, key, rim };
  }

  protected get portrait() {
    return this.width <= this.height;
  }

  private applyShift() {
    const { width: w, height: h, shift } = this;
    if (shift.x && !this.portrait) this.camera.setViewOffset(w, h, -shift.x * w, 0, w, h);
    else if (shift.y && this.portrait) this.camera.setViewOffset(w, h, 0, shift.y * h, w, h);
    else this.camera.clearViewOffset();
  }

  wake(ms = 700) {
    this.awakeUntil = Math.max(this.awakeUntil, performance.now() + ms);
    if (!this.frame && this.canRun()) this.frame = requestAnimationFrame(this.tick);
  }

  private canRun() {
    return this.visible && !this.visual?.inert && !document.hidden;
  }

  private sync = () => {
    if (this.canRun()) {
      this.wake();
      return;
    }
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.last = 0;
    this.endPointer(true);
  };

  private tick = (now: number) => {
    this.frame = 0;
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0.016;
    this.last = now;
    const busy = this.update(dt, now / 1000);
    this.renderer.render(this.scene, this.camera);
    if (!this.canRun()) {
      this.last = 0;
      return;
    }
    if (!this.reduce || busy || this.dragging || now < this.awakeUntil) this.frame = requestAnimationFrame(this.tick);
    else this.last = 0;
  };

  private onResize = () => {
    this.width = Math.max(1, this.container.clientWidth);
    this.height = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    this.onLayout();
    this.applyShift();
    this.camera.updateProjectionMatrix();
    this.wake(100);
  };

  private onPointerDown = (event: PointerEvent) => {
    if (event.button > 0) return;
    this.pointer = { x: event.clientX, y: event.clientY, moved: 0 };
    this.dragging = true;
    try {
      this.container.setPointerCapture(event.pointerId);
    } catch {}
    this.container.dataset.drag = 'true';
    this.wake();
  };

  private onPointerMove = (event: PointerEvent) => {
    if (!this.pointer) return;
    const dx = event.clientX - this.pointer.x;
    const dy = event.clientY - this.pointer.y;
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
    this.pointer.moved += Math.abs(dx) + Math.abs(dy);
    this.onDrag(dx, dy, event);
  };

  private onPointerUp = () => this.endPointer(false);
  private onPointerCancel = () => this.endPointer(true);

  private endPointer(cancel: boolean) {
    if (!this.pointer) return;
    this.pointer = null;
    this.dragging = false;
    delete this.container.dataset.drag;
    if (!cancel) this.onRelease();
    this.wake(1600);
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.onKey(event)) {
      event.preventDefault();
      this.wake(1200);
      return;
    }
    if (!this.orbit.enabled) return;
    const { key } = event;
    if (key === 'ArrowLeft') this.orbit.vy = -0.07;
    else if (key === 'ArrowRight') this.orbit.vy = 0.07;
    else if (key === 'ArrowUp') this.orbit.vp = -0.05;
    else if (key === 'ArrowDown') this.orbit.vp = 0.05;
    else return;
    event.preventDefault();
    this.wake(1400);
  }

  // Инерция вращения; возвращает true, пока объект ещё докручивается.
  protected orbitStep(dt: number, object?: Object3D) {
    const { orbit } = this;
    if (!this.dragging) {
      orbit.yaw += orbit.vy + (this.reduce ? 0 : orbit.auto * dt);
      orbit.pitch = clamp(orbit.pitch + orbit.vp, orbit.minP, orbit.maxP);
      const k = Math.pow(0.03, dt);
      orbit.vy *= k;
      orbit.vp *= k;
    }
    object?.rotation.set(orbit.pitch, orbit.yaw, 0);
    return Math.abs(orbit.vy) > 2e-4 || Math.abs(orbit.vp) > 2e-4;
  }

  protected toScreen(source: Object3D | Vector3): IScreenPoint {
    if (source instanceof Object3D) source.getWorldPosition(this.point);
    else this.point.copy(source);
    this.point.project(this.camera);
    return {
      x: ((this.point.x + 1) / 2) * this.width,
      y: ((1 - this.point.y) / 2) * this.height,
      z: this.point.z,
    };
  }

  protected glowTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(0,225,253,.55)') {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, inner);
      gradient.addColorStop(0.25, outer);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);
    }
    return this.track(new CanvasTexture(canvas));
  }

  protected track<T extends Texture>(texture: T) {
    this.textures.push(texture);
    return texture;
  }

  dispose() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    const { container } = this;
    this.observer.disconnect();
    this.resize.disconnect();
    this.visual?.removeEventListener('demo-visibility-change', this.sync);
    document.removeEventListener('visibilitychange', this.sync);
    this.media.removeEventListener('change', this.sync);
    container.removeEventListener('pointerdown', this.onPointerDown);
    container.removeEventListener('pointermove', this.onPointerMove);
    container.removeEventListener('pointerup', this.onPointerUp);
    container.removeEventListener('pointercancel', this.onPointerCancel);
    container.removeEventListener('keydown', this.onKeyDown);
    const materials = new Set<Material>();
    this.scene.traverse((object) => {
      if (object instanceof Mesh || object instanceof Points || object instanceof Line) {
        object.geometry.dispose();
      }
      if (object instanceof Mesh || object instanceof Points || object instanceof Line || object instanceof Sprite) {
        const list = Array.isArray(object.material) ? object.material : [object.material];
        list.forEach((material) => materials.add(material));
      }
    });
    this.disposeExtra(materials);
    materials.forEach((material) => material.dispose());
    this.textures.forEach((texture) => texture.dispose());
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }

  // Материалы и ресурсы, которые не висят в сцене постоянно (например, запасные материалы шара).
  protected disposeExtra(materials: Set<Material>) {
    void materials;
  }
}
