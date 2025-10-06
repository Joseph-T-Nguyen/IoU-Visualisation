import {
  MoreVertical,
  FolderOpen,
  Edit,
  Share2,
  Trash2,
  Copy,
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
  onShare?: () => void;
  onDuplicate?: () => void;
  onOpen?: () => void;
}

export default function WorkspaceCard({
  name,
  lastEdited,
  previewImage,
  onMenuClick,
  onRename,
  onDelete,
  onShare,
  onDuplicate,
  onOpen,
}: WorkspaceCardProps) {
  const handleMenuAction = (action: string, event?: React.MouseEvent) => {
    // Prevent event propagation to avoid triggering the card's onClick
    if (event) {
      event.stopPropagation();
    }
    
    console.log(`${action} clicked for workspace: ${name}`);
    if (action === "rename" && onRename) {
      onRename();
    }
    if (action === "delete" && onDelete) {
      onDelete();
    }
    if (action === "share" && onShare) {
      onShare();
    }
    if (action === "duplicate" && onDuplicate) {
      onDuplicate();
    }
    if (action === "open" && onOpen) {
      onOpen();
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow overflow-hidden p-0 cursor-pointer"
      onClick={() => onOpen?.()}
    >
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
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={(e) => handleMenuAction("open", e)}
                className="cursor-pointer"
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                Open workspace
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => handleMenuAction("rename", e)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => handleMenuAction("duplicate", e)}
                className="cursor-pointer"
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => handleMenuAction("share", e)}
                className="cursor-pointer"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => handleMenuAction("delete", e)}
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
