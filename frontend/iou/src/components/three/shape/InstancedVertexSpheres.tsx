import {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import { InstancedMesh, Matrix4, BackSide } from 'three';
import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import type {ThreeEvent} from "@react-three/fiber";

export interface InstancedVertexSpheresProps {
  vertices: Vec3[],
  radius?: number,
  onClick?: () => void,

  hoveredIds?: number[],
  onVertexPointerEnter: (vertexId: number, e: ThreeEvent<PointerEvent>) => void,
  onVertexPointerOut: (vertexId: number, e: ThreeEvent<PointerEvent>) => void,
}

export default function InstancedVertexSpheres(props: InstancedVertexSpheresProps) {
  const meshRef = useRef<InstancedMesh>(null);
  const hoveredMeshRef = useRef<InstancedMesh>(null);

  const positions = props.vertices;
  const radius = props.radius ?? 0.0625;

  const [directHoveredId, setDirectHoveredId] = useState<number | null>(null);
  const hoveredIds = props.hoveredIds ?? (directHoveredId === null ? [] : [directHoveredId]);

  // Precompute instance matrices
  const matrices = useMemo(() => {
    return positions.map(([x, y, z]) => {
      const m = new Matrix4();
      m.setPosition(x, y, z);
      return m;
    });
  }, [positions, meshRef]);

  const hoveredMatrices = useMemo(() => {
    console.log("hoveredMatrices from ", hoveredIds);
    return hoveredIds.map((id: number) => matrices[id])
  }, [matrices, hoveredIds]);

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

  const onPointerMove = useCallback((event: ThreeEvent<PointerEvent>) => {
    const newId = event.instanceId ?? null;

    if (newId === directHoveredId)
      return;

    if (directHoveredId !== null)
      props.onVertexPointerOut?.(directHoveredId, event);
    if (newId !== null)
      props.onVertexPointerEnter?.(newId, event);

    setDirectHoveredId(newId);
  }, [directHoveredId, props.onVertexPointerOut, props.onVertexPointerEnter]);

  const onPointerOut = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (directHoveredId !== null)
      props.onVertexPointerOut?.(directHoveredId, event);

    setDirectHoveredId(null)
  }, [directHoveredId, props.onVertexPointerOut, props.onVertexPointerEnter]);

  const onClick = useCallback((event: ThreeEvent<PointerEvent>) => {
    console.log('Clicked vertex instance', event.instanceId);
    props.onClick?.()
  }, [props.onClick]);

  return (
    <>
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
      <instancedMesh
        ref={hoveredMeshRef}
        args={[undefined, undefined, hoveredMatrices.length]}
      >
        <sphereGeometry args={[radius * 1.2, 32, 32]} />
        <meshBasicMaterial color="blue" side={BackSide} />
      </instancedMesh>
    </>
  );
}