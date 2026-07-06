import * as THREE from 'three';
import type { Updatable } from '../core/world';
import { reducedMotion } from '../core/quality';

export const ACCENT = new THREE.Color('#6ee7ff');
export const ACCENT_WARM = new THREE.Color('#ffb454');

export interface Panel {
  group: THREE.Group;
  updatable: Updatable;
}

/**
 * A textured plane with a soft additive glow backing and a gentle float.
 * The base building block for photos, logos, diagrams and project cards.
 */
export function makePanel(
  texture: THREE.Texture,
  width: number,
  aspect: number,
  opts: { glow?: THREE.Color; floatAmp?: number; floatSpeed?: number; phase?: number } = {},
): Panel {
  const { glow = ACCENT, floatAmp = 0.16, floatSpeed = 0.7, phase = Math.random() * Math.PI * 2 } = opts;
  const height = width / aspect;
  const group = new THREE.Group();

  const glowMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 1.08, height * 1.12),
    new THREE.MeshBasicMaterial({
      color: glow,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  glowMesh.position.z = -0.06;
  group.add(glowMesh);

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true }),
  );
  group.add(mesh);

  const baseY = { value: 0 };
  const updatable: Updatable = {
    update(_dt, elapsed) {
      if (reducedMotion) return;
      group.position.y = baseY.value + Math.sin(elapsed * floatSpeed + phase) * floatAmp;
    },
  };
  // capture the y position assigned after placement
  queueMicrotask(() => {
    baseY.value = group.position.y;
  });

  return { group, updatable };
}

/** Orients an object to face travellers approaching along the tangent. */
export function faceApproach(obj: THREE.Object3D, tangent: THREE.Vector3): void {
  const target = obj.position.clone().sub(tangent);
  obj.lookAt(target);
}
