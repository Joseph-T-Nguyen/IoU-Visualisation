import AppShell from "@/components/shared/AppShell.tsx";
import WorkspaceCard from "@/components/shared/WorkspaceCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";

export default function WorkspacesPage() {
  const workspaces = [
    { name: "Workspace 1", lastEdited: "Edited 8/5/2025", previewImage: <div className="w-8 h-8 bg-green-500 rounded"></div> },
    { name: "Workspace 2", lastEdited: "Edited 8/5/2025", previewImage: <div className="w-8 h-8 bg-red-500 rounded"></div> },
    { name: "Workspace 3", lastEdited: "Edited 8/5/2025" },
    { name: "Workspace 4", lastEdited: "Edited 8/5/2025" },
    { name: "Workspace 5", lastEdited: "Edited 8/5/2025" },
    { name: "Workspace 6", lastEdited: "Edited 8/5/2025" },
    { name: "Workspace 7", lastEdited: "Edited 8/5/2025" },
    { name: "Workspace 8", lastEdited: "Edited 8/5/2025" },
  ];

  return (
    <AppShell>
      {/* Page Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title and Caption */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Workspaces</h2>
            <p className="text-gray-600">These are workspaces you've recently worked on.</p>
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

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {workspaces.map((workspace, index) => (
          <WorkspaceCard
            key={index}
            name={workspace.name}
            lastEdited={workspace.lastEdited}
            previewImage={workspace.previewImage}
            onMenuClick={() => console.log(`Menu clicked for ${workspace.name}`)}
          />
        ))}
      </div>
    </AppShell>
  );
}