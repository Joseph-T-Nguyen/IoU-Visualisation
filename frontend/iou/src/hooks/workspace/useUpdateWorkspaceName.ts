import { useState } from 'react';
import { useParams } from 'react-router';

export function useUpdateWorkspaceName() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { id: workspaceId } = useParams<{ id: string }>();

  const updateWorkspaceName = async (newName: string) => {
    if (!workspaceId || isUpdating) return;
    
    try {
      setIsUpdating(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/workspaces/${workspaceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName || 'Untitled',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update workspace name: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update workspace name';
      setError(errorMessage);
      console.error('Update workspace name error:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateWorkspaceName,
    isUpdating,
    error,
    clearError: () => setError(null),
  };
}
