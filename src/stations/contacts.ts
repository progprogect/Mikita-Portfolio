import * as THREE from 'three';
import type { Route } from '../core/route';
import type { World } from '../core/world';
import { quality, reducedMotion } from '../core/quality';
import { clamp } from '../core/utils';

const vertexShader = /* glsl */ `
  attribute vec3 aTarget;
  attribute float aSeed;
  uniform float uMix;
  uniform float uTime;
  uniform float uSize;
  varying float vSeed;

  void main() {
    vSeed = aSeed;
    vec3 p = mix(position, aTarget, uMix);
    p.x += sin(uTime * 0.6 + aSeed * 12.0) * 0.12;
    p.y += cos(uTime * 0.5 + aSeed * 9.0) * 0.12;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (28.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vSeed;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.05, d);
    vec3 color = mix(uColorA, uColorB, vSeed);
    gl_FragColor = vec4(color, alpha * 0.9);
  }
`;

/** Station 7 — scattered particles converge into a glowing sphere as you arrive. */
export function buildContacts(world: World, route: Route): void {
  const stop = route.stops.find((s) => s.id === 'contacts')!;
  const { scene } = world;

  const count = quality.contactParticles;
  const scattered = new Float32Array(count * 3);
  const target = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    scattered[i * 3] = (Math.random() - 0.5) * 55;
    scattered[i * 3 + 1] = (Math.random() - 0.5) * 40;
    scattered[i * 3 + 2] = (Math.random() - 0.5) * 55;

    // fibonacci sphere
    const k = i + 0.5;
    const phi = Math.acos(1 - (2 * k) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * k;
    const r = 5.5;
    target[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    target[i * 3 + 1] = Math.cos(phi) * r;
    target[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;

    seeds[i] = Math.random();
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(scattered, 3));
  geo.setAttribute('aTarget', new THREE.BufferAttribute(target, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uMix: { value: reducedMotion ? 1 : 0 },
      uTime: { value: 0 },
      uSize: { value: 9 },
      uColorA: { value: new THREE.Color('#6ee7ff') },
      uColorB: { value: new THREE.Color('#ffb454') },
    },
  });

  const points = new THREE.Points(geo, material);
  const center = stop.position.clone().addScaledVector(stop.tangent, 15);
  points.position.copy(center);
  scene.add(points);

  // two thin rings around the final sphere
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x6ee7ff,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(7.4, 0.05, 6, 80), ringMat);
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(8.6, 0.03, 6, 80), ringMat);
  ringA.position.copy(center);
  ringB.position.copy(center);
  ringA.rotation.x = Math.PI / 2.4;
  ringB.rotation.x = -Math.PI / 3;
  scene.add(ringA, ringB);

  const window = route.segment * 3;
  world.updatables.push({
    update(dt, elapsed, progress) {
      material.uniforms.uTime.value = elapsed;
      if (!reducedMotion) {
        const proximity = clamp(1 - Math.abs(progress - stop.t) / window, 0, 1);
        material.uniforms.uMix.value = proximity * proximity * (3 - 2 * proximity);
        points.rotation.y += dt * 0.1;
        ringA.rotation.z += dt * 0.12;
        ringB.rotation.z -= dt * 0.09;
      }
    },
  });
}
