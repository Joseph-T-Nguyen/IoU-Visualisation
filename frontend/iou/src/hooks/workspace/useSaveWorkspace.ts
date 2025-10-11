import { useState } from 'react';
import useShapesStore from '@/hooks/workspace/stores/useShapesStore';

export function useSaveWorkspace() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shapes = useShapesStore(s => s.shapes);

  const saveWorkspace = async (workspaceId: string) => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/workspaces/${workspaceId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shapes,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save workspace: ${response.status}`);
      }

      const result = await response.json();
      console.log('Workspace saved successfully:', result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save workspace';
      setError(errorMessage);
      console.error('Save workspace error:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveWorkspace,
    isSaving,
    error,
    clearError: () => setError(null),
  };
}
