import {useShapesStore} from "@/hooks/workspace/stores/useShapesStore.ts";
import { useMemo } from "react";

/**
 * A hook to get the UUIDs of all shapes
 */
export default function useShapeUUIDs() {
  const shapes = useShapesStore(s => s.shapes);
  const shapeUUIDs = useMemo<string[]>(() => Object.keys(shapes), [shapes]);

  return shapeUUIDs;
}