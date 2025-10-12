import AppShell from "@/components/shared/AppShell.tsx";
import WorkspaceGrid from "@/components/shared/WorkspaceGrid.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { googleLogout } from "@react-oauth/google";

/************* Type declarations *************/
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          disableAutoSelect: () => void;
          revoke: (hint: string, callback: () => void) => void;
        };
      };
    };
  }
}
/********************************************/

export default function WorkspacesPage() {
  const navigate = useNavigate();
  // Use the hook to fetch workspaces data
  const { workspaces, loading, createWorkspace, renameWorkspace, deleteWorkspace, duplicateWorkspace } = useWorkspaces();
  
  // User state management
  const [user, setUser] = useState<{ name: string; email: string; picture?: string } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Load user data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("Untitled");
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renameWorkspaceId, setRenameWorkspaceId] = useState<string | null>(
    null
  );
  const [renameWorkspaceName, setRenameWorkspaceName] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteWorkspaceId, setDeleteWorkspaceId] = useState<string | null>(
    null
  );
  const [deleteWorkspaceName, setDeleteWorkspaceName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNewWorkspace = async () => {
    setIsCreating(true);
    try {
      // Create the workspace in the database
      const newWorkspace = await createWorkspace(workspaceName);
      if (newWorkspace) {
        // Close dialog and reset form
        setIsDialogOpen(false);
        setWorkspaceName("Untitled");
      }
    } catch (error) {
      console.error("Failed to create workspace:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenRenameDialog = (workspaceId: string, currentName: string) => {
    setRenameWorkspaceId(workspaceId);
    setRenameWorkspaceName(currentName);
    setIsRenameDialogOpen(true);
  };

  const handleRenameWorkspace = () => {
    if (renameWorkspaceId) {
      renameWorkspace(renameWorkspaceId, renameWorkspaceName);
      setIsRenameDialogOpen(false);
      setRenameWorkspaceId(null);
      setRenameWorkspaceName("");
    }
  };

  const handleOpenDeleteDialog = (
    workspaceId: string,
    workspaceName: string
  ) => {
    setDeleteWorkspaceId(workspaceId);
    setDeleteWorkspaceName(workspaceName);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteWorkspace = () => {
    if (deleteWorkspaceId) {
      deleteWorkspace(deleteWorkspaceId);
      setIsDeleteDialogOpen(false);
      setDeleteWorkspaceId(null);
      setDeleteWorkspaceName("");
    }
  };

  const handleOpenWorkspace = (workspaceId: string) => {
    console.log(`Opening workspace: ${workspaceId}`);
    navigate(`/workspace/${workspaceId}`);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout calls
    setIsLoggingOut(true);

    try {
      // Store email before clearing
      const userEmail = user?.email;

      // Clear Google session
      googleLogout();
      
      // Wait for Google SDK to be ready and revoke
      if (userEmail && window.google?.accounts?.id) {
        // Disable auto-select first
        window.google.accounts.id.disableAutoSelect();
        
        // Revoke with promise wrapper for proper async handling
        await new Promise<void>((resolve) => {
          window.google!.accounts!.id!.revoke(userEmail, () => {
            console.log('Google session revoked for', userEmail);
            resolve();
          });
          
          // Fallback timeout in case callback never fires
          setTimeout(resolve, 1000);
        });
      }
      
      // Small delay to ensure revocation completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Clear local state and storage
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('jwt_token');
      
      // Navigate back to landing page
      navigate("/");
      
      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if revoke fails
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('jwt_token');
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <AppShell user={user} onLogout={handleLogout} isLoggingOut={isLoggingOut}>
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Workspaces
              </h2>
              <p className="text-gray-600">Loading your workspaces...</p>
            </div>

            <Button
              variant="outline"
              className="w-full sm:w-auto bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
              disabled
            >
              <Plus className="w-4 h-4" />
              New Workspace
            </Button>
          </div>
        </div>

        {/* Loading skeleton or spinner */}
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading workspaces...</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell user={user} onLogout={handleLogout} isLoggingOut={isLoggingOut}>
      {/* Page Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title and Caption */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Workspaces
            </h2>
            <p className="text-gray-600">
              {" "}
              These are workspaces you've recently worked on.{" "}
            </p>
          </div>

          {/* New Workspace Button */}
          <Button
            variant="outline"
            className="w-full sm:w-auto bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
            aria-label="Create new workspace"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            New Workspace
          </Button>
        </div>
      </div>

      {/* Show empty state if no workspaces */}
      {workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-gray-500 mb-4">No workspaces found</div>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create your first workspace
          </Button>
        </div>
      ) : (
        /* Use WorkspaceGrid with data from the hook */
        <WorkspaceGrid
          workspaces={workspaces}
          maxVisibleCards={8}
          onRenameWorkspace={handleOpenRenameDialog}
          onDeleteWorkspace={handleOpenDeleteDialog}
          onDuplicateWorkspace={duplicateWorkspace}
          onOpenWorkspace={handleOpenWorkspace}
        />
      )}

      {/* Dialog for renaming workspace */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Workspace</DialogTitle>
            <DialogDescription>
              Enter a new name for your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="rename-name"
                className="text-right text-sm font-medium"
              >
                Name
              </label>
              <Input
                id="rename-name"
                value={renameWorkspaceName}
                onChange={(e) => setRenameWorkspaceName(e.target.value)}
                className="col-span-3"
                placeholder="Enter workspace name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRenameWorkspace();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameWorkspace}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for deleting workspace */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Workspace</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteWorkspaceName}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteWorkspace}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Dialog for creating new workspace */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Workspace</DialogTitle>
            <DialogDescription>
              Create a new workspace to start working on your project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="workspace-name"
                className="text-right text-sm font-medium"
              >
                Name
              </label>
              <Input
                id="workspace-name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="col-span-3"
                placeholder="Enter workspace name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateNewWorkspace();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setWorkspaceName("Untitled");
              }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateNewWorkspace} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Workspace"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
