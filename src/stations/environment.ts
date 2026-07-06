import * as THREE from 'three';
import type { Route } from '../core/route';
import type { Updatable, World } from '../core/world';
import { makeDotTexture } from '../core/utils';
import { quality, reducedMotion } from '../core/quality';

/** Starfield, dust, route line and ambient wireframe structures along the journey. */
export function buildEnvironment(world: World, route: Route): void {
  const { scene } = world;
  const dot = makeDotTexture();
  const zMin = -route.stops.length * 32 - 80;

  // Starfield
  const starGeo = new THREE.BufferGeometry();
  const starCount = quality.stars;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const palette = [
    new THREE.Color('#9fd9ff'),
    new THREE.Color('#ffffff'),
    new THREE.Color('#ffd9a0'),
    new THREE.Color('#7ea6ff'),
  ];
  for (let i = 0; i < starCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 190;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 130;
    positions[i * 3 + 2] = zMin * Math.random() + 50;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      size: 0.55,
      map: dot,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    }),
  );
  scene.add(stars);

  // Fine dust drifting near the path
  const dustGeo = new THREE.BufferGeometry();
  const dustCount = quality.dust;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i += 1) {
    const t = Math.random();
    const p = route.curve.getPointAt(t);
    dustPos[i * 3] = p.x + (Math.random() - 0.5) * 26;
    dustPos[i * 3 + 1] = p.y + (Math.random() - 0.5) * 18;
    dustPos[i * 3 + 2] = p.z + (Math.random() - 0.5) * 26;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      size: 0.22,
      map: dot,
      color: 0x6ee7ff,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(dust);

  // Glowing route line so the journey ahead is always visible
  const lineGeo = new THREE.BufferGeometry().setFromPoints(route.curve.getPoints(700));
  const line = new THREE.Line(
    lineGeo,
    new THREE.LineBasicMaterial({
      color: 0x6ee7ff,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  line.position.y = -2.4;
  scene.add(line);

  // Large ambient wireframe structures scattered along the route
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x1c3350,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  });
  const shapes: THREE.Mesh[] = [];
  const geos = [
    new THREE.IcosahedronGeometry(7, 1),
    new THREE.OctahedronGeometry(6, 0),
    new THREE.TorusGeometry(6, 1.6, 8, 22),
  ];
  for (let i = 0; i < route.stops.length; i += 3) {
    const stop = route.stops[i];
    const mesh = new THREE.Mesh(geos[i % geos.length], wireMat);
    mesh.position
      .copy(stop.position)
      .add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 60 + stop.sideSign * -24,
          (Math.random() - 0.5) * 30 - 6,
          -14,
        ),
      );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    shapes.push(mesh);
    scene.add(mesh);
  }

  const updatable: Updatable = {
    update(dt, _elapsed, _progress) {
      if (reducedMotion) return;
      for (let i = 0; i < shapes.length; i += 1) {
        shapes[i].rotation.y += dt * 0.05;
        shapes[i].rotation.x += dt * 0.02;
      }
      dust.rotation.z += dt * 0.004;
    },
  };
  world.updatables.push(updatable);
}
