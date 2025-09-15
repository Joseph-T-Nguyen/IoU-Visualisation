import {useCallback} from "react";
import useCameraControlsStore from "@/hooks/workspace/stores/useCameraControlsStore.ts";

export interface UseSetCameraInteractionResult {
  beginInteraction: () => void;
  endInteraction: () => void;
}

export default function useSetCameraInteraction(interaction: string): UseSetCameraInteractionResult {
  const addInteraction = useCameraControlsStore(s => s.addInteraction);
  const removeInteraction = useCameraControlsStore(s => s.removeInteraction);

  const beginInteraction = useCallback(() => {
    addInteraction(interaction);
  }, [addInteraction, interaction]);

  const endInteraction = useCallback(() => {
    removeInteraction(interaction);
  }, [removeInteraction, interaction]);

  return { beginInteraction, endInteraction };
}