import { useUndoRedoStore } from "@/hooks/workspace/stores/useUndoRedoStore.ts";
import { useMemo } from "react";

/**
 * A hook to get the UUIDs of all shapes
 */
export default function useShapeUUIDs() {
  const shapes = useUndoRedoStore(s => s.shapes);
  const shapeUUIDs = useMemo<string[]>(() => Object.keys(shapes), [shapes]);

  return shapeUUIDs;
}