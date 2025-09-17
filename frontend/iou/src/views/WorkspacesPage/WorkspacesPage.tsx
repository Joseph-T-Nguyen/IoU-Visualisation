import AppShell from "@/components/shared/AppShell.tsx";
import WorkspaceGrid from "@/components/shared/WorkspaceGrid.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus, Copy, Check, ChevronDown } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function WorkspacesPage() {
  // Use the hook to fetch workspaces data
  const { workspaces, loading, createWorkspace, renameWorkspace, deleteWorkspace, duplicateWorkspace } = useWorkspaces();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("Untitled");
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renameWorkspaceId, setRenameWorkspaceId] = useState<string | null>(null);
  const [renameWorkspaceName, setRenameWorkspaceName] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteWorkspaceId, setDeleteWorkspaceId] = useState<string | null>(null);
  const [deleteWorkspaceName, setDeleteWorkspaceName] = useState("");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareWorkspaceId, setShareWorkspaceId] = useState<string | null>(null);
  const [shareWorkspaceName, setShareWorkspaceName] = useState("");
  const [sharePermission, setSharePermission] = useState<"viewer" | "editor">("viewer");
  const [isCopied, setIsCopied] = useState(false);

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

  const handleOpenDeleteDialog = (workspaceId: string, workspaceName: string) => {
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

  const handleOpenShareDialog = (workspaceId: string, workspaceName: string) => {
    setShareWorkspaceId(workspaceId);
    setShareWorkspaceName(workspaceName);
    setSharePermission("viewer");
    setIsCopied(false);
    setIsShareDialogOpen(true);
  };

  const getShareUrl = () => {
    if (!shareWorkspaceId) return "";
    const baseUrl = window.location.origin;
    return `${baseUrl}/workspace/${shareWorkspaceId}?permission=${sharePermission}`;
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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
          onDeleteWorkspace={handleOpenDeleteDialog}
          onShareWorkspace={handleOpenShareDialog}
          onDuplicateWorkspace={duplicateWorkspace}
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

      {/* Dialog for deleting workspace */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Workspace</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteWorkspaceName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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

      {/* Dialog for sharing workspace */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share "{shareWorkspaceName}"</DialogTitle>
            <DialogDescription>
              Anyone with the link can access this workspace with the selected permission.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Permission selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Permission:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-32 justify-between">
                    <span className="capitalize">{sharePermission}</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32">
                  <DropdownMenuItem 
                    onClick={() => setSharePermission("viewer")}
                    className="cursor-pointer"
                  >
                    Viewer
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSharePermission("editor")}
                    className="cursor-pointer"
                  >
                    Editor
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Share link */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Share link:</label>
              <div className="flex items-center space-x-2">
                <Input
                  value={getShareUrl()}
                  readOnly
                  className="flex-1 font-mono text-xs"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="sm"
                  className="px-3"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                {sharePermission === "viewer" 
                  ? "Viewers can only view the workspace content"
                  : "Editors can view and make changes to the workspace"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
