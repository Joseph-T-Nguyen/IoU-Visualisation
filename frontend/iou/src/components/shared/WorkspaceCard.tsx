import {
  MoreVertical,
  FolderOpen,
  Edit,
  History,
  Share2,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkspaceCardProps {
  name: string;
  lastEdited: string;
  previewImage?: React.ReactNode;
  onMenuClick?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onVersionHistory?: () => void;
  onShare?: () => void;
}

export default function WorkspaceCard({
  name,
  lastEdited,
  previewImage,
  onMenuClick,
  onRename,
  onDelete,
  onVersionHistory,
  onShare,
}: WorkspaceCardProps) {
  const handleMenuAction = (action: string) => {
    console.log(`${action} clicked for workspace: ${name}`);
    if (action === "rename" && onRename) {
      onRename();
    }
    if (action === "delete" && onDelete) {
      onDelete();
    }
    if (action === "version-history" && onVersionHistory) {
      onVersionHistory();
    }
    if (action === "share" && onShare) {
      onShare();
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden p-0">
      {/* Preview Image - Increased height for more square proportions */}
      <div className="w-full h-50 bg-gray-100 flex items-center justify-center">
        {previewImage}
      </div>

      {/* Content below image - Reduced top padding */}
      <div className="px-4 pb-4 pt-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-gray-900">{name}</h3>
          <DropdownMenu
            onOpenChange={(open) => {
              if (open && onMenuClick) {
                onMenuClick();
              }
            }}
          >
            <DropdownMenuTrigger asChild>
              <button
                className="text-gray-400 hover:text-gray-600 p-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                aria-label={`More options for ${name}`}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => handleMenuAction("open")}
                className="cursor-pointer"
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                Open workspace
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMenuAction("rename")}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMenuAction("version-history")}
                className="cursor-pointer"
              >
                <History className="mr-2 h-4 w-4" />
                Version history
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMenuAction("share")}
                className="cursor-pointer"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleMenuAction("delete")}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-gray-500">{lastEdited}</p>
      </div>
    </Card>
  );
}
