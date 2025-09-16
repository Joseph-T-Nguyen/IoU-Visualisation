import { useState, useEffect } from 'react';

interface Version {
  id: string;
  timestamp: string;
  action: string;
}

interface Workspace {
  id: string;
  name: string;
  lastEdited: string;
  previewImage?: string;
  versions?: Version[];
}

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const res = await fetch(`${apiUrl}/api/workspaces`);
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
    const timestamp = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    
    const newWorkspace: Workspace = {
      id: `new-${Date.now()}`,
      name: name || "Untitled",
      lastEdited: formattedDate,
      versions: [
        { id: `v-${Date.now()}`, timestamp, action: "Created" }
      ]
    };
    
    setWorkspaces(prevWorkspaces => [newWorkspace, ...prevWorkspaces]);
  };

  const renameWorkspace = (id: string, newName: string) => {
    const now = new Date();
    const formattedDate = `Edited ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    const timestamp = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    
    setWorkspaces(prevWorkspaces => 
      prevWorkspaces.map(workspace => {
        if (workspace.id === id) {
          const newVersion = { id: `v-${Date.now()}`, timestamp, action: "Renamed" };
          const updatedVersions = [...(workspace.versions || []), newVersion].slice(-5); // Keep last 5 versions
          return { 
            ...workspace, 
            name: newName || "Untitled", 
            lastEdited: formattedDate,
            versions: updatedVersions
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

  const getWorkspaceVersions = (id: string) => {
    const workspace = workspaces.find(w => w.id === id);
    return workspace?.versions || [];
  };

  const duplicateWorkspace = (id: string) => {
    const workspaceToDuplicate = workspaces.find(w => w.id === id);
    if (!workspaceToDuplicate) return;

    const now = new Date();
    const formattedDate = `Edited ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    const timestamp = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    
    // Find all workspaces with names matching the pattern "name (copy)" or "name (copy N)"
    const baseName = workspaceToDuplicate.name.replace(/ \(copy( \d+)?\)$/, '');
    const copyPattern = new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\(copy( \\d+)?\\)$`);
    const existingCopies = workspaces.filter(w => 
      w.name === baseName || copyPattern.test(w.name)
    );
    
    // Determine the new copy number
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
      versions: [
        { id: `v-${Date.now()}`, timestamp, action: `Duplicated from "${workspaceToDuplicate.name}"` }
      ]
    };
    
    setWorkspaces(prevWorkspaces => [duplicatedWorkspace, ...prevWorkspaces]);
  };

  return { workspaces, loading, createWorkspace, renameWorkspace, deleteWorkspace, getWorkspaceVersions, duplicateWorkspace };
}