import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import InstancedVertexSpheres from "@/components/three/shape/InstancedVertexSpheres.tsx";
import {useEffect, useRef, useState} from "react";
import {type ThreeEvent} from "@react-three/fiber";
import {useCursor} from "@react-three/drei";
import {findClosestVertexId, vec3ToVector3} from "@/components/three/shape/vertexHelpers.ts";
import {type IUniform, type Mesh} from "three";
import useCameraInteraction from "@/hooks/workspace/useCameraInteraction.ts";
import useDimensions from "@/hooks/workspace/useDimensions.ts";
import EdgesRenderer from "@/components/three/shape/EdgesRenderer.tsx";
import * as THREE from "three";
import Color from "color";

export interface ShapeRendererProps {
  vertices: Vec3[],
  geometry: THREE.BufferGeometry,
  edges: [Vec3, Vec3][],

  vertexColor?: string,
  baseColor?: string,
  secondaryBaseColor?: string,
  onPress?: (vertexId?: number) => void,
  onPointerDown?: () => void,
  onPointerUp?: () => void,
  selectedIds?: Set<number>,
  wholeShapeSelected?: boolean,
  maxVertexSelectionDistance?: number,
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  
  varying vec3 vNormal;
  // varying vec3 vCameraDir;


  void main() {
    vUv = uv;
    // vColor = (vec4(normal, 1.0)).xyz;
    
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;

    vNormal = normal.xyz; 
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  
  uniform vec3 uColor;
  uniform vec3 uSecondaryColor;

  void main() {
    float extrapolation = 1.2;
    vec3 cameraVector = -normalize(vWorldPos - cameraPosition);
    
    float light = abs(dot(cameraVector, vNormal));
    
    float extrapolatedLight = extrapolation * light;
    vec3 color = (uColor * vec3(extrapolatedLight)) + (uSecondaryColor * vec3(1.0 - extrapolatedLight));
    
    float fresnel = pow(1.0 - light, 5.0);
    vec3 fresnelledColor = (vec3(fresnel)) + (color * vec3(1.0 - fresnel));
    
    gl_FragColor = vec4(fresnelledColor, 1.0);
  }
`;

interface ShapeMaterialUniforms {
  uColor: THREE.Uniform<THREE.Vector3>,
  uSecondaryColor: THREE.Uniform<THREE.Vector3>,
}

export default function ShapeRenderer(props: ShapeRendererProps) {
  const vertexColor = props.vertexColor ?? "blue";
  const baseColor = props.baseColor ?? "#F1F5F9";
  const secondaryBaseColor = props.secondaryBaseColor ?? "blue";

  const [dimensions, ] = useDimensions();
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

  // Material
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const uniformsRef = useRef<ShapeMaterialUniforms>(null!);
  if (!uniformsRef.current) uniformsRef.current = {
    uColor: new THREE.Uniform(new THREE.Vector3()),
    uSecondaryColor: new THREE.Uniform(new THREE.Vector3()),
  };
  // Set shader uniforms when colors change
  useEffect(() => {
    uniformsRef.current.uColor.value = new THREE.Vector3(...Color(baseColor).rgb().array().map(v => v/255));
    uniformsRef.current.uSecondaryColor.value = new THREE.Vector3(...Color(secondaryBaseColor).rgb().array().map(v => v/255));
  }, [baseColor, secondaryBaseColor]);

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
        geometry={props.geometry}
        ref={meshRef}
        // When in 2d, push the polygon away from the edges, to help with z fighting
        position={dimensions === "2d" ? [0, 0, -1] : [0, 0, 0]}

      >
        { dimensions === "2d" ? (
          <meshBasicMaterial color={baseColor} toneMapped={false}/>
        ) : (
          <shaderMaterial
            ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniformsRef.current as unknown as {[key: string]: IUniform}}
            // toneMapped={false}
          />
        )}
        {/*{ (shapeIsHovered || props.wholeShapeSelected) &&*/}
        {/*  <Outlines thickness={0.0625*1.5} color="#00D3F2" screenspace={true} angle={Math.PI/4} toneMapped={false}/>*/}
        {/*}*/}
      </mesh>

      <EdgesRenderer edges={props.edges} color={edgeColor}></EdgesRenderer>

    </group>
  );
}