import useConvexHull from "@/hooks/useConvexHull.ts";
import {useEffect, useState} from "react";
import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import type {BufferGeometry} from "three";
import useShapeGeometryStore from "@/hooks/workspace/stores/useShapeGeometryStore.ts";

/**
 * Hook that gets the three.js geometry for the convex hull of a shape, in a way that also exposes the geometry for
 * intersection and IOU calculations.
 *
 * @returns a tuple of the BufferGeometry, and the edges
 */
export default function useShapeGeometry(shapeId: string, vertices: Vec3[]): [BufferGeometry, [Vec3, Vec3][]] {
  const [edges, setEdges] = useState<[Vec3, Vec3][]>([]);
  const setGeometry = useShapeGeometryStore(store => store.setGeometry);

  const geometry = useConvexHull(vertices, (edges) => {
    if (edges)
      setEdges(edges);
  });

  useEffect(() => {
    // TODO: Alert the shape geometry store of the new geometry
    setGeometry(shapeId, geometry);
  }, [setGeometry, shapeId, geometry]);

  return [geometry, edges];
}