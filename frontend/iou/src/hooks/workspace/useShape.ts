import {useShapesStore} from "@/hooks/workspace/stores/useShapesStore.ts";
import type {ShapeData, Vec3} from "@/hooks/workspace/workspaceTypes.ts";

export default function useShape(uuid: string) {
  const store: ShapeData = useShapesStore(s => s.shapes[uuid])!;
  const setVertices = useShapesStore(s => s.setVertices);
  const setShapeName = useShapesStore(s => s.setShapeName);
  const setShapeColor = useShapesStore(s => s.setShapeColor);

  return {
    setVertices: (vertices: Vec3[]) => setVertices(uuid, vertices),
    setName: (name: string) => setShapeName(uuid, name),
    setColor: (color: string) => setShapeColor(uuid, color),
    ...store
  }
}
