import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { buildRoute } from './core/route';
import { World } from './core/world';
import { loadAssets } from './core/assets';
import { buildOverlays } from './ui/overlays';
import { buildRail } from './ui/rail';
import { buildEnvironment } from './stations/environment';
import { buildAbout } from './stations/about';
import { buildClients } from './stations/clients';
import { buildWhatIDo } from './stations/whatido';
import { buildStack } from './stations/stack';
import { buildServices } from './stations/services';
import { buildProjects } from './stations/projects';
import { buildContacts } from './stations/contacts';
import { reducedMotion } from './core/quality';

gsap.registerPlugin(ScrollTrigger);

const SCREENS_PER_STOP = 0.75;

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

async function start(): Promise<void> {
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  const route = buildRoute();
  const overlays = buildOverlays(route);

  if (!webglAvailable()) {
    // Static, fully readable fallback: all overlays stacked in order.
    document.body.classList.add('no-webgl');
    return;
  }

  const canvas = document.getElementById('webgl') as HTMLCanvasElement;
  const loader = document.getElementById('loader')!;
  const loaderBar = loader.querySelector<HTMLElement>('.loader-bar i')!;

  const assets = await loadAssets((ratio) => {
    loaderBar.style.width = `${Math.round(ratio * 100)}%`;
  });

  const world = new World(canvas, route);
  buildEnvironment(world, route);
  buildAbout(world, route, assets);
  buildClients(world, route, assets);
  buildWhatIDo(world, route);
  buildStack(world, route);
  buildServices(world, route, assets);
  buildProjects(world, route);
  buildContacts(world, route);

  // Scroll height: one journey segment per stop.
  const spacer = document.getElementById('spacer')!;
  spacer.style.height = `${route.stops.length * SCREENS_PER_STOP * 100 + 100}vh`;

  const lenis = new Lenis({
    lerp: reducedMotion ? 1 : 0.1,
    wheelMultiplier: 0.9,
  });
  lenis.on('scroll', ScrollTrigger.update);

  const st = ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => world.setProgress(self.progress),
  });
  if (import.meta.env.DEV) {
    (window as unknown as Record<string, unknown>).__st = st;
    (window as unknown as Record<string, unknown>).__route = route;
  }

  const rail = buildRail(route, (t) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    lenis.scrollTo(t * max, { duration: reducedMotion ? 0 : 2.2 });
  });

  let last = performance.now();
  gsap.ticker.add(() => {
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    lenis.raf(now);
    const progress = world.tick(dt, now / 1000);
    overlays.sync(progress);
    rail.sync(progress);
  });
  gsap.ticker.lagSmoothing(0);

  loader.classList.add('done');

  // Hero entrance
  if (!reducedMotion) {
    const hero = overlays.root.querySelector('.overlay .panel');
    if (hero) {
      gsap.from(hero.children, {
        y: 26,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.25,
      });
    }
  }
}

start().catch((err) => {
  console.error(err);
  document.body.classList.add('no-webgl');
  document.getElementById('loader')?.classList.add('done');
  if (!document.getElementById('ui')?.children.length) {
    buildOverlays(buildRoute());
  }
});
