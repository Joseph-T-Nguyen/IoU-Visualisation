import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";
import type {ShapeData, Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import {useMemo} from "react";
import useDimensions from "@/hooks/workspace/useDimensions.ts";

export default function useShape(uuid: string) {
  const store: ShapeData = useShapesStore(s => s.shapes[uuid])!;
  const [dimensions, ] = useDimensions();

  const vertices = useMemo(() => {
    // When in 2d, remove the z-axis
    if (dimensions === "2d")
      return store.vertices.map(v => [v[0], v[1], 0]);
    return store.vertices;
  }, [store.vertices, dimensions]);

  const setVertices = useShapesStore(s => s.setVertices);
  const setShapeName = useShapesStore(s => s.setShapeName);
  const setShapeColor = useShapesStore(s => s.setShapeColor);

  return {
    setVertices: (vertices: Vec3[]) => setVertices(uuid, vertices),
    setName: (name: string) => setShapeName(uuid, name),
    setColor: (color: string) => setShapeColor(uuid, color),
    ...store,
    vertices,
  }
}
