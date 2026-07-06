import type { Route, RouteStop, StopKind } from '../core/route';
import { profile, whatIDo } from '../content/profile';
import { clientsSection, clients } from '../content/clients';
import { stackSection, stack } from '../content/stack';
import { servicesSection, services } from '../content/services';
import { projectsSection, projects, cta } from '../content/projects';
import { clamp, smoothstep } from '../core/utils';
import { isMobile, reducedMotion } from '../core/quality';

interface OverlayItem {
  el: HTMLElement;
  t: number;
  /** sequential mode: image first, then the text replaces it (mobile) */
  swap: boolean;
}

/** Stations that have a 3D image/card the camera flies past on mobile. */
const SWAP_KINDS = new Set<StopKind>(['clients', 'whatido', 'stack', 'service', 'project']);

export interface Overlays {
  root: HTMLElement;
  sync(progress: number): void;
}

const chips = (items: readonly string[], cls = ''): string =>
  `<div class="chips ${cls}">${items.map((i) => `<span>${i}</span>`).join('')}</div>`;

const ctaButtons = (): string => `
  <div class="actions">
    <a class="btn primary" href="mailto:${profile.email}">${cta.emailLabel}</a>
    <a class="btn ghost" href="${profile.linkedin}" target="_blank" rel="noopener">${cta.linkedinLabel}</a>
  </div>`;

function overlayHTML(stop: RouteStop): { html: string; pos: 'left' | 'right' | 'center' } {
  switch (stop.kind) {
    case 'about':
      return {
        pos: 'left',
        html: `
          <p class="eyebrow">Systems Architect &middot; Senior Engineer</p>
          <h1>${profile.name}</h1>
          <p class="role">${profile.role}</p>
          <div class="panel-body">
            ${chips(profile.tags)}
            <div class="stats">
              ${profile.stats.map((s) => `<div class="stat"><b>${s.value}</b><span>${s.label}</span></div>`).join('')}
            </div>
            <p class="intro">${profile.intro}</p>
          </div>`,
      };
    case 'clients':
      return {
        pos: 'center',
        html: `
          <p class="eyebrow">Clients</p>
          <h2>${clientsSection.title}</h2>
          <div class="panel-body">
            <p class="lead">${clientsSection.lead}</p>
            <p class="note">${clientsSection.note}</p>
            ${chips(clients.map((c) => c.name), 'dim')}
          </div>`,
      };
    case 'whatido':
      return {
        pos: stop.sideSign === 1 ? 'left' : 'right',
        html: `
          <p class="eyebrow">What I do</p>
          <h2>${whatIDo.title}</h2>
          <div class="panel-body">
            <p class="lead">${whatIDo.lead}</p>
            <ul class="items">
              ${whatIDo.items.map((i) => `<li><b>${i.title}</b><span>${i.text}</span></li>`).join('')}
            </ul>
          </div>`,
      };
    case 'stack':
      return {
        pos: stop.sideSign === 1 ? 'left' : 'right',
        html: `
          <p class="eyebrow">Stack</p>
          <h2>${stackSection.title}</h2>
          <div class="panel-body">
            <p class="lead">${stackSection.lead}</p>
            <div class="stack-groups">
              ${stack
                .map((g) => `<div class="stack-group"><h3>${g.title}</h3>${chips(g.items)}</div>`)
                .join('')}
            </div>
          </div>`,
      };
    case 'service': {
      const service = services[stop.dataIndex];
      const num = String(stop.dataIndex + 1).padStart(2, '0');
      return {
        pos: stop.sideSign === 1 ? 'left' : 'right',
        html: `
          <p class="eyebrow">${servicesSection.title} &middot; ${num}/${String(services.length).padStart(2, '0')}</p>
          <h2>${service.title}</h2>
          <div class="panel-body">
            <p class="lead">${service.text}</p>
          </div>`,
      };
    }
    case 'project': {
      const project = projects[stop.dataIndex];
      const num = String(stop.dataIndex + 1).padStart(2, '0');
      return {
        pos: stop.sideSign === 1 ? 'left' : 'right',
        html: `
          <p class="eyebrow">${projectsSection.title} &middot; ${num}/${String(projects.length).padStart(2, '0')}</p>
          <h2>${project.title}</h2>
          <div class="panel-body">
            <p class="lead">${project.summary}</p>
            <ul class="highlights">${project.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>
            ${chips(project.tech, 'dim')}
          </div>`,
      };
    }
    case 'cta':
      return {
        pos: 'center',
        html: `
          <h2 class="cta-title">${cta.question}</h2>
          <div class="panel-body">
            <p class="lead">${cta.text}</p>
            ${ctaButtons()}
          </div>`,
      };
    case 'contacts':
      return {
        pos: 'center',
        html: `
          <p class="eyebrow">Contacts</p>
          <h2 class="cta-title">Let&rsquo;s build something great</h2>
          <div class="panel-body">
            <p class="lead">From an idea on a napkin to a robot on your production line.</p>
            ${ctaButtons()}
            <p class="note">${profile.email}</p>
          </div>`,
      };
  }
}

export function buildOverlays(route: Route): Overlays {
  const root = document.getElementById('ui')!;
  const items: OverlayItem[] = [];

  const swapMode = isMobile && !reducedMotion;

  for (const stop of route.stops) {
    const { html, pos } = overlayHTML(stop);
    const el = document.createElement('section');
    el.className = `overlay pos-${pos}`;
    el.dataset.id = stop.id;
    el.innerHTML = `<div class="panel">${html}</div>`;
    root.appendChild(el);
    items.push({ el, t: stop.t, swap: swapMode && SWAP_KINDS.has(stop.kind) });
  }

  // Wider window with a flat top: the block stays fully readable around its
  // stop and crossfades with neighbours without an empty gap in between.
  const windowSize = route.segment * 0.62;
  const FLAT = 0.45;

  const hide = (item: OverlayItem): void => {
    if (item.el.style.visibility !== 'hidden') {
      item.el.style.visibility = 'hidden';
      item.el.classList.remove('active', 'focus');
    }
  };

  const sync = (progress: number): void => {
    for (const item of items) {
      const d = (progress - item.t) / windowSize;

      if (item.swap) {
        // Sequential mode (mobile): the 3D image owns the screen while the
        // camera approaches and passes it (d < ~0.28); only then the text
        // block fades in, holds, and fades away before the next station.
        if (d <= 0.26 || d >= 1.5) {
          hide(item);
          continue;
        }
        item.el.style.visibility = 'visible';
        const o = smoothstep(0.3, 0.55, d) * (1 - smoothstep(1.15, 1.45, d));
        item.el.style.opacity = o.toFixed(3);
        item.el.style.transform = `translateY(${(-(d - 0.85) * 3).toFixed(2)}vh)`;
        item.el.classList.toggle('active', d > 0.32 && d < 1.45);
        item.el.classList.toggle('focus', d > 0.4 && d < 1.35);
        continue;
      }

      const abs = Math.abs(d);
      if (abs >= 1.02) {
        hide(item);
        continue;
      }
      item.el.style.visibility = 'visible';
      const fade = clamp((1 - abs) / (1 - FLAT), 0, 1);
      const eased = fade * fade * (3 - 2 * fade);
      item.el.style.opacity = eased.toFixed(3);
      item.el.style.transform = `translateY(${(-d * 3).toFixed(2)}vh)`;
      item.el.classList.toggle('active', abs < 0.72);
      // On mobile the panel body stays collapsed while approaching; it
      // expands only when the stop is centered (see CSS for .focus).
      item.el.classList.toggle('focus', abs < 0.5);
    }
    root.classList.toggle('scrolled', progress > 0.012);
  };

  sync(0);
  return { root, sync };
}
