import useShapeGeometryStore from "@/hooks/workspace/stores/useShapeGeometryStore.ts";
import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import * as THREE from "three";
import ShapeRenderer from "@/components/three/shape/ShapeRenderer.tsx";
import {useMemo} from "react";
import Color from "color";
import {defaultColors} from "@/hooks/workspace/stores/useShapesStore.ts";
import useShapeUUIDs from "@/hooks/workspace/useShapeUUIDs.tsx";

function getEdgesAsVec3(geometry: THREE.BufferGeometry): [Vec3, Vec3][] {
  const posAttr = geometry.attributes.position;
  if (!posAttr) return [];

  const index = geometry.index?.array;
  const posArray = posAttr.array;
  const edges: [Vec3, Vec3][] = [];

  // Helper to get vertex position as Vec3
  const getVertex = (i: number): Vec3 => [
    posArray[i * 3],
    posArray[i * 3 + 1],
    posArray[i * 3 + 2],
  ];

  const triCount = index ? index.length : posArray.length / 3;

  // Store edges as numeric key for uniqueness
  const edgeSet = new Set<number>();
  const encodeEdge = (a: number, b: number) => (a < b ? a * 1e6 + b : b * 1e6 + a);

  const getIndex = (i: number) => (index ? index[i] : i);

  for (let i = 0; i < triCount; i += 3) {
    const a = getIndex(i);
    const b = getIndex(i + 1);
    const c = getIndex(i + 2);

    const edgesToAdd: [number, number][] = [
      [a, b],
      [b, c],
      [c, a],
    ];

    for (const [v1, v2] of edgesToAdd) {
      const key = encodeEdge(v1, v2);
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push([getVertex(v1), getVertex(v2)]);
      }
    }
  }

  return edges;
}

export default function IntersectionRenderer() {
  const intersection = useShapeGeometryStore(state => state.intersection);
  const geometry = intersection ?? new THREE.BufferGeometry();
  const vertices = [] as Vec3[];
  const edges = useMemo(() => (
    intersection ? getEdgesAsVec3(intersection) : []
  ), [geometry]);

  const shapesUUIDs = useShapeUUIDs();
  const shapeCount = shapesUUIDs.length;

  // Styling
  const color = defaultColors[(shapeCount + 1) % defaultColors.length];
  const baseColor = useMemo<string>(() => (
    Color(color).lighten(0.4).hex()
  ), [color])
  const secondaryBaseColor = useMemo<string>(() => {
    const col = Color(baseColor);
    const h = col.hue();
    const step = 10; //< How much to rotate the secondary hue towards 230degrees by
    return col.saturate(0.025).darken(0.20).rotate(h < 50 ? -step : h > 230 ? -step : step).hex()
  }, [baseColor]);

  return intersection !== undefined && (
    <ShapeRenderer
      vertices={vertices}
      edges={edges}
      geometry={geometry}



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