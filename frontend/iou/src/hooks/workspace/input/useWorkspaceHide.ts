import useOnKeyDown from "@/hooks/input/useOnKeyDown.ts";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";

/**
 * Hook that makes it so any selected shapes are hidden when a key is pressed
 */
export default function useWorkspaceHide() {
  const toggleSelectionVisibility = useShapesStore(state => state.toggleSelectionVisibility);
  const unhideAllShapes = useShapesStore(state => state.unhideAllShapes);

  const hideCallback = () => {
    console.log("Hide");
    toggleSelectionVisibility();
  }

  const unhideCallback = () => {
    console.log("Unhide all");
    unhideAllShapes();
  }

  useOnKeyDown({key: "h", alt: false}, hideCallback, [hideCallback]);
  useOnKeyDown({key: "h", alt: true}, unhideCallback, [unhideCallback]);
}
