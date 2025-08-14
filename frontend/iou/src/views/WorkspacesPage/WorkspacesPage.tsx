import AppShell from "@/components/shared/AppShell.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";

export default function WorkspacesPage() {
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
    </AppShell>
  );
}