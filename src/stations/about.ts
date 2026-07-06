import * as THREE from 'three';
import type { Route } from '../core/route';
import type { World } from '../core/world';
import type { Assets } from '../core/assets';
import { makeDotTexture } from '../core/utils';
import { quality, reducedMotion } from '../core/quality';
import { makePanel, faceApproach } from './common';

/** Station 1 — a particle portal the camera flies through, plus the photo card. */
export function buildAbout(world: World, route: Route, assets: Assets): void {
  const stop = route.stops.find((s) => s.id === 'about')!;
  const { scene } = world;

  // Particle portal ring, axis aligned with the direction of travel
  const count = quality.portalParticles;
  const positions = new Float32Array(count * 3);
  const R = 9;
  for (let i = 0; i < count; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const r = R + (Math.random() - 0.5) * 2.2;
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = Math.sin(a) * r;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const portal = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      size: 0.28,
      map: makeDotTexture(),
      color: 0x6ee7ff,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  // place the ring slightly ahead so the camera passes through it on the first scroll
  const ringPos = stop.position.clone().addScaledVector(stop.tangent, 7);
  portal.position.copy(ringPos);
  portal.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), stop.tangent);
  scene.add(portal);

  // Second, warmer outer ring rotating the other way
  const portal2 = portal.clone();
  portal2.material = (portal.material as THREE.PointsMaterial).clone();
  (portal2.material as THREE.PointsMaterial).color = new THREE.Color(0xffb454);
  (portal2.material as THREE.PointsMaterial).opacity = 0.35;
  portal2.scale.setScalar(1.25);
  scene.add(portal2);

  // Photo card floating beside the path
  const photoWidth = quality.panelSide < 3 ? 2.4 : 3.4;
  const panel = makePanel(assets.photo, photoWidth, 640 / 800, { floatAmp: 0.1 });
  const photoPos = stop.position
    .clone()
    .addScaledVector(stop.tangent, quality.panelAhead + 2)
    .addScaledVector(stop.side, quality.panelSide * 1.1)
    .add(new THREE.Vector3(0, 0.4 + (quality.panelSide < 3 ? 1.9 : 0), 0));
  panel.group.position.copy(photoPos);
  faceApproach(panel.group, stop.tangent);
  scene.add(panel.group);
  world.updatables.push(panel.updatable);

  world.updatables.push({
    update(dt) {
      if (reducedMotion) return;
      portal.rotation.z += dt * 0.12;
      portal2.rotation.z -= dt * 0.08;
    },
  });
}
