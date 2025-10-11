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
        const jwtToken = localStorage.getItem('jwt_token');
        
        if (!jwtToken) {
          console.error('No JWT token found');
          setWorkspaces([]);
          return;
        }

        const res = await fetch(`${apiUrl}/api/workspaces`, {
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch workspaces: ${res.status}`);
        }
        
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

  const createWorkspace = async (name: string = "Untitled"): Promise<Workspace | null> => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const jwtToken = localStorage.getItem('jwt_token');
    
    if (!jwtToken) {
      console.error('No JWT token found');
      return null;
    }

    try {
      const res = await fetch(`${apiUrl}/api/workspaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ name: name || "Untitled" })
      });
      
      if (!res.ok) {
        throw new Error(`Failed to create workspace: ${res.status}`);
      }
      
      const newWorkspace: Workspace = await res.json();
      setWorkspaces(prevWorkspaces => [newWorkspace, ...prevWorkspaces]);
      return newWorkspace;
    } catch (err) {
      console.error('Failed to create workspace', err);
      return null;
    }
  };

  const renameWorkspace = async (id: string, newName: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const jwtToken = localStorage.getItem('jwt_token');
    
    if (!jwtToken) {
      console.error('No JWT token found');
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/workspaces/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
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
    const jwtToken = localStorage.getItem('jwt_token');
    
    if (!jwtToken) {
      console.error('No JWT token found');
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/workspaces/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      
      if (!res.ok) {
        throw new Error(`Failed to delete workspace: ${res.status}`);
      }
      
      // Remove from local state only after successful API call
      setWorkspaces(prevWorkspaces => 
        prevWorkspaces.filter(workspace => workspace.id !== id)
      );
    } catch (err) {
      console.error('Failed to delete workspace', err);
    }
  };

  const duplicateWorkspace = async (id: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const jwtToken = localStorage.getItem('jwt_token');
    
    if (!jwtToken) {
      console.error('No JWT token found');
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/workspaces/${encodeURIComponent(id)}/duplicate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
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