import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";
import useOnKeyDown from "@/hooks/input/useOnKeyDown.ts";

export default function useWorkspaceDeselect() {
  const deselect = useShapesStore(state => state.deselect);
  useOnKeyDown("Escape", deselect, [deselect]);
}