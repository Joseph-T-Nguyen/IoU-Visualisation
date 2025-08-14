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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{name}</CardTitle>
        <CardAction>
          <button 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-sm"
            onClick={onMenuClick}
            aria-label={`More options for ${name}`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </CardAction>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="w-full h-20 bg-gray-100 rounded mb-3 flex items-center justify-center">
          {previewImage}
        </div>
        <p className="text-sm text-gray-500">{lastEdited}</p>
      </CardContent>
    </Card>
  );
}
