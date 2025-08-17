import {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import { InstancedMesh, Matrix4, BackSide } from 'three';
import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";

export interface InstancedVertexSpheresProps {
  positions: Vec3[],
  radius?: number,
  onClick?: () => void,
}


export default function InstancedVertexSpheres(props: InstancedVertexSpheresProps) {
  const meshRef = useRef<InstancedMesh>(null);
  const hoveredMeshRef = useRef<InstancedMesh>(null);

  const positions = props.positions;
  const radius = props.radius ?? 0.0625;

  // Hover state per instance
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Precompute instance matrices
  const matrices = useMemo(() => {
    return positions.map(([x, y, z]) => {
      const m = new Matrix4();
      m.setPosition(x, y, z);
      return m;
    });
  }, [positions]);

  const hoveredMatrices = useMemo(() => {
    if (hoveredId === null)
      return [];

    return [matrices[hoveredId]];
  }, [matrices, hoveredId]);

  // Update instance matrices once
  useEffect(() => {
    if (!meshRef.current) return;
    matrices.forEach((matrix, i) => {
      meshRef.current!.setMatrixAt(i, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  useEffect(() => {
    if (!hoveredMeshRef.current)
      return;
    hoveredMatrices.forEach((matrix, i) => {
      hoveredMeshRef.current!.setMatrixAt(i, matrix);
    });
    hoveredMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [hoveredMatrices]);

  const onPointerMove = useCallback((event: any) => {
    setHoveredId(event.instanceId ?? null);
  }, []);

  const onPointerOut = useCallback(() => {
    setHoveredId(null)
  }, []);

  const onClick = useCallback((event: any) => {
    console.log('Clicked vertex instance', event.instanceId);
  }, []);

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, positions.length]}
        onPointerMove={onPointerMove}
        onPointerOut={onPointerOut}
        onClick={onClick}
      >
        {/* Base sphere geometry */}
        <sphereGeometry args={[radius, 8, 8]} />
        <meshStandardMaterial color="white" />
      </instancedMesh>
      {/* Optional: inverted outer sphere for hovered instance */}
      {hoveredId !== null && (
        <instancedMesh
          ref={hoveredMeshRef}
          args={[undefined, undefined, hoveredMatrices.length]}
        >
          <sphereGeometry args={[radius * 1.2, 32, 32]} />
          <meshBasicMaterial color="blue" side={BackSide} />
        </instancedMesh>
      )}
    </group>
  );
}