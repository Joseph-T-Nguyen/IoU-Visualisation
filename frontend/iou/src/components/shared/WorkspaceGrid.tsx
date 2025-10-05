import WorkspaceCard from "./WorkspaceCard";

interface Workspace {
  id: string;
  name: string;
  lastEdited: string;
  previewImage?: React.ReactNode;
}

interface WorkspaceGridProps {
  workspaces: Workspace[];
  maxVisibleCards?: number;
  onRenameWorkspace?: (id: string, currentName: string) => void;
  onDeleteWorkspace?: (id: string, name: string) => void;
  onVersionHistory?: (id: string, name: string) => void;
  onShareWorkspace?: (id: string, name: string) => void;
  onDuplicateWorkspace?: (id: string) => void;
  onOpenWorkspace?: (id: string) => void;
}

export default function WorkspaceGrid({
  workspaces,
  maxVisibleCards = 8,
  onRenameWorkspace,
  onDeleteWorkspace,
  onVersionHistory,
  onShareWorkspace,
  onDuplicateWorkspace,
  onOpenWorkspace,
}: WorkspaceGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {workspaces.map((workspace) => (
        <WorkspaceCard
          key={workspace.id}
          name={workspace.name}
          lastEdited={workspace.lastEdited}
          previewImage={workspace.previewImage}
          onMenuClick={() =>
            console.log(`Menu clicked for ${workspace.name}`)
          }
          onRename={() =>
            onRenameWorkspace?.(workspace.id, workspace.name)
          }
          onDelete={() =>
            onDeleteWorkspace?.(workspace.id, workspace.name)
          }
          onVersionHistory={() =>
            onVersionHistory?.(workspace.id, workspace.name)
          }
          onShare={() => onShareWorkspace?.(workspace.id, workspace.name)}
          onDuplicate={() => onDuplicateWorkspace?.(workspace.id)}
          onOpen={() => onOpenWorkspace?.(workspace.id)}
        />
      ))}
    </div>
  );
}
