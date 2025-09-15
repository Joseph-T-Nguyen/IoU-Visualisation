import useOnKeyDown from "@/hooks/input/useOnKeyDown.ts";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";

/**
 * Hook that makes it so any selected shapes or vertices are deleted when the Delete or Backspace key is pressed.
 */
export default function useWorkspaceDelete() {
  const deleteSelections = useShapesStore(state => state.deleteSelections);

  const deleteCallback = () => {
    console.log("Delete");
    deleteSelections();
  }

  useOnKeyDown("Backspace", deleteCallback, [deleteSelections]);
  useOnKeyDown("Delete", deleteCallback, [deleteSelections]);
}
