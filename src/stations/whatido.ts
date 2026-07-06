import * as THREE from 'three';
import type { Route } from '../core/route';
import type { World } from '../core/world';
import { reducedMotion } from '../core/quality';

/** Station 3 — an abstract rotating "machine" of interlocked wireframe gears. */
export function buildWhatIDo(world: World, route: Route): void {
  const stop = route.stops.find((s) => s.id === 'whatido')!;
  const { scene } = world;

  const machine = new THREE.Group();
  machine.position.copy(stop.contentPosition);
  machine.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), stop.tangent.clone().negate());
  scene.add(machine);

  const cyan = new THREE.MeshBasicMaterial({
    color: 0x2a5d8f,
    wireframe: true,
    transparent: true,
    opacity: 0.85,
  });
  const warm = new THREE.MeshBasicMaterial({
    color: 0x8f6a2a,
    wireframe: true,
    transparent: true,
    opacity: 0.7,
  });

  const gearA = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.55, 8, 24), cyan);
  const gearB = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.4, 8, 18), warm);
  gearB.position.set(3.4, 1.6, 0.6);
  gearB.rotation.y = Math.PI / 2.4;
  const gearC = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.3, 8, 14), cyan);
  gearC.position.set(-3.0, -1.8, 0.4);
  gearC.rotation.x = Math.PI / 2.6;
  machine.add(gearA, gearB, gearC);

  // Orbiting "components" — instanced cubes circling the machine
  const cubeCount = 26;
  const inst = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.28, 0.28, 0.28),
    new THREE.MeshBasicMaterial({ color: 0x6ee7ff, transparent: true, opacity: 0.8 }),
    cubeCount,
  );
  machine.add(inst);
  const dummy = new THREE.Object3D();
  const orbit = (elapsed: number) => {
    for (let i = 0; i < cubeCount; i += 1) {
      const a = (i / cubeCount) * Math.PI * 2 + elapsed * 0.25;
      const r = 4.6 + Math.sin(i * 1.7) * 0.7;
      dummy.position.set(Math.cos(a) * r, Math.sin(a * 1.3) * 1.8, Math.sin(a) * r * 0.4);
      dummy.rotation.set(a, a * 0.7, 0);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
  };
  orbit(0);

  world.updatables.push({
    update(dt, elapsed) {
      if (reducedMotion) return;
      gearA.rotation.z += dt * 0.3;
      gearB.rotation.z -= dt * 0.45;
      gearC.rotation.z += dt * 0.6;
      orbit(elapsed);
    },
  });
}
