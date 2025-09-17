import {PivotControls, useCursor} from "@react-three/drei";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";
import * as THREE from "three";
import {useEffect, useRef, useState} from "react";
import useSetCameraInteraction from "@/hooks/workspace/useSetCameraInteration.ts";
import useDimensions from "@/hooks/workspace/useDimensions.ts";
import useCameraControlsStore from "@/hooks/workspace/stores/useCameraControlsStore.ts";

export default function VertexControls() {
  const { beginInteraction, endInteraction } = useSetCameraInteraction("vertex-controls");
  const [dimensions, ] = useDimensions();

  // Used to mess with the pivots in side effects
  const pivotRef = useRef<THREE.Group<THREE.Object3DEventMap>>(null);

  const [mouseHovering, setMouseHovering] = useState<boolean>(false);
  useCursor(mouseHovering, 'grab', 'auto', document.body);

  // put PivotControls on a separate layer
  useEffect(() => {
    if (pivotRef.current) {
      pivotRef.current.layers.set(1); // layer 1 for controls
      pivotRef.current.layers.enable(1);
    }
  }, []);

  const selections = useShapesStore(s => s.selections);
  const shapes = useShapesStore(s => s.shapes);
  const matrixMultiplySelection = useShapesStore(s => s.matrixMultiplySelection);

  const previousMatrix = useRef<THREE.Matrix4>(new THREE.Matrix4());

  const selectionKeys = Object.keys(selections);

  const selectedVertexSets = selectionKeys.map(key => {
    const vertices = shapes[key]?.vertices ?? [];
    const children = selections[key]?.children;

    if (!children) return vertices;
    return vertices.filter((_, i) => children.has(i));
  });

  const selectedVerticesRaw = selectedVertexSets.flat();
  const selectedVertices = dimensions === "3d" ? selectedVerticesRaw :
    selectedVerticesRaw.map(v => [v[0], v[1], 2]);

  const matrix = new THREE.Matrix4();
  if (selectedVertices.length > 0)
    matrix.makeTranslation(new THREE.Vector3(...selectedVertices[0]));

  const addGizmo = useCameraControlsStore(s => s.addGizmo);
  const removeGizmo = useCameraControlsStore(s => s.removeGizmo);

  useEffect(() => {
    if (!pivotRef.current)
      return;

    const pivot = pivotRef.current;
    addGizmo(pivot);
    return () => removeGizmo(pivot);
  }, [addGizmo, removeGizmo, pivotRef.current]);

  return selectedVertexSets.length > 0 && (
    <group
      onClick={(e) => e.stopPropagation()}
      onPointerEnter={(e) => {
        setMouseHovering(true);
        e.stopPropagation();
      }}
      onPointerOver={() => setMouseHovering(true)}
      onPointerLeave={(e) => {
        setMouseHovering(false);
        e.stopPropagation();
      }}
    >
      <PivotControls
        ref={pivotRef}
        autoTransform={false}
        matrix={matrix}
        disableRotations
        disableScaling
        activeAxes={[true, true, dimensions === "3d"]}

        onDragStart={() => {
          document.body.style.cursor = "grabbing";
          previousMatrix.current.copy(matrix);
          beginInteraction();
        }}
        onDragEnd={() => {
          if (document.body.style.cursor === "grabbing")
            document.body.style.cursor = "auto";
          endInteraction();
        }}
        onDrag={(_, _2, w) => {
          document.body.style.cursor = "grabbing";
          // Get difference between previous movement and current movement as delta
          previousMatrix.current.invert();
          const delta = new THREE.Matrix4();
          delta.copy(w);
          delta.multiply(previousMatrix.current)

          // Move all selected vertices by delta
          matrixMultiplySelection(delta);
          previousMatrix.current.copy(w);
        }}
        depthTest={false}
      >
        <mesh/>
      </PivotControls>
    </group>
  );
}