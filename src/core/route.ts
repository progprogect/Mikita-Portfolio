import * as THREE from 'three';
import { services } from '../content/services';
import { projects } from '../content/projects';
import { quality } from './quality';

export type StopKind =
  | 'about'
  | 'clients'
  | 'whatido'
  | 'stack'
  | 'service'
  | 'project'
  | 'cta'
  | 'contacts';

export interface RouteStop {
  id: string;
  kind: StopKind;
  /** index within the whole route */
  index: number;
  /** index within its kind (service #, project #) */
  dataIndex: number;
  /** normalized position along the curve [0..1] */
  t: number;
  position: THREE.Vector3;
  tangent: THREE.Vector3;
  /** unit vector pointing to the side the 3D panel sits on */
  side: THREE.Vector3;
  sideSign: 1 | -1;
  /** where side panels / station decor should be placed */
  contentPosition: THREE.Vector3;
}

export interface Route {
  stops: RouteStop[];
  curve: THREE.CatmullRomCurve3;
  /** distance between two neighbouring stops in t-space */
  segment: number;
  length: number;
}

const STOP_SPACING = 30;
const UP = new THREE.Vector3(0, 1, 0);

/** CTA interludes appear after the 3rd and the 10th project. */
const CTA_AFTER = new Set([2, 9]);

interface StopSeed {
  id: string;
  kind: StopKind;
  dataIndex: number;
}

function buildSeeds(): StopSeed[] {
  const seeds: StopSeed[] = [
    { id: 'about', kind: 'about', dataIndex: 0 },
    { id: 'clients', kind: 'clients', dataIndex: 0 },
    { id: 'whatido', kind: 'whatido', dataIndex: 0 },
    { id: 'stack', kind: 'stack', dataIndex: 0 },
  ];
  services.forEach((s, i) => seeds.push({ id: `service-${s.id}`, kind: 'service', dataIndex: i }));
  let ctaCount = 0;
  projects.forEach((p, i) => {
    seeds.push({ id: `project-${p.id}`, kind: 'project', dataIndex: i });
    if (CTA_AFTER.has(i)) {
      seeds.push({ id: `cta-${ctaCount}`, kind: 'cta', dataIndex: ctaCount });
      ctaCount += 1;
    }
  });
  seeds.push({ id: 'contacts', kind: 'contacts', dataIndex: 0 });
  return seeds;
}

export function buildRoute(): Route {
  const seeds = buildSeeds();
  const n = seeds.length;

  const points = seeds.map(
    (_, i) =>
      new THREE.Vector3(
        Math.sin(i * 0.55) * 16,
        Math.cos(i * 0.38) * 6.5,
        -i * STOP_SPACING,
      ),
  );

  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);

  // Map each stop to its normalized arc-length position on the curve.
  const chord: number[] = [0];
  for (let i = 1; i < n; i += 1) {
    chord.push(chord[i - 1] + points[i].distanceTo(points[i - 1]));
  }
  const total = chord[n - 1];

  const stops: RouteStop[] = seeds.map((seed, i) => {
    const t = chord[i] / total;
    const position = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    const sideSign: 1 | -1 = i % 2 === 0 ? 1 : -1;
    const side = new THREE.Vector3().crossVectors(tangent, UP).normalize();
    const centered = seed.kind === 'about' || seed.kind === 'cta' || seed.kind === 'contacts';
    const lateral = centered ? 0 : quality.panelSide * sideSign;
    const contentPosition = position
      .clone()
      .addScaledVector(tangent, quality.panelAhead)
      .addScaledVector(side, lateral);
    return {
      ...seed,
      index: i,
      t,
      position,
      tangent,
      side,
      sideSign,
      contentPosition,
    };
  });

  return { stops, curve, segment: 1 / (n - 1), length: total };
}
