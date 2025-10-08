import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";

/**
 * Hook that invalidates the canvas when any shape's visibility changes.
 * This is needed because the canvas uses frameloop="demand" and won't
 * automatically re-render on state changes.
 */
export default function useInvalidateOnVisibilityChange() {
  const invalidate = useThree((state) => state.invalidate);
  const shapes = useShapesStore((state) => state.shapes);

  // Track previous visibility states
  const prevVisibilityRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const currentVisibility: Record<string, boolean> = {};
    let hasChanged = false;

    // Check if any visibility has changed
    for (const id in shapes) {
      currentVisibility[id] = shapes[id].visible ?? true;
      if (prevVisibilityRef.current[id] !== currentVisibility[id]) {
        hasChanged = true;
      }
    }

    // Check for deleted shapes
    for (const id in prevVisibilityRef.current) {
      if (!(id in shapes)) {
        hasChanged = true;
      }
    }

    if (hasChanged) {
      invalidate();
    }

    prevVisibilityRef.current = currentVisibility;
  }, [shapes, invalidate]);
}