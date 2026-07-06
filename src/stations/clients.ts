import * as THREE from 'three';
import type { Route } from '../core/route';
import type { World } from '../core/world';
import type { Assets } from '../core/assets';
import { clients } from '../content/clients';
import { quality, reducedMotion } from '../core/quality';
import { makePanel } from './common';

/** Station 2 — an orbit of client logo cards the camera flies through. */
export function buildClients(world: World, route: Route, assets: Assets): void {
  const stop = route.stops.find((s) => s.id === 'clients')!;
  const { scene } = world;

  const ring = new THREE.Group();
  const center = stop.position.clone().addScaledVector(stop.tangent, quality.panelAhead + 4);
  ring.position.copy(center);
  ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), stop.tangent.clone().negate());
  scene.add(ring);

  const radius = quality.ringRadius;
  const cardWidth = quality.panelSide < 3 ? 2.0 : 2.9;
  const cards: THREE.Group[] = [];

  clients.forEach((client, i) => {
    const texture = assets.logos.get(client.name);
    if (!texture) return;
    const angle = (i / clients.length) * Math.PI * 2;
    const panel = makePanel(texture, cardWidth, 512 / 320, {
      floatAmp: 0.08,
      phase: i * 0.9,
    });
    panel.group.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    // children of the ring face its +z axis, which points back toward the camera;
    // a slight inward tilt keeps the cards readable while approaching
    panel.group.rotation.y = -Math.cos(angle) * 0.28;
    panel.group.rotation.x = Math.sin(angle) * 0.28;
    ring.add(panel.group);
    cards.push(panel.group);
    world.updatables.push(panel.updatable);
  });

  world.updatables.push({
    update(dt) {
      if (reducedMotion) return;
      ring.rotation.z += dt * 0.06;
      // counter-rotate so the logos always stay upright and readable
      for (const card of cards) card.rotation.z = -ring.rotation.z;
    },
  });
}
