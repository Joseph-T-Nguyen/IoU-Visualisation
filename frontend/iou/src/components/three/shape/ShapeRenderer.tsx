import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import InstancedVertexSpheres from "@/components/three/shape/InstancedVertexSpheres.tsx";
import {useRef, useState} from "react";
import type {ThreeEvent} from "@react-three/fiber";
import {Outlines, useCursor} from "@react-three/drei";
import {findClosestVertexId, vec3ToVector3} from "@/components/three/shape/vertexHelpers.ts";
import useConvexHull from "@/hooks/useConvexHull.ts";
import {type Mesh} from "three";
import useCameraInteraction from "@/hooks/workspace/useCameraInteraction.ts";
import useDimensions from "@/hooks/workspace/useDimensions.ts";
import EdgesRenderer from "@/components/three/shape/EdgesRenderer.tsx";
import * as TSL from "three/tsl";

export interface ShapeRendererProps {
  vertices: Vec3[],
  vertexColor?: string,
  baseColor?: string,
  onPress?: (vertexId?: number) => void,
  onPointerDown?: () => void,
  onPointerUp?: () => void,
  selectedIds?: Set<number>,
  wholeShapeSelected?: boolean,
  maxVertexSelectionDistance?: number,
}

export default function ShapeRenderer(props: ShapeRendererProps) {
  const vertexColor = props.vertexColor ?? "blue";
  const baseColor = props.baseColor ?? "#F1F5F9";

  const [dimensions, ] = useDimensions();

  const [edges, setEdges] = useState<[Vec3, Vec3][]>([]);

  const geometry = useConvexHull(props.vertices, (edges) => {
    if (edges)
      setEdges(edges);
  });
  const meshRef = useRef<Mesh>(null);

  const allowHovering = useCameraInteraction() === undefined;

  const [closestVertexIds, setClosestVertexIds] = useState<number[] | null>(null);
  const hoveredIds = closestVertexIds ?? [];
  const [shapeIsHoveredRaw, setShapeIsHoveredRaw] = useState(false);
  // Apply allow hoverign to shapeIsHoveredRaw
  const shapeIsHovered = allowHovering && shapeIsHoveredRaw;

  const edgeColor = dimensions === "3d" ? vertexColor
    : shapeIsHovered || props.wholeShapeSelected ? "#00D3F2" : vertexColor;

  // When hovered, use a drei util to change the mouse to a pointer
  useCursor(hoveredIds.length > 0 || shapeIsHovered, 'pointer', 'auto', document.body);

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (dimensions === "2d")
      event.point.z = 0;

    const closest = findClosestVertexId(event.point, props.vertices, dimensions === "2d");

    // Check if it is close enough
    const maxVertexSelectionDistance = props.maxVertexSelectionDistance ?? 0.1;
    const sqrDistance = vec3ToVector3(props.vertices[closest], dimensions === "2d").distanceToSquared(event.point);
    const vertexWasInRange = sqrDistance <= maxVertexSelectionDistance * maxVertexSelectionDistance;

    setClosestVertexIds(vertexWasInRange ? [closest] : []);
    setShapeIsHoveredRaw(!vertexWasInRange);
  };

  const onPointerOut = () => {
    setClosestVertexIds(null);
    setShapeIsHoveredRaw(false);
    props.onPointerUp?.();
  }

  const onClick = (event: ThreeEvent<PointerEvent>) => {
    if (dimensions === "2d")
      event.point.z = 0;

    const maxVertexSelectionDistance = props.maxVertexSelectionDistance ?? 0.1;
    const vertex = hoveredIds.length > 0 ? hoveredIds[0] : findClosestVertexId(event.point, props.vertices, dimensions === "2d")
    const sqrDistance = vec3ToVector3(props.vertices[vertex], dimensions === "2d").distanceToSquared(event.point);
    const vertexWasInRange = sqrDistance <= maxVertexSelectionDistance * maxVertexSelectionDistance;

    props.onPress?.(vertexWasInRange ? vertex : undefined);
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

        position={dimensions === "2d" ? [0, 0, 1] : [0, 0, 0]}
      />
      <mesh
        geometry={geometry}
        ref={meshRef}
        // When in 2d, push the polygon away from the edges, to help with z fighting
        position={dimensions === "2d" ? [0, 0, -1] : [0, 0, 0]}
      >
        { dimensions === "2d" ? (
          <meshBasicMaterial color={baseColor} toneMapped={false}/>
        ) : (
          <meshStandardMaterial color={baseColor} flatShading toneMapped={false}/>
        )}
        { (shapeIsHovered || props.wholeShapeSelected) &&
          <Outlines thickness={0.0625*1.5} color="#00D3F2" screenspace={true} angle={Math.PI/1} toneMapped={false}/>
        }
      </mesh>

      <EdgesRenderer edges={edges} color={edgeColor}></EdgesRenderer>

    </group>
  );
}