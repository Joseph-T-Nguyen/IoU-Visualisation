import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import InstancedVertexSpheres from "@/components/three/shape/InstancedVertexSpheres.tsx";
import {useMemo, useState} from "react";
// TODO: Figure out why this import statement isn't happy
import {ConvexGeometry} from "three/examples/jsm/geometries/ConvexGeometry";
import type {ThreeEvent} from "@react-three/fiber";
import {Edges} from "@react-three/drei";
import {findClosestVertexId, vec3ToVector3} from "@/components/three/shape/vertex_helpers.ts";
import ShapeWidget from "@/components/three/shape/ShapeWidget.tsx";

export interface ShapeRendererProps {
  vertices: Vec3[],
  vertexColor?: string,
  baseColor?: string,
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
    const closest = findClosestVertexId(event.point, props.vertices);
    setClosestVertexIds([closest]);
  };

  const onPointerOut = () => {
    setClosestVertexIds(null);
  }


  return (
    <group
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
    >
      <InstancedVertexSpheres
        vertices={props.vertices}
        hoveredIds={hoveredIds}
        color={vertexColor}
      />
      <mesh
        geometry={geometry}
      >
        <meshStandardMaterial color={baseColor} />
        <Edges lineWidth={1} color={vertexColor} />
      </mesh>

    </group>
  );
}