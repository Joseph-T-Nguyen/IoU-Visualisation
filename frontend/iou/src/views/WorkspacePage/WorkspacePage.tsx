import FlexyCanvas from "@/components/shared/FlexyCanvas.tsx";
import { Button } from "@/components/ui/button.tsx";
import { LogOut } from "lucide-react";
import WorkspaceMenubar from "@/components/widgets/workspace/WorkspaceMenubar.tsx";
import ContextSidebar from "@/components/widgets/workspace/ContextSidebar.tsx";
import useDimensions from "@/hooks/workspace/useDimensions.ts";
import useShapeUUIDs from "@/hooks/workspace/useShapeUUIDs.tsx";
import ShapeWidget from "@/components/three/shape/ShapeWidget.tsx";
import WorkspaceTitle from "@/components/widgets/workspace/WorkspaceTitle.tsx";
import WorkspaceActionListener from "@/components/widgets/workspace/WorkspaceActionListener.tsx";
import VertexControls from "@/components/three/VertexControls.tsx";
import WorkspaceCamera from "@/components/three/WorkspaceCamera.tsx";
import WorkspaceGrid from "@/components/three/WorkspaceGrid.tsx";
import { useEffect } from "react";
import { AdaptiveEvents, Bvh } from "@react-three/drei";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";
import CoordinateSystem from "@/components/three/CoordinateSystem.tsx";

export default function WorkspacePage() {
  const [dimensions, setDimensions] = useDimensions();

  const shapeUUIDs = useShapeUUIDs();

  const deselect = useShapesStore((s) => s.deselect);

  // These are all the JSX elements used as an overlay on top of the 3d/2d view
  const overlay = (
    <div className="flex flex-col md:flex-row justify-center w-full h-full py-3 p-3 gap-3 overscroll-contain overflow-clip">
      <div className="flex-grow overflow-visible">
        <div className="grid grid-cols-[auto_auto_auto_auto] gap-3 w-fit">
          {/* Main view overlay */}
          <div>
            <Button
              variant="outline"
              size="icon"
              className="size-8 pointer-events-auto w-9 h-9 cursor-pointer shadow-lg"
              asChild
            >
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
              size="icon"
              variant="outline"
              className="shadow-lg font-light text-md cursor-pointer"
              onClick={() => setDimensions(dimensions === "3d" ? "2d" : "3d")}
            >
              {dimensions?.toUpperCase() ?? "ERR"}
            </Button>
          </div>
          <div className="flex flex-col justify-center items-center">
            <WorkspaceTitle />
          </div>
        </div>
      </div>
      <ContextSidebar className="min-w-64 overflow-y-scroll" />
    </div>
  );

  // Prevent scrolling on mobile devices
  useEffect(() => {
    const preventTouch = (e: TouchEvent) => {
      e.preventDefault();
    };

    document.body.addEventListener("touchmove", preventTouch, {
      passive: false,
    });

    return () => {
      document.body.removeEventListener("touchmove", preventTouch);
    };
  }, []);

  return (
    <>
      <WorkspaceActionListener />
      <FlexyCanvas
        /* min-h-[100dv] works better on mobile devices that h-screen */
        className="w-screen min-h-[100dvh] overflow-clip overscroll-contain bg-secondary"
        overlay={overlay}
        onPointerMissed={() => {
          deselect();
        }}
        onCreated={({ raycaster, camera }) => {
          // Only see layers 0 and 1
          raycaster.layers.set(0);
          raycaster.layers.enable(1);
          camera.layers.set(0);
          camera.layers.enable(0);
          camera.layers.enable(1);
        }}
      >
        <WorkspaceGrid />
        <AdaptiveEvents />

        <WorkspaceCamera />

        <CoordinateSystem />

        <Bvh firstHitOnly>
          <VertexControls />

          {/* Add 3D content here: */}

          {/* Add every shape to the scene: */}
          {shapeUUIDs.map((uuid: string) => (
            <ShapeWidget uuid={uuid} key={uuid} />
          ))}
        </Bvh>

        <ambientLight intensity={0.25} color="#F1F5F9" />
        <directionalLight
          position={[1, 5, 2]}
          intensity={2}
          rotation={[45, 10, 0]}
          color="white"
        />
      </FlexyCanvas>
    </>
  );
}
