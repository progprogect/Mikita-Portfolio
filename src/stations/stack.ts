import * as THREE from 'three';
import type { Route } from '../core/route';
import type { World } from '../core/world';
import { stack } from '../content/stack';
import { makeLabelTexture, makeDotTexture } from '../core/utils';
import { isMobile, reducedMotion } from '../core/quality';

/** Station 4 — a constellation of tech groups: glowing nodes, links and floating labels. */
export function buildStack(world: World, route: Route): void {
  const stop = route.stops.find((s) => s.id === 'stack')!;
  const { scene } = world;

  const constellation = new THREE.Group();
  const center = stop.position.clone().addScaledVector(stop.tangent, 14);
  constellation.position.copy(center);
  scene.add(constellation);

  const dot = makeDotTexture();
  const radius = isMobile ? 5.5 : 8.5;
  const nodePositions: THREE.Vector3[] = [];
  const linePoints: THREE.Vector3[] = [];

  stack.forEach((group, gi) => {
    // each group is a small cluster on a sphere around the center
    const phi = Math.acos(1 - (2 * (gi + 0.5)) / stack.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * gi;
    const groupCenter = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi) * 0.7,
      Math.sin(phi) * Math.sin(theta),
    ).multiplyScalar(radius);

    const clusterNodes: THREE.Vector3[] = [];
    const nodesInGroup = Math.min(group.items.length, 5);
    for (let i = 0; i < nodesInGroup; i += 1) {
      const p = groupCenter
        .clone()
        .add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 3.2,
            (Math.random() - 0.5) * 2.6,
            (Math.random() - 0.5) * 3.2,
          ),
        );
      clusterNodes.push(p);
      nodePositions.push(p);
    }
    for (let i = 1; i < clusterNodes.length; i += 1) {
      linePoints.push(clusterNodes[0], clusterNodes[i]);
    }

    // group label sprite
    const { texture, aspect } = makeLabelTexture(group.title);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }),
    );
    const h = isMobile ? 0.85 : 1.05;
    sprite.scale.set(h * aspect, h, 1);
    sprite.position.copy(groupCenter).add(new THREE.Vector3(0, 1.6, 0));
    constellation.add(sprite);
  });

  const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodePositions);
  const nodes = new THREE.Points(
    nodeGeo,
    new THREE.PointsMaterial({
      size: 0.5,
      map: dot,
      color: 0x6ee7ff,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  constellation.add(nodes);

  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
  const lines = new THREE.LineSegments(
    lineGeo,
    new THREE.LineBasicMaterial({
      color: 0x3a7ca8,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  constellation.add(lines);

  world.updatables.push({
    update(dt) {
      if (reducedMotion) return;
      constellation.rotation.y += dt * 0.07;
    },
  });
}
