import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Ellipsis, Eye, EyeOff, Copy, Target, Plus } from "lucide-react";
import useShape from "@/hooks/workspace/useShape.ts";
import ColorPicker from "@/components/widgets/workspace/context/shapes-menu/ColorPicker.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";

export interface ShapesMenuItemProps {
  uuid: string;
}

import { useState } from "react";
import AddVertexDialog from "@/components/widgets/workspace/context/shapes-menu/AddVertexDialog.tsx";

export default function ShapesMenuItem(props: ShapesMenuItemProps) {
  const { name, setName, color, visible } = useShape(props.uuid);
  const toggleShapeVisibility = useShapesStore((s) => s.toggleShapeVisibility);
  const duplicateShape = useShapesStore((s) => s.duplicateShape);
  const centerShape = useShapesStore((s) => s.centerShape);
  const [showAddVertexDialog, setShowAddVertexDialog] = useState(false);

  return (
    <>
      <div className="flex flex-row gap-1.5 justify-center items-center">
        <ColorPicker color={color} />
        <Input
          className="h-6 px-1.5 flex-grow text-sm text-left align-middle border-none shadow-none"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 cursor-pointer data-[disabled]:cursor-default"
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setShowAddVertexDialog(true)}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Vertex</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => duplicateShape(props.uuid)}
            className="cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4" />
            <span>Duplicate Shape</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => centerShape(props.uuid)}
            className="cursor-pointer"
          >
            <Target className="mr-2 h-4 w-4" />
            <span>Center Shape</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => toggleShapeVisibility(props.uuid)}
            className="cursor-pointer"
          >
            {visible ? (
              <EyeOff className="mr-2 h-4 w-4" />
            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
            <span>{visible ? "Hide" : "Show"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <AddVertexDialog
      shapeId={props.uuid}
      open={showAddVertexDialog}
      onOpenChange={setShowAddVertexDialog}
    />
  </>
  );
}
