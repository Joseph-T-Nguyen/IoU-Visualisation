import AppShell from "@/components/shared/AppShell.tsx";
import WorkspaceGrid from "@/components/shared/WorkspaceGrid.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function WorkspacesPage() {
  // Use the hook to fetch workspaces data
  const { workspaces, loading, createWorkspace, renameWorkspace } = useWorkspaces();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("Untitled");
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renameWorkspaceId, setRenameWorkspaceId] = useState<string | null>(null);
  const [renameWorkspaceName, setRenameWorkspaceName] = useState("");

  const handleCreateWorkspace = () => {
    createWorkspace(workspaceName);
    setIsDialogOpen(false);
    setWorkspaceName("Untitled");
  };

  const handleOpenDialog = () => {
    setWorkspaceName("Untitled");
    setIsDialogOpen(true);
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

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <AppShell>
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
    <AppShell>
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
            onClick={handleOpenDialog}
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
          <Button variant="outline" onClick={handleOpenDialog}>
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
        />
      )}

      {/* Dialog for creating new workspace */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
            <DialogDescription>
              Enter a name for your new workspace. You can change this later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="col-span-3"
                placeholder="Enter workspace name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateWorkspace();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkspace}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              <label htmlFor="rename-name" className="text-right text-sm font-medium">
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
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameWorkspace}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
