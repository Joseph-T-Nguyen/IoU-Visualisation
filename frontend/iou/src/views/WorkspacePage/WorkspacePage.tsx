import FlexyCanvas from "@/components/shared/FlexyCanvas.tsx";
import { Button } from "@/components/ui/button.tsx";
import { LogOut } from "lucide-react";
import WorkspaceMenubar from "@/components/widgets/workspace/WorkspaceMenubar.tsx";
import { useNavigate, useParams } from "react-router";
import ContextSidebar from "@/components/widgets/workspace/ContextSidebar.tsx";
import useDimensions from "@/hooks/workspace/useDimensions.ts";
import useShapeUUIDs from "@/hooks/workspace/useShapeUUIDs.tsx";
import ShapeWidget from "@/components/three/shape/ShapeWidget.tsx";
import WorkspaceTitle from "@/components/widgets/workspace/WorkspaceTitle.tsx";
import WorkspaceActionListener from "@/components/widgets/workspace/WorkspaceActionListener.tsx";
import VertexControls from "@/components/three/VertexControls.tsx";
import WorkspaceCamera from "@/components/three/WorkspaceCamera.tsx";
import WorkspaceGrid from "@/components/three/WorkspaceGrid.tsx";
import { useEffect, useState } from "react";
import { AdaptiveEvents } from "@react-three/drei";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";
import useLoadWorkspace from "@/hooks/workspace/useLoadWorkspace.ts";
import useSaveShapes from "@/hooks/workspace/useSaveShapes.ts";
import CoordinateSystem from "@/components/three/CoordinateSystem.tsx";

import IntersectionRenderer from "@/components/three/shape/IntersectionRenderer.tsx";
import * as THREE from "three";
import type { RootState } from "@react-three/fiber";
import useCameraControlsStore from "@/hooks/workspace/stores/useCameraControlsStore.ts";
import InvalidateOnVisibilityChange from "@/components/three/InvalidateOnVisibilityChange.tsx";

export default function WorkspacePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [dimensions, setDimensions] = useDimensions();
  const [gl, setGl] = useState<THREE.WebGLRenderer | null>(null);

  const shapeUUIDs = useShapeUUIDs();

  const deselect = useShapesStore((s) => s.deselect);

  const handleScreenshot = () => {
    if (gl) {
      const link = document.createElement("a");
      link.setAttribute("download", "workspace.png");
      link.setAttribute(
        "href",
        gl.domElement
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream")
      );
      link.click();
    }
  };

  const handleDownload = () => {
    const shapes = useShapesStore.getState().shapes;
    const data = JSON.stringify(shapes, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "workspace.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,*/*.json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedShapes = JSON.parse(event.target?.result as string);
          const { shapes } = useShapesStore.getState();

          // Merge imported shapes with existing shapes
          useShapesStore.getState().setAllShapes({
            ...shapes,
            ...importedShapes
          });
        } catch (error) {
          alert("Failed to import workspace: Invalid JSON file");
          console.error(error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleDuplicate = () => {
    alert("Duplicate functionality is not yet implemented.");
  };

  const handleUndo = () => {
    const { undo } = useShapesStore.temporal.getState();
    undo();
  };

  const handleRedo = () => {
    const { redo } = useShapesStore.temporal.getState();
    redo();
  };

  const [clipboard, setClipboard] = useState<string[]>([]);

  const handleCut = () => {
    const { deleteSelections } = useShapesStore.getState();
    deleteSelections();
  };

  const handleCopy = () => {
    const { selections } = useShapesStore.getState();
    const selectedIds = Object.keys(selections).filter(id => !selections[id].children);

    if (selectedIds.length === 0) return;

    // Store selected shape IDs in clipboard
    setClipboard(selectedIds);
  };

  const handlePaste = () => {
    const { duplicateShape } = useShapesStore.getState();

    if (clipboard.length === 0) return;

    // Duplicate all shapes in clipboard
    clipboard.forEach(id => duplicateShape(id));
  };

  console.log("Re-rendering the workspace page.");

  // Load workspace from URL parameter
  useLoadWorkspace(id || "1");

  // Auto-save shapes when they change
  useSaveShapes(id || "1");

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
              onClick={() => navigate("/workspaces")}
            >
              <LogOut className="transform scale-x-[-1] " />
            </Button>
          </div>
          <div>
            <WorkspaceMenubar
              onDuplicate={handleDuplicate}
              onDownload={handleDownload}
              onImport={handleImport}
              onScreenshot={handleScreenshot}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onCut={handleCut}
              onCopy={handleCopy}
              onPaste={handlePaste}
            />
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

  // This allows us to know what to preference in raycasting
  const getGizmos = useCameraControlsStore((s) => s.getGizmoMeshIdSet);

  return (
    <>
      <WorkspaceActionListener />
      <FlexyCanvas
        gl={{
          preserveDrawingBuffer: true,
          stencil: true,
          autoClearStencil: true,
        }}
        /* min-h-[100dv] works better on mobile devices that h-screen */
        className="w-screen min-h-[100dvh] overflow-clip overscroll-contain bg-secondary"
        overlay={overlay}
        onPointerMissed={() => {
          deselect();
        }}
        frameloop={"demand"}
        onCreated={(state: RootState) => {
          setGl(state.gl);
          // Set a custom event filter globally, to make gizmos dominate all other objects in mouse events
          state.setEvents({
            filter: (
              intersections: THREE.Intersection[]
            ): THREE.Intersection[] => {
              if (intersections.length === 0) return intersections;

              const gizmos = getGizmos();

              // climb up parents to allow for child hits (GLTF children, etc.)
              const preferredHit = intersections.filter((it) => {
                let o: THREE.Object3D | null = it.object;

                while (o) {
                  if (gizmos.has(o.id)) return true;

                  o = o.parent;
                }

                return false;
              });

              return preferredHit.length > 0 ? preferredHit : intersections;
            },
          });
        }}
      >
        <WorkspaceGrid />
        <AdaptiveEvents />

        <WorkspaceCamera />

        <CoordinateSystem />
        <VertexControls />

        {/* Add 3D content here: */}

        <InvalidateOnVisibilityChange />
        <IntersectionRenderer />
        {/* Add every shape to the scene: */}
        {shapeUUIDs.map((uuid: string) => (
          <ShapeWidget uuid={uuid} key={uuid} />
        ))}
      </FlexyCanvas>
    </>
  );
}
