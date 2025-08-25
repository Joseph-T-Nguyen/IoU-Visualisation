import {useShapesStore} from "@/hooks/workspace/stores/useShapesStore.ts";
import type {ShapeData, Vec3} from "@/hooks/workspace/workspaceTypes.ts";

export default function useShape(uuid: string) {
  const store: ShapeData = useShapesStore(s => s.shapes[uuid])!;
  const setVertices = useShapesStore(s => s.setVertices);

  return {
    setVertices: (vertices: Vec3[]) => setVertices(uuid, vertices),
    ...store
  }
}
