import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import InstancedVertexSpheres from "@/components/three/shape/InstancedVertexSpheres.tsx";
import {useRef, useState} from "react";
import type {ThreeEvent} from "@react-three/fiber";
import {Edges} from "@react-three/drei";
import {findClosestVertexId} from "@/components/three/shape/vertexHelpers.ts";
import useConvexHull from "@/hooks/useConvexHull.ts";
import {type Mesh} from "three";
import useCameraInteraction from "@/hooks/workspace/useCameraInteraction.ts";
import useDimensions from "@/hooks/workspace/useDimensions.ts";

export interface ShapeRendererProps {
  vertices: Vec3[],
  vertexColor?: string,
  baseColor?: string,
  onPress?: (id: number) => void,
  onPointerDown?: () => void,
  onPointerUp?: () => void,
  selectedIds?: Set<number>,
}

export default function ShapeRenderer(props: ShapeRendererProps) {
  const vertexColor = props.vertexColor ?? "blue";
  const baseColor = props.baseColor ?? "#F1F5F9";

  const [dimensions, ] = useDimensions();

  const geometry = useConvexHull(props.vertices);
  const meshRef = useRef<Mesh>(null);

  const allowHovering = useCameraInteraction() === undefined;

  const [closestVertexIds, setClosestVertexIds] = useState<number[] | null>(null);
  const hoveredIds = !allowHovering ? [] : closestVertexIds ?? [];

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const closest = findClosestVertexId(event.point, props.vertices);
    setClosestVertexIds([closest]);
  };

  const onPointerOut = () => {
    setClosestVertexIds(null);
    props.onPointerUp?.();
  }

  const onClick = (event: ThreeEvent<PointerEvent>) => {
    props.onPress?.(hoveredIds.length > 0 ? hoveredIds[0] : findClosestVertexId(event.point, props.vertices));
    if (props.onPress)
      event.stopPropagation();
  }

  const onPointerUp = () => {
    props.onPointerUp?.();
  }

  const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
    props.onPointerDown?.();
    if (props.onPointerDown)
      event.stopPropagation();
  }

  return (
    <group
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <InstancedVertexSpheres
        vertices={props.vertices}
        hoveredIds={hoveredIds}
        color={vertexColor}
        selectedIds={props.selectedIds ?? new Set<number>()}
      />
      <mesh
        geometry={geometry}
        ref={meshRef}
      >
        <meshStandardMaterial color={baseColor} />
        { dimensions === "3d" &&
          <Edges lineWidth={1} color={vertexColor} renderOrder={1} />
        }
      </mesh>

    </group>
  );
}