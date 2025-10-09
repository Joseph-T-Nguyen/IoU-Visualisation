import useWorkspaceStore from "@/hooks/workspace/stores/useWorkspaceStore.ts";
import {Input} from "@/components/ui/input.tsx";
import { useParams } from "react-router";
import { useRef, useEffect } from "react";


export default function WorkspaceTitle() {
  const { id } = useParams<{ id: string }>();
  const { displayName: workspaceName, setDisplayName } = useWorkspaceStore();
  const saveTimeoutRef = useRef<number | null>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Skip saving on initial load (when the name is first set from the server)
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Clear any existing timeout
    if (saveTimeoutRef.current !== null) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce the save operation to avoid too many requests while typing
    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        await fetch(`${apiUrl}/api/workspaces/${encodeURIComponent(id || '')}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: workspaceName || 'Untitled' }),
        });
      } catch (err) {
        console.error('Failed to save workspace name', err);
      }
    }, 1000); // Wait 1 second after last change before saving

    return () => {
      if (saveTimeoutRef.current !== null) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [workspaceName, id]);

  return (
    <Input
      className="h-8 flex-grow font-medium text-left align-middle border-none shadow-none pointer-events-auto px-0 focus-visible:px-1.5 transition-[padding] w-96 text-shadow-sm w-fit"
      fontSizeClassName="text-lg"
      value={workspaceName}
      onChange={(event) => setDisplayName(event.target.value)}
    />
  );
}