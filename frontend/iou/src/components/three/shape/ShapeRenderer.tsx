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
import Color, {type ColorInstance} from "color";

export interface ShapeRendererProps {
  vertices: Vec3[],
  geometry: THREE.BufferGeometry,
  edges: [Vec3, Vec3][],

  vertexColor?: string,
  baseColor?: string,
  secondaryBaseColor?: string,
  hoverColor?: string,
  secondaryHoverColor?: string,
  fresnelColor?: string,
  hoverFresnelColor?: string,
  selectedEdgeColor?: string,

  onPress?: (vertexId?: number) => void,
  onPointerDown?: () => void,
  onPointerUp?: () => void,
  selectedIds?: Set<number>,
  wholeShapeSelected?: boolean,
  maxVertexSelectionDistance?: number,

  depthTest?: boolean,
  renderOrder?: number,

  captureMovement?: boolean,
  position?: Vec3,
}

function colToVector(color: ColorInstance | string) {
  if (typeof color === "string")
    color = Color(color);
  return new THREE.Vector3(...color.rgb().array().map(v => v/255));
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

    vNormal = normalize(normal.xyz); 
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  
  uniform vec3 uColor;
  uniform vec3 uSecondaryColor;
  uniform vec3 uFresnelColor;
  // uniform float uOpacity;

  void main() {
    float extrapolation = 1.2;
    vec3 cameraVector = -normalize(vWorldPos - cameraPosition);
    
    float light = abs(dot(cameraVector, vNormal));
    
    float extrapolatedLight = extrapolation * light;
    vec3 color = (uColor * vec3(extrapolatedLight)) + (uSecondaryColor * vec3(1.0 - extrapolatedLight));
    
    float fresnel = pow(1.0 - light, 5.0);
    vec3 fresnelledColor = (uFresnelColor * vec3(fresnel)) + (color * vec3(1.0 - fresnel));
    
    gl_FragColor = vec4(fresnelledColor, 1.0);
  }
`;

// Uniform data we pass to the shader
interface ShapeMaterialUniforms {
  uColor: THREE.Uniform<THREE.Vector3>,
  uSecondaryColor: THREE.Uniform<THREE.Vector3>,
  uFresnelColor: THREE.Uniform<THREE.Vector3>,
  // uOpacity: THREE.Uniform<number>,
}

export default function ShapeRenderer(props: ShapeRendererProps) {
  const [dimensions] = useDimensions();
  const meshRef = useRef<Mesh>(null);

  const allowHovering = useCameraInteraction() === undefined;

  const [closestVertexIds, setClosestVertexIds] = useState<number[] | null>(null);
  const hoveredIds = closestVertexIds ?? [];
  const [shapeIsHoveredRaw, setShapeIsHoveredRaw] = useState(false);
  // Apply allowHovering to shapeIsHoveredRaw
  const shapeIsHovered = allowHovering && shapeIsHoveredRaw;

  // Get colors
  const vertexColor = props.vertexColor ?? "blue";
  const edgeColor = vertexColor;

  const baseColor = props.baseColor ?? "#F1F5F9";
  const secondaryBaseColor = props.secondaryBaseColor ?? "blue";
  const hoverColor = props.hoverColor ?? baseColor;
  const secondaryHoverColor = props.secondaryHoverColor ?? secondaryBaseColor;
  const fresnelColor = props.fresnelColor ?? "#FFFFFF";
  const hoverFresnelColor = props.hoverFresnelColor ?? fresnelColor;

  // When hovered, use a drei util to change the mouse to a pointer
  useCursor(hoveredIds.length > 0 || shapeIsHovered, 'pointer', 'auto', document.body);

  // Called when hovering over the shape
  const onPointerMove = props.captureMovement && ((event: ThreeEvent<PointerEvent>) => {
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
  });

  // Called when we stop hovering over the shape
  const onPointerOut = props.onPointerUp && (() => {
    setClosestVertexIds(null);
    setShapeIsHoveredRaw(false);
    props.onPointerUp?.();
  })

  // Called when we click the shape
  const onClick = props.onPress && ((event: ThreeEvent<PointerEvent>) => {
    if (dimensions === "2d")
      event.point.z = 0;

    const maxVertexSelectionDistance = props.maxVertexSelectionDistance ?? 0.1;
    const vertex = hoveredIds.length > 0 ? hoveredIds[0] : findClosestVertexId(event.point, props.vertices, dimensions === "2d")
    const sqrDistance = vec3ToVector3(props.vertices[vertex], dimensions === "2d").distanceToSquared(event.point);
    const vertexWasInRange = sqrDistance <= maxVertexSelectionDistance * maxVertexSelectionDistance;

    props.onPress?.(vertexWasInRange ? vertex : undefined);
    if (props.onPress)
      event.stopPropagation();
  });

  // Called when we stop clicking the shape
  const onPointerUp = props.onPointerUp && (() => {
    props.onPointerUp?.();
  });

  // Called when we start clicking the shape
  const onPointerDown = props.onPointerDown && ((event: ThreeEvent<PointerEvent>) => {
    props.onPointerDown?.();
    if (props.onPointerDown)
      event.stopPropagation();
  })

  // Uniform variables to be given to the shader
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const uniformsRef = useRef<ShapeMaterialUniforms>(null!);
  if (!uniformsRef.current) uniformsRef.current = {
    uColor: new THREE.Uniform(new THREE.Vector3()),
    uSecondaryColor: new THREE.Uniform(new THREE.Vector3()),
    uFresnelColor: new THREE.Uniform(new THREE.Vector3()),
  };
  // Set shader uniforms when colors change
  useEffect(() => {
    uniformsRef.current.uColor.value = colToVector(shapeIsHovered ? hoverColor : baseColor);
    uniformsRef.current.uSecondaryColor.value = colToVector(shapeIsHovered ? secondaryHoverColor : secondaryBaseColor);
    uniformsRef.current.uFresnelColor.value = colToVector(shapeIsHovered ? hoverFresnelColor : fresnelColor);
  }, [baseColor, secondaryBaseColor, hoverColor, secondaryHoverColor, shapeIsHovered, fresnelColor, hoverFresnelColor]);

  const renderOrder = props.renderOrder ?? 0;

  const shapeIsHighlighted = props.wholeShapeSelected || shapeIsHovered;

  return (
    <group
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      position={props.position}

      // This allows us to render the intersection in front of everything else
      onBeforeRender={renderOrder < 990 ? undefined : (renderer) => {
        renderer.clearDepth();
      }}
    >
      {renderOrder >= 990 && (
        <mesh
          renderOrder={renderOrder-1}
          // This allows us to render the intersection in front of everything else
          onBeforeRender={renderOrder < 990 ? undefined : (renderer) => {
            renderer.clearDepth();
          }}
          frustumCulled={false}
        />
      )}
      <InstancedVertexSpheres
        vertices={props.vertices}
        hoveredIds={hoveredIds}
        color={vertexColor}
        selectedIds={props.selectedIds ?? new Set<number>()}
        position={dimensions === "2d" ? [0, 0, shapeIsHighlighted ? 2 : 1] : [0, 0, 0]}
        depthTest={props.depthTest ?? true}

        renderOrder={renderOrder}
      />
      <mesh
        geometry={props.geometry}
        ref={meshRef}
        // When in 2d, push the polygon away from the edges, to help with z fighting
        position={dimensions === "2d" ? [0, 0, shapeIsHighlighted ? -0.5 : -1] : [0, 0, 0]}
        renderOrder={renderOrder + 4}
      >
        {dimensions === "2d" ? (
          <meshBasicMaterial
            color={baseColor}
            toneMapped={false}
            depthTest={props.depthTest ?? true}
          />
        ) : (
          <shaderMaterial
            ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={
              uniformsRef.current as unknown as { [key: string]: IUniform }
            }

            // Stencil write when props.stencilRef is defined
            stencilWrite={true}
            stencilRef={1}
            stencilFunc={THREE.GreaterEqualStencilFunc}
            stencilFail={THREE.KeepStencilOp}
            stencilZPass={THREE.ReplaceStencilOp}

            depthTest={props.depthTest ?? true}
            toneMapped={false}
          />
        )}
      </mesh>

      <EdgesRenderer
        edges={props.edges}
        color={edgeColor}
        depthTest={props.depthTest ?? true}

        position={dimensions === "2d" && shapeIsHighlighted ? [0, 0, 1] : [0, 0, 0]}

        stencilWrite={true}
        stencilRef={1}
        stencilFunc={THREE.GreaterEqualStencilFunc}
        stencilZPass={THREE.ReplaceStencilOp}
        segments={6}

        renderOrder={renderOrder}
      />
      {(shapeIsHighlighted) && (
        <EdgesRenderer
          edges={props.edges}
          color={"#00D3F2"}
          depthTest={props.depthTest ?? true}
          side={THREE.BackSide}
          radius={0.0625 * 1.5/2}
          segments={6}
          position={dimensions === "2d" ? [0, 0, -0.75] : [0, 0, 0]}

          renderOrder={renderOrder + 5}
          stencilWrite={true}
          stencilRef={0}
          stencilFunc={THREE.GreaterEqualStencilFunc}
          stencilFail={THREE.KeepStencilOp}
          stencilZPass={THREE.KeepStencilOp}
        />
      )}
    </group>
  );
}
