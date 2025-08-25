import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Ellipsis} from "lucide-react";
import useShape from "@/hooks/workspace/useShape.ts";

export interface ShapesMenuItemProps {
  uuid: string
}

export default function ShapesMenuItem(props: ShapesMenuItemProps) {
  const { name, setName, color } = useShape(props.uuid);

  return (
    <div className="flex flex-row gap-1.5 justify-center items-center">
      <Button className="w-6 h-6" size="icon" style={{background: color}}></Button>
      <Input
        className="h-6 px-1.5 flex-grow text-sm text-left align-middle border-none shadow-none"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Button size="icon" variant="ghost" className="h-6 cursor-pointer data-[disabled]:cursor-default">
        <Ellipsis />
      </Button>
    </div>
  )
}