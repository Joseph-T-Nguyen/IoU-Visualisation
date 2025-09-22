import { useRef } from 'react';

/**
 * Hook to manage drag operations for undo/redo grouping
 * Groups all state changes that occur during a drag operation into a single undo step
 */
export default function useDragOperationManager() {
  const isDragging = useRef(false);
  const dragStartState = useRef<any>(null);

  const startDrag = () => {
    isDragging.current = true;
    // Store the current state at the start of the drag
    // This will be used to create a single undo step
  };

  const endDrag = () => {
    isDragging.current = false;
    dragStartState.current = null;
  };

  const isCurrentlyDragging = () => {
    return isDragging.current;
  };

  return {
    startDrag,
    endDrag,
    isCurrentlyDragging,
  };
}

