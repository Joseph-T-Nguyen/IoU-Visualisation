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

  const renameWorkspace = (id: string, newName: string) => {
    const now = new Date();
    const formattedDate = `Edited ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

    setWorkspaces(prevWorkspaces => 
      prevWorkspaces.map(workspace => {
        if (workspace.id === id) {
          return { 
            ...workspace, 
            name: newName || "Untitled", 
            lastEdited: formattedDate,
          };
        }
        return workspace;
      })
    );
  };

  const deleteWorkspace = (id: string) => {
    setWorkspaces(prevWorkspaces => 
      prevWorkspaces.filter(workspace => workspace.id !== id)
    );
  };

  const duplicateWorkspace = (id: string) => {
    const workspaceToDuplicate = workspaces.find(w => w.id === id);
    if (!workspaceToDuplicate) return;

    const now = new Date();
    const formattedDate = `Edited ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

    const baseName = workspaceToDuplicate.name.replace(/ \(copy( \d+)?\)$/,'');
    const copyPattern = new RegExp(`^${baseName.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} \\(copy( \\d+)?\\)$`);
    const existingCopies = workspaces.filter(w => 
      w.name === baseName || copyPattern.test(w.name)
    );

    let copyNumber = 1;
    if (existingCopies.length > 1) {
      const copyNumbers = existingCopies
        .map(w => {
          const match = w.name.match(/\(copy( (\d+))?\)$/);
          if (match) {
            return match[2] ? parseInt(match[2]) : 1;
          }
          return 0;
        })
        .filter(n => n > 0);

      if (copyNumbers.length > 0) {
        copyNumber = Math.max(...copyNumbers) + 1;
      }
    }

    const newName = copyNumber === 1 
      ? `${baseName} (copy)` 
      : `${baseName} (copy ${copyNumber})`;

    const duplicatedWorkspace: Workspace = {
      id: `dup-${Date.now()}`,
      name: newName,
      lastEdited: formattedDate,
      previewImage: workspaceToDuplicate.previewImage,
    };

    setWorkspaces(prevWorkspaces => [duplicatedWorkspace, ...prevWorkspaces]);
  };

  return { workspaces, loading, createWorkspace, renameWorkspace, deleteWorkspace, duplicateWorkspace };
}