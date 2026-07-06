import * as THREE from 'three';
import type { Route } from './route';
import { clamp, smoothstep } from './utils';
import { quality, reducedMotion, isMobile } from './quality';

export interface Updatable {
  update(dt: number, elapsed: number, progress: number): void;
}

const BG = 0x05070e;

export class World {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly updatables: Updatable[] = [];

  private route: Route;
  private targetProgress = 0;
  private easedProgress = 0;
  private mouse = new THREE.Vector2(0, 0);
  private parallax = new THREE.Vector2(0, 0);
  private lookAhead: number;

  constructor(canvas: HTMLCanvasElement, route: Route) {
    this.route = route;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(quality.dpr);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(BG, 1);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(BG, 0.0105);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      320,
    );
    this.lookAhead = route.segment * 0.55;

    const start = route.curve.getPointAt(0);
    this.camera.position.copy(start);
    this.camera.lookAt(route.curve.getPointAt(this.lookAhead));

    window.addEventListener('resize', this.onResize);
    if (!reducedMotion) {
      window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    }
  }

  setProgress(p: number): void {
    this.targetProgress = clamp(p, 0, 1);
  }

  private onResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private onPointerMove = (e: PointerEvent): void => {
    this.mouse.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
  };

  tick(dt: number, elapsed: number): number {
    const k = 1 - Math.exp(-dt * 4.5);
    this.easedProgress += (this.targetProgress - this.easedProgress) * k;
    const t = clamp(this.easedProgress, 0, 1);

    const pos = this.route.curve.getPointAt(t);
    const look = this.route.curve.getPointAt(Math.min(t + this.lookAhead, 1));

    // On mobile the camera turns toward each station's content while it is
    // still ahead, framing the image full-screen; right after the fly-past
    // the blend releases and the text overlay takes over the screen.
    if (isMobile && !reducedMotion) {
      let nearest = this.route.stops[0];
      let nearestD = Infinity;
      for (const s of this.route.stops) {
        const d = Math.abs(t - s.t);
        if (d < nearestD) {
          nearestD = d;
          nearest = s;
        }
      }
      const signed = (t - nearest.t) / this.route.segment;
      // ramp in while approaching, release just before passing the content
      const w = smoothstep(-0.6, -0.28, signed) * (1 - smoothstep(0.02, 0.13, signed));
      if (w > 0.001) {
        look.lerp(nearest.contentPosition, w * 0.7);
      }
    }

    this.camera.position.copy(pos);
    this.camera.lookAt(look);

    if (!reducedMotion) {
      const pk = 1 - Math.exp(-dt * 3);
      this.parallax.x += (this.mouse.x * 0.9 - this.parallax.x) * pk;
      this.parallax.y += (-this.mouse.y * 0.55 - this.parallax.y) * pk;
      this.camera.translateX(this.parallax.x);
      this.camera.translateY(this.parallax.y);
    }

    for (const u of this.updatables) u.update(dt, elapsed, t);
    this.renderer.render(this.scene, this.camera);
    return t;
  }
}
