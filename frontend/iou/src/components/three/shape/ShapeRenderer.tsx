import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import InstancedVertexSpheres from "@/components/three/shape/InstancedVertexSpheres.tsx";
import {useRef, useState} from "react";
import type {ThreeEvent} from "@react-three/fiber";
import {Edges, Instance, Instances, Outlines, Points, Segment, Segments, useCursor} from "@react-three/drei";
import {findClosestVertexId, vec3ToVector3} from "@/components/three/shape/vertexHelpers.ts";
import useConvexHull from "@/hooks/useConvexHull.ts";
import {type Mesh} from "three";
import useCameraInteraction from "@/hooks/workspace/useCameraInteraction.ts";
import useDimensions from "@/hooks/workspace/useDimensions.ts";
import EdgesRenderer from "@/components/three/shape/EdgesRenderer.tsx";

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

  const geometry = useConvexHull(props.vertices, (e) => {
    if (e) setEdges(e);
  });
  const meshRef = useRef<Mesh>(null);

  const allowHovering = useCameraInteraction() === undefined;

  const [closestVertexIds, setClosestVertexIds] = useState<number[] | null>(null);
  const hoveredIds = !allowHovering ? [] : closestVertexIds ?? [];
  const [shapeIsHoveredRaw, setShapeIsHoveredRaw] = useState(false);
  // Apply allow hoverign to shapeIsHoveredRaw
  const shapeIsHovered = allowHovering && shapeIsHoveredRaw;

  // When hovered, use a drei util to change the mouse to a pointer
  useCursor(hoveredIds.length > 0 || shapeIsHovered, 'pointer', 'auto', document.body);

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const closest = findClosestVertexId(event.point, props.vertices);

    // Check if it is close enough
    const maxVertexSelectionDistance = props.maxVertexSelectionDistance ?? 0.1;
    const sqrDistance = vec3ToVector3(props.vertices[closest]).distanceToSquared(event.point);
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
    const maxVertexSelectionDistance = props.maxVertexSelectionDistance ?? 0.1;
    const vertex = hoveredIds.length > 0 ? hoveredIds[0] : findClosestVertexId(event.point, props.vertices)
    const sqrDistance = vec3ToVector3(props.vertices[vertex]).distanceToSquared(event.point);
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
      />
      <mesh
        geometry={geometry}
        ref={meshRef}
      >
        { dimensions === "2d" ? (
          <meshBasicMaterial color={baseColor} flatShading toneMapped={false}/>
        ) : (
          <meshStandardMaterial color={baseColor} flatShading toneMapped={false}/>
        )}


        { (shapeIsHovered || props.wholeShapeSelected) &&
          <Outlines thickness={0.0625*1.5} color="#00D3F2" screenspace={true} angle={Math.PI/1} toneMapped={false}/>
        }
      </mesh>

      <EdgesRenderer edges={edges} color={vertexColor}></EdgesRenderer>

    </group>
  );
}