import { useEffect } from 'react';
import useShapesStore from '@/hooks/workspace/stores/useShapesStore.ts';
import useWorkspaceStore from '@/hooks/workspace/stores/useWorkspaceStore.ts';

export default function useLoadWorkspace(workspaceId: string) {
  const setAllShapes = useShapesStore(s => s.setAllShapes);
  const setDisplayName = useWorkspaceStore(s => s.setDisplayName);

  useEffect(() => {
    const load = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/workspaces/${workspaceId}`);
      const json = await res.json();
      const ws = json.workspace as { id: string; name: string; shapes: any };
      if (ws?.name) setDisplayName(ws.name);
      if (ws?.shapes) setAllShapes(ws.shapes);
    };
    load().catch(console.error);
  }, [workspaceId, setAllShapes, setDisplayName]);
}


