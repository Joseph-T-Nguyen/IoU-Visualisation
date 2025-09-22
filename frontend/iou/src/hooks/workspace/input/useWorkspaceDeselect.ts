import { useUndoRedoStore } from "@/hooks/workspace/stores/useUndoRedoStore.ts";
import useOnKeyDown from "@/hooks/input/useOnKeyDown.ts";

export default function useWorkspaceDeselect() {
  const deselect = useUndoRedoStore(state => state.deselect);
  useOnKeyDown("Escape", deselect, [deselect]);
}