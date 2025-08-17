import AppShell from "@/components/shared/AppShell.tsx";
import WorkspaceGrid from "@/components/shared/WorkspaceGrid.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import { useWorkspaces } from "@/hooks/useWorkspaces";

export default function WorkspacesPage() {
  // Use the hook to fetch workspaces data
  const { workspaces, loading } = useWorkspaces();

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
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create your first workspace
          </Button>
        </div>
      ) : (
        /* Use WorkspaceGrid with data from the hook */
        <WorkspaceGrid workspaces={workspaces} maxVisibleCards={8} />
      )}
    </AppShell>
  );
}
