import {useEffect, useMemo, useRef} from 'react';
import { InstancedMesh, Matrix4, BackSide } from 'three';
import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";

export interface InstancedVertexSpheresProps {
  vertices: Vec3[],
  radius?: number,

  color?: string

  hoveredIds?: number[],
  selectedIds?: Set<number>,
  renderOrder?: number
}

export default function InstancedVertexSpheres(props: InstancedVertexSpheresProps) {
  const meshRef = useRef<InstancedMesh>(null);
  const selectedOuterMeshRef = useRef<InstancedMesh>(null);
  const selectedInnerMeshRef = useRef<InstancedMesh>(null);

  const positions = props.vertices;
  const radius = props.radius ?? 0.0625;
  const color = props.color ?? "white";

  const hoveredIds = useMemo(() => props.hoveredIds ?? [], [props.hoveredIds]);
  const selectedIds = useMemo(() => props.selectedIds ?? new Set<number>(), [props.selectedIds]);
  const selectedIdsArray = useMemo(() => [...selectedIds, ...hoveredIds], [selectedIds, hoveredIds]);

  // Precompute instance matrices
  const matrices = useMemo(() => {
    return positions.map(([x, y, z]) => {
      const m = new Matrix4();
      m.setPosition(x, y, z);
      return m;
    });
  }, [positions]);

  const hoveredMatrices = useMemo(() => {
    return selectedIdsArray.map((id: number) => matrices[id])
  }, [matrices, selectedIdsArray]);

  // Update instance matrices once
  useEffect(() => {
    if (!meshRef.current) return;
    matrices.forEach((matrix, i) => {
      if (!selectedIds.has(i))
        meshRef.current!.setMatrixAt(i, matrix);
      else
        meshRef.current!.setMatrixAt(i, new Matrix4(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0));
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [matrices, hoveredIds, selectedIds]);

  useEffect(() => {
    if (!selectedInnerMeshRef.current || !selectedOuterMeshRef.current)
      return;
    selectedIdsArray.forEach((i, j) => {
      if (i >= matrices.length)
        return;

      if (j < selectedIds.size)
        selectedInnerMeshRef.current!.setMatrixAt(j, matrices[i]);
      selectedOuterMeshRef.current!.setMatrixAt(j, matrices[i]);
    });
    selectedInnerMeshRef.current.instanceMatrix.needsUpdate = true;
    selectedOuterMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [hoveredMatrices, matrices, selectedIds.size, selectedIdsArray]);

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, positions.length]}
        renderOrder={props.renderOrder}
      >
        {/* Base sphere geometry */}
        <sphereGeometry args={[radius, 8, 8]} />
        <meshBasicMaterial color={color} toneMapped={false}/>
      </instancedMesh>

      <instancedMesh
        ref={selectedInnerMeshRef}
        args={[undefined, undefined, selectedIds.size]}
        renderOrder={props.renderOrder}
      >
        <sphereGeometry args={[radius, 8, 8]} />
        <meshBasicMaterial color="white" toneMapped={false}/>
      </instancedMesh>
      <instancedMesh
        ref={selectedOuterMeshRef}
        args={[undefined, undefined, hoveredMatrices.length]}
        renderOrder={props.renderOrder}
      >
        <sphereGeometry args={[radius * 1.5, 8, 8]} />
        <meshBasicMaterial color="#00D3F2" side={BackSide} toneMapped={false}/>
      </instancedMesh>
    </>
  );
}