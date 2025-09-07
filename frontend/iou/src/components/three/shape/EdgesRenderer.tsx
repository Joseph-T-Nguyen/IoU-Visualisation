import type { Vec3 } from "@/hooks/workspace/workspaceTypes";
import {InstancedMesh, Matrix4} from "three";
import {useEffect, useMemo, useRef} from "react";
import * as THREE from "three";


export interface EdgesRendererProps {
  edges: [Vec3, Vec3][],
  color?: string,
  radius?: number,
}

export default function EdgesRenderer(props: EdgesRendererProps) {
  const meshRef = useRef<InstancedMesh>(null);

  const radius = props.radius ?? 0.0625/4;

  const matrices = useMemo(() => {
    return props.edges.map(([a, b]) => {

      const va = new THREE.Vector3(...a);
      const vb = new THREE.Vector3(...b);
      const midpoint = new THREE.Vector3().addVectors(va, vb).multiplyScalar(0.5);

      const length = vb.clone().sub(va).length();

      const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());

      const m = new Matrix4();
      m.makeRotationFromQuaternion(rotation);
      m.setPosition(midpoint);
      m.scale(new THREE.Vector3(1, length, 1));
      return m;
    });
  }, [props.edges]);

  useEffect(() => {
    if (!meshRef.current)
      return;

    matrices.forEach((m, i) => meshRef.current?.setMatrixAt(i, m));
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  return (<>
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, matrices.length]}
    >
      {/*<sphereGeometry args={[0.1, 16, 8]} />*/}
      <cylinderGeometry args={[radius, radius, 1, 4]} />
      <meshBasicMaterial color={props.color} toneMapped={false}/>
    </instancedMesh>
  </>)

}