import type {HTMLProps} from "react";
import ShapesMenu from "@/components/widgets/workspace/context/shapes-menu/ShapesMenu.tsx";

export default function ContextSidebar(props: HTMLProps<HTMLDivElement>) {


  return (
    <div {...props}>
      {/* Right side-bar */}
      <ShapesMenu />
    </div>
  );
}