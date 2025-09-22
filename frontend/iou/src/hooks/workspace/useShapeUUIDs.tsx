import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";
import { useShallow } from 'zustand/shallow';

/**
 * A hook to get the UUIDs of all shapes
 */
export default function useShapeUUIDs() {
  const shapeUUIDs: string[] = useShapesStore(useShallow(
    s => Object.keys(s.shapes)
  ));

  return shapeUUIDs;
}
