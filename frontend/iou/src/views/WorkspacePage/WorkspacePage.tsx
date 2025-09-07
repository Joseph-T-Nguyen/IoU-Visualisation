import FlexyCanvas from "@/components/shared/FlexyCanvas.tsx";
import {Button} from "@/components/ui/button.tsx";
import { LogOut } from "lucide-react"
import WorkspaceMenubar from "@/components/widgets/workspace/WorkspaceMenubar.tsx";
import ContextSidebar from "@/components/widgets/workspace/ContextSidebar.tsx";
import {Grid} from "@react-three/drei";
import useDimensions from "@/hooks/workspace/useDimensions.ts";
import useShapeUUIDs from "@/hooks/workspace/useShapeUUIDs.tsx";
import ShapeWidget from "@/components/three/shape/ShapeWidget.tsx";
import WorkspaceTitle from "@/components/widgets/workspace/WorkspaceTitle.tsx";
import WorkspaceActionListener from "@/components/widgets/workspace/WorkspaceActionListener.tsx";
import VertexControls from "@/components/three/VertexControls.tsx";

export default function WorkspacePage() {
  const [dimensions, setDimensions] = useDimensions();

  const shapeUUIDs = useShapeUUIDs();

  // These are all the JSX elements used as an overlay on top of the 3d/2d view
  const overlay = (
    <div className="flex flex-row justify-center w-full h-full py-3 p-3 gap-3">
      <div className="flex-grow">
        <div className="grid grid-cols-[auto_auto_auto_auto] gap-3 w-fit">
          {/* Main view overlay */}
          <div>
            <Button variant="outline" size="icon" className="size-8 pointer-events-auto w-9 h-9 cursor-pointer shadow-lg" asChild>
              <a href="../">
                <LogOut className="transform scale-x-[-1] " />
              </a>
            </Button>
          </div>
          <div>
            <WorkspaceMenubar />
          </div>
          <div className="flex flex-col justify-center pointer-events-auto">
            <Button
              size="icon" variant="outline" className="shadow-lg font-light text-md cursor-pointer"
              onClick={() => setDimensions(dimensions === "3d" ? "2d" : "3d")}
            >
              {dimensions?.toUpperCase() ?? "ERR"}
            </Button>
          </div>
          <div className="flex flex-col justify-center items-center">
            <WorkspaceTitle/>
          </div>
        </div>
      </div>
      <ContextSidebar className="min-w-64 overflow-y-scroll"/>
    </div>
  );

  return (<>
    <WorkspaceActionListener />
    <FlexyCanvas
      className="w-screen h-screen overflow-clip bg-secondary"
      overlay={overlay}
    >

      <Grid
        infiniteGrid       // <- key flag
        cellSize={1}
        cellThickness={0.6}
        sectionSize={10}
        sectionThickness={1.0}
        fadeDistance={50}
        fadeStrength={1}
        followCamera={false}
        sectionColor={"#94a3b8"}
        cellColor={"#94a3b8"}
      ></Grid>

      <VertexControls/>

      {/* Add 3D content here: */}

      {/* Add every shape to the scene: */}
      {shapeUUIDs.map((uuid: string) => (
        <ShapeWidget uuid={uuid} key={uuid}/>
      ))}

      <ambientLight intensity={0.25} color="#F1F5F9"/>
      <directionalLight position={[1, 5, 2]} intensity={2} rotation={[45, 10, 0]} color="white" />

    </FlexyCanvas>
  </>);
}




