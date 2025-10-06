import useOnKeyDown from "@/hooks/input/useOnKeyDown.ts";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";

/**
 * Hook that makes it so any selected shapes are hidden when a key is pressed
 */
export default function useWorkspaceUndo() {
  const { undo, redo } = useShapesStore.temporal.getState();

  const redoCallback = () => {
    console.log("Redo");
    redo();
  }

  useOnKeyDown({key: "z", ctrl: true, shift: false}, undo, [undo]);
  useOnKeyDown({key: "z", ctrl: true, shift: true}, redoCallback, [redo]);
  useOnKeyDown({key: "y", ctrl: true}, redoCallback, [redo]);
}
