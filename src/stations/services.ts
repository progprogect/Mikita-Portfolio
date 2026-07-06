import * as THREE from 'three';
import type { Route } from '../core/route';
import type { World } from '../core/world';
import type { Assets } from '../core/assets';
import { services } from '../content/services';
import { quality } from '../core/quality';
import { makePanel, faceApproach, ACCENT, ACCENT_WARM } from './common';

/**
 * Station 5 — eight sub-stations of "How I can help".
 * Each has its diagram(s) on floating 3D panels; tilt, float phase and
 * glow color vary per stop so transitions feel related but not identical.
 */
export function buildServices(world: World, route: Route, assets: Assets): void {
  const { scene } = world;
  const panelWidth = quality.panelSide < 3 ? 2.6 : 4.2;

  route.stops
    .filter((s) => s.kind === 'service')
    .forEach((stop) => {
      const service = services[stop.dataIndex];
      const textures = assets.serviceImages.get(service.id) ?? [];
      const glow = stop.dataIndex % 2 === 0 ? ACCENT : ACCENT_WARM;

      textures.forEach((texture, ti) => {
        const panel = makePanel(texture, panelWidth, 800 / 500, {
          glow,
          floatAmp: 0.14 + ti * 0.05,
          floatSpeed: 0.6 + stop.dataIndex * 0.07,
          phase: stop.dataIndex * 1.3 + ti * 2.1,
        });
        const spread = textures.length > 1 ? (ti === 0 ? -1 : 1) : 0;
        panel.group.position
          .copy(stop.contentPosition)
          .addScaledVector(stop.side, spread * stop.sideSign * (panelWidth * 0.36))
          .addScaledVector(stop.tangent, ti * 2.4)
          .add(new THREE.Vector3(0, spread * 0.5, 0));
        faceApproach(panel.group, stop.tangent);
        // per-stop tilt variation
        panel.group.rotateZ((stop.dataIndex % 3 - 1) * 0.05);
        panel.group.rotateY(stop.sideSign * -0.22);
        scene.add(panel.group);
        world.updatables.push(panel.updatable);
      });
    });
}
