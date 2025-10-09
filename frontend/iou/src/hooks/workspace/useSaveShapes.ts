import { useEffect, useRef } from 'react';
import useShapesStore from '@/hooks/workspace/stores/useShapesStore.ts';

export default function useSaveShapes(workspaceId: string) {
  const shapes = useShapesStore(s => s.shapes);
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (saveTimeoutRef.current !== null) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce the save operation to avoid too many requests
    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        // Transform shapes to match backend expected format
        const shapesToSave: Record<string, { name: string; color: string; vertices: number[][] }> = {};
        for (const [id, shape] of Object.entries(shapes)) {
          shapesToSave[id] = {
            name: shape.name,
            color: shape.color,
            vertices: shape.vertices,
          };
        }

        await fetch(`${apiUrl}/api/workspaces/${workspaceId}/shapes`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shapes: shapesToSave }),
        });
      } catch (err) {
        console.error('Failed to save shapes', err);
      }
    }, 1000); // Wait 1 second after last change before saving

    return () => {
      if (saveTimeoutRef.current !== null) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [shapes, workspaceId]);
}
