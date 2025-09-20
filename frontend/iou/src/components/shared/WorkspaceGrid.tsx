import { ScrollArea } from "@/components/ui/scroll-area";
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
  const needsScroll = workspaces.length > maxVisibleCards;

  return (
    <div className="relative">
      {needsScroll ? (
        // Scrollable container when there are more than 8 cards
        // Height calculated for exactly 2 rows: 2 * card height + gap
        <ScrollArea
          className="w-full"
          style={{ height: "calc(2 * 280px + 1rem)" }}
          type="always"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pr-4">
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
        </ScrollArea>
      ) : (
        // Regular grid when there are 8 or fewer cards
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
              onRename={() => onRenameWorkspace?.(workspace.id, workspace.name)}
              onDelete={() => onDeleteWorkspace?.(workspace.id, workspace.name)}
              onVersionHistory={() =>
                onVersionHistory?.(workspace.id, workspace.name)
              }
              onShare={() => onShareWorkspace?.(workspace.id, workspace.name)}
              onDuplicate={() => onDuplicateWorkspace?.(workspace.id)}
              onOpen={() => onOpenWorkspace?.(workspace.id)}
            />
          ))}
        </div>
      )}

      {/* Optional: Show scroll indicator */}
      {needsScroll && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Scroll to see more workspaces ({workspaces.length} total)
        </div>
      )}
    </div>
  );
}
