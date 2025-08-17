import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import InstancedVertexSpheres from "@/components/three/shape/InstancedVertexSpheres.tsx";
import {useMemo, useState} from "react";
import {Vector3} from "three";
// TODO: Figure out why this import statement isn't happy
import {ConvexGeometry} from "three/examples/jsm/geometries/ConvexGeometry";
import type {ThreeEvent} from "@react-three/fiber";
import {Edges} from "@react-three/drei";

export interface ShapeRendererProps {
  vertices: Vec3[],
  vertexColor: string,
  baseColor: string,
}

function vec3ToVector3(vec3: Vec3): Vector3 {
  return new Vector3(vec3[0], vec3[1], vec3[2]);
}

/**
 * Given a point and a set of vertices, gets the index of the closest vertex in vertices to the given point
 */
function findClosestVertexId(point: Vector3, vertices: Vec3[]): number {
  let closest: number = 0;
  let minDist = Infinity;

  for (let i = 0; i < vertices.length; i++) {
    const vertex = vec3ToVector3(vertices[i]);

    const dist = vertex.distanceToSquared(point);
    if (dist < minDist) {
      minDist = dist;
      closest = i;
    }
  }

  return closest;
}


export default function ShapeRenderer(props: ShapeRendererProps) {
  const vertexColor = props.vertexColor ?? "blue";
  const baseColor = props.baseColor ?? "white";

  const geometry = useMemo(() => new ConvexGeometry(
    props.vertices.map((vertex) =>
      new Vector3(vertex[0], vertex[1], vertex[2]),
    )
  ), [props.vertices]);

  const [directHoveredVertexIds, _] = useState<number[]>([]);
  const [closestVertexId, setClosestVertexId] = useState<number[] | null>(null);
  const hoveredIds = directHoveredVertexIds.length !== 0 ? directHoveredVertexIds : closestVertexId ?? [];

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    const closest = findClosestVertexId(event.point, props.vertices);
    setClosestVertexId([closest]);
  };

  const onPointerOut = () => {
    setClosestVertexId(null);
  }

  // const onVertexHover = (id: number) => {
  //   if (!directHoveredVertexIds.includes(id))
  //     setDirectHoveredVertexIds(v => [...v, id]);
  // }
  //
  // const onVertexUnhover = (id: number) => {
  //   setDirectHoveredVertexIds(v => v.filter(v => v !== id));
  // }

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