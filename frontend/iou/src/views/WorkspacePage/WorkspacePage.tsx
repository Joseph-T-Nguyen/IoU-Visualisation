import FlexyCanvas from "@/components/shared/FlexyCanvas.tsx";
import ShapeRenderer from "@/components/three/shape/ShapeRenderer.tsx";
import {Button} from "@/components/ui/button.tsx";
import { LogOut } from "lucide-react"
import WorkspaceMenubar from "@/components/widgets/workspace/WorkspaceMenubar.tsx";
import ContextSidebar from "@/components/widgets/workspace/ContextSidebar.tsx";
import useWorkspace from "@/hooks/workspace/useWorkspace.ts";

export default function WorkspacePage() {

  // Add these props to the camera to make it orthographic:
  // orthographic camera={{ zoom: 50, position: [0, 0, 100] }}
  const { name: workspaceName } = useWorkspace();

  const overlay = (
    <div className="flex flex-row justify-center w-full h-full py-3 p-3 gap-3">
      <div className="flex-grow">
        <div className="grid grid-cols-[auto_auto_auto] gap-3 w-fit">
          {/* Main view overlay */}
          <div>
            <Button variant="outline" size="icon" className="size-8 pointer-events-auto w-9 h-9 cursor-pointer shadow-lg">
              <LogOut className="transform scale-x-[-1] " />
            </Button>
          </div>
          <div>
            <WorkspaceMenubar />
          </div>
          <div className="flex flex-col justify-center ">
            <span className="font-semibold text-lg">
              {workspaceName}
            </span>
          </div>
        </div>
      </div>
      <ContextSidebar className="min-w-64"/>
    </div>
  );

  return (
    <FlexyCanvas
      className="w-screen h-screen overflow-clip"
      overlay={overlay}
      underlay={(
        <div className="bg-secondary w-full h-full"/>
      )}
    >
      {/* Add 3D content here: */}
      <ShapeRenderer vertices={[[2, 0, 0], [0, 2, 0], [-2, 0, 0], [2, 2, 0], [0, 1, 2]]} baseColor="#fca5a5" vertexColor="#ef4444"/>

      <ambientLight intensity={0.25} color="#F1F5F9"/>
      <directionalLight position={[0, 0, 5]} intensity={2} color="white" />
      {/*<orthographicCamera position={[0, 0, 5]} ></orthographicCamera>*/}
    </FlexyCanvas>
  );
}




