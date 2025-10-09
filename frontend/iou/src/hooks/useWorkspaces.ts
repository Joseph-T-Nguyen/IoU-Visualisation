import { useState, useEffect } from 'react';

interface Workspace {
  id: string;
  name: string;
  lastEdited: string;
  previewImage?: string;
}

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const USER_ID = import.meta.env.VITE_USER_ID || '1';
        const res = await fetch(`${apiUrl}/api/workspaces?userId=${encodeURIComponent(USER_ID)}`);
        const json = await res.json();
        const ws: Workspace[] = json.workspaces || [];
        setWorkspaces(ws);
      } catch (err) {
        console.error('Failed to fetch workspaces', err);
        setWorkspaces([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  const createWorkspace = (name: string = "Untitled") => {
    const now = new Date();
    const formattedDate = `Edited ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

    const newWorkspace: Workspace = {
      id: `new-${Date.now()}`,
      name: name || "Untitled",
      lastEdited: formattedDate,
    };

    setWorkspaces(prevWorkspaces => [newWorkspace, ...prevWorkspaces]);
  };

  const renameWorkspace = async (id: string, newName: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    try {
      const res = await fetch(`${apiUrl}/api/workspaces/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName || 'Untitled' }),
      });
      if (!res.ok) throw new Error(`Failed to update: ${res.status}`);
      const updated: Workspace = await res.json();
      setWorkspaces(prev => prev.map(w => (w.id === id ? { ...w, name: updated.name, lastEdited: updated.lastEdited } : w)));
    } catch (e) {
      console.error('Rename failed', e);
    }
  };

  const deleteWorkspace = async (id: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    try {
      const res = await fetch(`${apiUrl}/api/workspaces/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Failed to delete: ${res.status}`);
      setWorkspaces(prevWorkspaces =>
        prevWorkspaces.filter(workspace => workspace.id !== id)
      );
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  const duplicateWorkspace = async (id: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    try {
      const res = await fetch(`${apiUrl}/api/workspaces/${encodeURIComponent(id)}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`Failed to duplicate: ${res.status}`);
      const created: Workspace = await res.json();
      setWorkspaces(prev => [created, ...prev]);
    } catch (e) {
      console.error('Duplicate failed', e);
    }
  };

  return { workspaces, loading, createWorkspace, renameWorkspace, deleteWorkspace, duplicateWorkspace };
}