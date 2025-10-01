import useCameraControlsStore from "@/hooks/workspace/stores/useCameraControlsStore.ts";


export default function useCameraInteraction(): string | undefined {
  const interactions = useCameraControlsStore(s => s.activeInteractions);
  return interactions.size > 0 ? [...interactions][0] : undefined;
}
