import useCameraControlsStore from "@/hooks/workspace/stores/useCameraControlsStore.ts";
import {useMemo} from "react";

export default function useCameraInteraction(): string | undefined {
  const interactions = useCameraControlsStore(s => s.activeInteractions);
  const firstInteraction = useMemo(() => interactions.values().next().value, [interactions]);
  return interactions.size > 0 ? firstInteraction : undefined;
}
