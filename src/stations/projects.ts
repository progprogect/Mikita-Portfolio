import * as THREE from 'three';
import type { Route } from '../core/route';
import type { World } from '../core/world';
import type { Assets } from '../core/assets';
import { projects } from '../content/projects';
import { makeProjectCardTexture, makeDotTexture } from '../core/utils';
import { quality, reducedMotion } from '../core/quality';
import { makePanel, faceApproach, ACCENT, ACCENT_WARM } from './common';

/** Station 6 — a 3D card per project along the path + particle swirls at CTA stops. */
export function buildProjects(world: World, route: Route, assets: Assets): void {
  const { scene } = world;
  const cardWidth = quality.panelSide < 3 ? 3.1 : 4.4;

  route.stops
    .filter((s) => s.kind === 'project')
    .forEach((stop) => {
      const project = projects[stop.dataIndex];
      const num = String(stop.dataIndex + 1).padStart(2, '0');
      const texture = makeProjectCardTexture(num, project.title);
      const glow = stop.dataIndex % 2 === 0 ? ACCENT : ACCENT_WARM;
      const panel = makePanel(texture, cardWidth, 820 / 512, {
        glow,
        floatAmp: 0.12,
        floatSpeed: 0.55 + (stop.dataIndex % 4) * 0.08,
        phase: stop.dataIndex * 1.7,
      });
      panel.group.position.copy(stop.contentPosition);
      faceApproach(panel.group, stop.tangent);
      panel.group.rotateY(stop.sideSign * -0.24);
      panel.group.rotateZ((stop.dataIndex % 3 - 1) * 0.04);
      scene.add(panel.group);
      world.updatables.push(panel.updatable);

      // On-site photos flank the card: one above and ahead, one below and further.
      const photos = assets.projectImages.get(project.id) ?? [];
      photos.forEach((texture, pi) => {
        const shot = makePanel(texture, cardWidth * 0.74, 800 / 500, {
          glow,
          floatAmp: 0.1 + pi * 0.04,
          floatSpeed: 0.5 + pi * 0.11,
          phase: stop.dataIndex * 1.7 + pi * 2.3,
        });
        shot.group.position
          .copy(stop.contentPosition)
          .addScaledVector(stop.side, (pi === 0 ? -1 : 1) * stop.sideSign * cardWidth * 1.02)
          .addScaledVector(stop.tangent, 2.2 + pi * 2.6)
          .add(new THREE.Vector3(0, pi === 0 ? 1.2 : -1.5, 0));
        faceApproach(shot.group, stop.tangent);
        shot.group.rotateY(stop.sideSign * -0.3);
        shot.group.rotateZ((pi === 0 ? 1 : -1) * 0.035);
        scene.add(shot.group);
        world.updatables.push(shot.updatable);
      });
    });

  // CTA stops — a swirling particle vortex around the path
  const dot = makeDotTexture();
  const swirls: THREE.Points[] = [];
  route.stops
    .filter((s) => s.kind === 'cta')
    .forEach((stop) => {
      const count = 700;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i += 1) {
        const a = Math.random() * Math.PI * 2;
        const r = 5 + Math.random() * 5;
        positions[i * 3] = Math.cos(a) * r;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
        positions[i * 3 + 2] = Math.sin(a) * r;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const swirl = new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          size: 0.24,
          map: dot,
          color: 0xffb454,
          transparent: true,
          opacity: 0.7,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      swirl.position.copy(stop.position).addScaledVector(stop.tangent, 10);
      scene.add(swirl);
      swirls.push(swirl);
    });

  world.updatables.push({
    update(dt) {
      if (reducedMotion) return;
      for (const swirl of swirls) swirl.rotation.y += dt * 0.25;
    },
  });
}
