import type { Route } from '../core/route';

interface RailSection {
  label: string;
  t: number;
}

export interface Rail {
  sync(progress: number): void;
}

/** Side navigation rail: one dot per chapter, click to travel. */
export function buildRail(route: Route, scrollToProgress: (t: number) => void): Rail {
  const firstOf = (kind: string): number => route.stops.find((s) => s.kind === kind)!.t;
  const sections: RailSection[] = [
    { label: 'About', t: 0 },
    { label: 'Clients', t: firstOf('clients') },
    { label: 'What I do', t: firstOf('whatido') },
    { label: 'Stack', t: firstOf('stack') },
    { label: 'Services', t: firstOf('service') },
    { label: 'Projects', t: firstOf('project') },
    { label: 'Contact', t: firstOf('contacts') },
  ];

  const nav = document.createElement('nav');
  nav.className = 'rail';
  nav.setAttribute('aria-label', 'Sections');
  const buttons: HTMLButtonElement[] = [];

  sections.forEach((section) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = `<i></i><span>${section.label}</span>`;
    btn.addEventListener('click', () => scrollToProgress(section.t));
    nav.appendChild(btn);
    buttons.push(btn);
  });
  document.body.appendChild(nav);

  const sync = (progress: number): void => {
    let active = 0;
    for (let i = 0; i < sections.length; i += 1) {
      if (progress >= sections[i].t - 0.012) active = i;
    }
    buttons.forEach((b, i) => b.classList.toggle('active', i === active));
  };

  sync(0);
  return { sync };
}
