import type { HTMLProps } from "react";
import ShapesMenu from "@/components/widgets/workspace/context/shapes-menu/ShapesMenu.tsx";
import VertexInfo from "@/components/widgets/workspace/context/vertex-info/VertexInfo.tsx";

export default function ContextSidebar(props: HTMLProps<HTMLDivElement>) {
  return (
    <div {...props}>
      {/* Right side-bar */}
      <div className="flex flex-col gap-3">
        <ShapesMenu />
        <VertexInfo />
      </div>
    </div>
  );
}
