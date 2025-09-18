import useShapeGeometryStore from "@/hooks/workspace/stores/useShapeGeometryStore.ts";
import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import * as THREE from "three";
import ShapeRenderer from "@/components/three/shape/ShapeRenderer.tsx";
import {useMemo} from "react";
import {intersectionColor} from "@/hooks/workspace/stores/useShapesStore.ts";
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import useDimensions from "@/hooks/workspace/useDimensions.ts";
import useShapeColorVariants from "@/hooks/useShapeColorVariants.ts";

// TODO: Put this functionality into the intersection.worker.ts
function getSharpEdgesAsVec3(
  geometry: THREE.BufferGeometry,
  angleThreshold = 1e-3 // radians ~0.057° (tweak as needed)
): [Vec3, Vec3][] {
  const posAttr = geometry.attributes.position;
  if (!posAttr) return [];

  const index = geometry.index?.array;
  const posArray = posAttr.array;

  const getVertex = (i: number): Vec3 => [
    posArray[i * 3],
    posArray[i * 3 + 1],
    posArray[i * 3 + 2],
  ];

  const getIndex = (i: number) => (index ? index[i] : i);
  const triCount = index ? index.length / 3 : posArray.length / 9;

  // Compute normals per face
  const faceNormals: THREE.Vector3[] = [];
  for (let i = 0; i < triCount; i++) {
    const a = getVertex(getIndex(i * 3));
    const b = getVertex(getIndex(i * 3 + 1));
    const c = getVertex(getIndex(i * 3 + 2));

    const vA = new THREE.Vector3(...a);
    const vB = new THREE.Vector3(...b);
    const vC = new THREE.Vector3(...c);

    const cb = new THREE.Vector3().subVectors(vC, vB);
    const ab = new THREE.Vector3().subVectors(vA, vB);
    const normal = new THREE.Vector3().crossVectors(cb, ab).normalize();

    faceNormals.push(normal);
  }

  // Map edge → faces sharing it
  type FaceEdge = { face: number; v1: number; v2: number };
  const edgeMap = new Map<string, FaceEdge[]>();

  const encodeEdge = (a: number, b: number) => (a < b ? `${a}_${b}` : `${b}_${a}`);

  for (let f = 0; f < triCount; f++) {
    const a = getIndex(f * 3);
    const b = getIndex(f * 3 + 1);
    const c = getIndex(f * 3 + 2);

    const edges: [number, number][] = [
      [a, b],
      [b, c],
      [c, a],
    ];

    for (const [v1, v2] of edges) {
      const key = encodeEdge(v1, v2);
      if (!edgeMap.has(key)) edgeMap.set(key, []);
      edgeMap.get(key)!.push({ face: f, v1, v2 });
    }
  }

  // Collect only sharp edges
  const result: [Vec3, Vec3][] = [];
  for (const edges of edgeMap.values()) {
    if (edges.length === 1) {
      // Border edge → always include
      const { v1, v2 } = edges[0];
      result.push([getVertex(v1), getVertex(v2)]);
    } else if (edges.length === 2) {
      // Shared edge → compare normals
      const n1 = faceNormals[edges[0].face];
      const n2 = faceNormals[edges[1].face];
      const dot = n1.dot(n2); // cos(theta)

      if (dot < 1 - angleThreshold) {
        // angle > threshold → keep edge
        const { v1, v2 } = edges[0];
        result.push([getVertex(v1), getVertex(v2)]);
      }
    }
  }

  return result;
}


export default function IntersectionRenderer() {
  const intersection = useShapeGeometryStore(state => state.intersection);
  const vertices = [] as Vec3[];
  const edges = useMemo(() => (
    intersection ? getSharpEdgesAsVec3(mergeVertices(intersection), 0.1) : []
  ), [intersection]);

  const [dimensions, ] = useDimensions();

  // Styling
  const {
    color,
    baseColor,
    secondaryBaseColor,
  } = useShapeColorVariants(intersectionColor);

  return intersection !== undefined && dimensions === "3d" && (
    <ShapeRenderer
      vertices={vertices}
      edges={edges}
      geometry={intersection!}
      baseColor={baseColor}
      secondaryBaseColor={secondaryBaseColor}
      vertexColor={color}

      maxVertexSelectionDistance={0}
      selectedIds={new Set<number>()}
      wholeShapeSelected={false}

      renderOrder={999}
    />
  );
}