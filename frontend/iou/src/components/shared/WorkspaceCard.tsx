import { MoreVertical } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardAction } from "@/components/ui/card";

interface WorkspaceCardProps {
  name: string;
  lastEdited: string;
  previewImage?: React.ReactNode;
  onMenuClick?: () => void;
}

export default function WorkspaceCard({ 
  name, 
  lastEdited, 
  previewImage, 
  onMenuClick 
}: WorkspaceCardProps) {
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
          <button 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-sm"
            onClick={onMenuClick}
            aria-label={`More options for ${name}`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-500">{lastEdited}</p>
      </div>
    </Card>
  );
}
