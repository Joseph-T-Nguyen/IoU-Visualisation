import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import InstancedVertexSpheres from "@/components/three/shape/InstancedVertexSpheres.tsx";
import {useMemo} from "react";
import {Vector3} from "three";
// TODO: Figure out why this import statement isn't happy
import {ConvexGeometry} from "three/examples/jsm/geometries/ConvexGeometry";

export interface ShapeRendererProps {
  vertices: Vec3[]
}

export default function ShapeRenderer(props: ShapeRendererProps) {
  const geometry = useMemo(() => new ConvexGeometry(
    props.vertices.map((vertex) =>
      new Vector3(vertex[0], vertex[1], vertex[2]),
    )
  ), [props.vertices]);

  return (
    <>
      <InstancedVertexSpheres vertices={props.vertices}/>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="white"/>
      </mesh>
    </>
  );
}