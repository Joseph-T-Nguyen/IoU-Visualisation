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
    // Simulate API call - replace this with your actual data fetching
    const fetchWorkspaces = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - you can change this number to test different scenarios
      const mockWorkspaces: Workspace[] = [
        { id: '1', name: "Workspace 1", lastEdited: "Edited 8/5/2025", previewImage: "green" },
        { id: '2', name: "Workspace 2", lastEdited: "Edited 8/5/2025", previewImage: "red" },
        { id: '3', name: "Workspace 3", lastEdited: "Edited 8/5/2025" },
        { id: '4', name: "Workspace 4", lastEdited: "Edited 8/5/2025" },
        { id: '5', name: "Workspace 5", lastEdited: "Edited 8/5/2025" },
        { id: '6', name: "Workspace 6", lastEdited: "Edited 8/5/2025" },
        { id: '7', name: "Workspace 7", lastEdited: "Edited 8/5/2025" },
        { id: '8', name: "Workspace 8", lastEdited: "Edited 8/5/2025" },
        { id: '9', name: "Workspace 9", lastEdited: "Edited 8/5/2025" },
        { id: '10', name: "Workspace 10", lastEdited: "Edited 8/5/2025" },
        { id: '11', name: "Workspace 11", lastEdited: "Edited 8/5/2025" },
        { id: '12', name: "Workspace 12", lastEdited: "Edited 8/5/2025" },
      ];
      
      setWorkspaces(mockWorkspaces);
      setLoading(false);
    };

    fetchWorkspaces();
  }, []);

  const createWorkspace = (name: string = "Untitled") => {
    const now = new Date();
    const formattedDate = `Edited ${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    
    const newWorkspace: Workspace = {
      id: `new-${Date.now()}`,
      name: name || "Untitled",
      lastEdited: formattedDate
    };
    
    setWorkspaces(prevWorkspaces => [newWorkspace, ...prevWorkspaces]);
  };

  const renameWorkspace = (id: string, newName: string) => {
    const now = new Date();
    const formattedDate = `Edited ${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    
    setWorkspaces(prevWorkspaces => 
      prevWorkspaces.map(workspace => 
        workspace.id === id 
          ? { ...workspace, name: newName || "Untitled", lastEdited: formattedDate }
          : workspace
      )
    );
  };

  return { workspaces, loading, createWorkspace, renameWorkspace };
}