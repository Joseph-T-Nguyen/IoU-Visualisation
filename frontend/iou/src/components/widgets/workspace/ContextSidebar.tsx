import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import type {HTMLProps} from "react";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Ellipsis, Plus} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";

export default function ContextSidebar(props: HTMLProps<HTMLDivElement>) {


  return (
    <div {...props}>
      {/* Right side-bar */}
      <Card className="w-full max-w-sm pointer-events-auto py-3 gap-1.5 px-0 shadow-lg">
        <CardHeader className="px-3">
          <CardTitle>Shapes</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="px-3 mt-1.5 flex flex-col gap-3">
          <div className="flex flex-row gap-1.5 justify-center items-center">
            <Button className="bg-red-500 w-6 h-6" size="icon"></Button>
            <Input
              className="h-6 px-1.5 flex-grow text-sm text-left align-middle border-none shadow-none"
              value="Shape 1"
            />
            <Button size="icon" variant="ghost" className="h-6 cursor-pointer data-[disabled]:cursor-default">
              <Ellipsis />
            </Button>
          </div>
          <div className="flex flex-row gap-1.5 justify-center items-center">
            <Button className="bg-emerald-500 w-6 h-6" size="icon"></Button>
            <Input
              className="h-6 px-1.5 flex-grow text-sm text-left align-middle border-none shadow-none"
              value="Shape 2"
            />
            <Button size="icon" variant="ghost" className="h-6 cursor-pointer data-[disabled]:cursor-default">
              <Ellipsis />
            </Button>
          </div>

          {/* New shape button */}
          <Button size="sm" className="cursor-pointer data-[disabled]:cursor-default">
            <Plus/>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}