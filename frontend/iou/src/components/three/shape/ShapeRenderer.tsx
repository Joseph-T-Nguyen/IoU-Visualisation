import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import InstancedVertexSpheres from "@/components/three/shape/InstancedVertexSpheres.tsx";
import {useMemo, useState} from "react";
// TODO: Figure out why this import statement isn't happy
import {ConvexGeometry} from "three/examples/jsm/geometries/ConvexGeometry";
import type {ThreeEvent} from "@react-three/fiber";
import {Edges} from "@react-three/drei";
import {findClosestVertexId, vec3ToVector3} from "@/components/three/shape/vertex_helpers.ts";

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


  const geometry = useMemo(() => new ConvexGeometry(
    props.vertices.map(vec3ToVector3)
  ), [props.vertices]);

  const [closestVertexIds, setClosestVertexIds] = useState<number[] | null>(null);
  const hoveredIds = closestVertexIds ?? [];

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
  }

  const onPointerUp = () => {
    props.onPointerUp?.();
  }

  const onPointerDown = () => {
    props.onPointerDown?.();
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
        renderOrder={2}
      />
      <mesh
        renderOrder={-1}
        geometry={geometry}
      >
        <meshStandardMaterial color={baseColor} />
        <Edges lineWidth={1} color={vertexColor} renderOrder={1} />
      </mesh>

    </group>
  );
}