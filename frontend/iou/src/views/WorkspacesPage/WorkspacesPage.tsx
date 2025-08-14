import AppShell from "@/components/shared/AppShell.tsx";

export default function WorkspacesPage() {
  return (
    <AppShell>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Workspaces</h1>
        <p className="text-gray-600">These are workspaces you've recently worked on.</p>
      </div>
    </AppShell>
  );
}