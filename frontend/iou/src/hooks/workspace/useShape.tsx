import {useShapesStore} from "@/hooks/workspace/useShapesStore.ts";
import type {ShapeData} from "@/hooks/workspace/workspaceTypes.ts";

export default function useShape(uuid: string) {
  const store: ShapeData = useShapesStore(s => s.shapes.get(uuid))!;
  const setVertices = useShapesStore(s => s.setVertices);

  return {
    setVertices: (vertices: number[][]) => setVertices(uuid, vertices),
    ...store
  }
}
