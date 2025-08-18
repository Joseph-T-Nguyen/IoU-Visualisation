import {useEffect, useMemo, useRef} from 'react';
import { InstancedMesh, Matrix4, BackSide } from 'three';
import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";

export interface InstancedVertexSpheresProps {
  vertices: Vec3[],
  radius?: number,

  color?: string

  hoveredIds?: number[],
}

export default function InstancedVertexSpheres(props: InstancedVertexSpheresProps) {
  const meshRef = useRef<InstancedMesh>(null);
  const hoveredOuterMeshRef = useRef<InstancedMesh>(null);
  const hoveredInnerMeshRef = useRef<InstancedMesh>(null);

  const positions = props.vertices;
  const radius = props.radius ?? 0.0625;
  const color = props.color ?? "white";

  const hoveredIds = props.hoveredIds ?? [];

  // Precompute instance matrices
  const matrices = useMemo(() => {
    return positions.map(([x, y, z]) => {
      const m = new Matrix4();
      m.setPosition(x, y, z);
      return m;
    });
  }, [positions, meshRef.current]);

  const hoveredMatrices = useMemo(() => {
    return hoveredIds.map((id: number) => matrices[id])
  }, [matrices, hoveredIds]);

  // Update instance matrices once
  useEffect(() => {
    if (!meshRef.current) return;
    matrices.forEach((matrix, i) => {
      if (!hoveredIds.includes(i))
        meshRef.current!.setMatrixAt(i, matrix);
      else
        meshRef.current!.setMatrixAt(i, new Matrix4(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0));
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [matrices, hoveredIds]);

  useEffect(() => {
    if (!hoveredInnerMeshRef.current || !hoveredOuterMeshRef.current)
      return;
    hoveredMatrices.forEach((matrix, i) => {
      hoveredInnerMeshRef.current!.setMatrixAt(i, matrix);
      hoveredOuterMeshRef.current!.setMatrixAt(i, matrix);
    });
    hoveredInnerMeshRef.current.instanceMatrix.needsUpdate = true;
    hoveredOuterMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [hoveredMatrices]);

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, positions.length]}
      >
        {/* Base sphere geometry */}
        <sphereGeometry args={[radius, 8, 8]} />
        <meshBasicMaterial color={color} toneMapped={false}/>
      </instancedMesh>

      <instancedMesh
        ref={hoveredInnerMeshRef}
        args={[undefined, undefined, hoveredMatrices.length]}
      >
        <sphereGeometry args={[radius, 8, 8]} />
        <meshBasicMaterial color="white" toneMapped={false}/>
      </instancedMesh>
      <instancedMesh
        ref={hoveredOuterMeshRef}
        args={[undefined, undefined, hoveredMatrices.length]}
      >
        <sphereGeometry args={[radius * 1.5, 8, 8]} />
        <meshBasicMaterial color="#00D3F2" side={BackSide} toneMapped={false}/>
      </instancedMesh>
    </>
  );
}