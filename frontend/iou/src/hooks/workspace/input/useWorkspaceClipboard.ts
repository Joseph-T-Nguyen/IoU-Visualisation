import useOnKeyDown from "@/hooks/input/useOnKeyDown.ts";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";
import { useRef } from "react";

/**
 * Hook that handles cut, copy, and paste operations for shapes
 */
export default function useWorkspaceClipboard() {
  const deleteSelections = useShapesStore(state => state.deleteSelections);
  const duplicateShape = useShapesStore(state => state.duplicateShape);
  const selections = useShapesStore(state => state.selections);

  // Store clipboard in a ref to avoid recreating callbacks
  const clipboardRef = useRef<string[]>([]);

  const handleCut = () => {
    console.log("Cut");
    deleteSelections();
  };

  const handleCopy = () => {
    console.log("Copy");
    const selectedIds = Object.keys(selections).filter(id => !selections[id].children);

    if (selectedIds.length === 0) return;

    // Store selected shape IDs in clipboard
    clipboardRef.current = selectedIds;
  };

  const handlePaste = () => {
    console.log("Paste");
    if (clipboardRef.current.length === 0) return;

    // Duplicate all shapes in clipboard
    clipboardRef.current.forEach(id => duplicateShape(id));
  };

  useOnKeyDown({key: "x", ctrl: true}, handleCut, [deleteSelections]);
  useOnKeyDown({key: "c", ctrl: true}, handleCopy, [selections]);
  useOnKeyDown({key: "v", ctrl: true}, handlePaste, [duplicateShape]);
}
