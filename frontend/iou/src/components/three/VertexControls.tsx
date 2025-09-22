import {PivotControls, useCursor} from "@react-three/drei";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";
import * as THREE from "three";
import {useEffect, useMemo, useRef, useState} from "react";
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

  const selections = useShapesStore(s => s.selections);
  const shapes = useShapesStore(s => s.shapes);
  const matrixMultiplySelection = useShapesStore(s => s.matrixMultiplySelection);

  const previousMatrix = useRef<THREE.Matrix4>(new THREE.Matrix4());

  const selectedVertexSets = useMemo(() => {
    const selectionKeys = Object.keys(selections);

    return selectionKeys.map(key => {
      const vertices = shapes[key]?.vertices ?? [];
      const children = selections[key]?.children;

      if (!children)
        return vertices;
      return vertices.filter((_, i) => children.has(i));
    })
  }, [shapes, selections]);

  // The midpoint of all selected vertices, if any vertices are selected
  const [averageVertexPos, multipoint] = useMemo(() => {
    const selectedVerticesRaw = selectedVertexSets.flat();
    const selectedVertices = dimensions === "3d" ? selectedVerticesRaw :
      selectedVerticesRaw.map(v => [v[0], v[1], 2]);

    if (selectedVerticesRaw.length === 0)
      return [undefined, false];

    const averageVertexPos = selectedVertices
      .map(v => new THREE.Vector3(...v))
      .reduce((l, r) => l.add(r), new THREE.Vector3())
      .divideScalar(selectedVertices.length);
    return [averageVertexPos, selectedVertices.length > 1];
  }, [selectedVertexSets, dimensions]);

  const matrix = new THREE.Matrix4();
  if (averageVertexPos !== undefined)
    matrix.makeTranslation(averageVertexPos);

  const addGizmo = useCameraControlsStore(s => s.addGizmo);
  const removeGizmo = useCameraControlsStore(s => s.removeGizmo);

  // Whether the vertex controls should appear at all
  const shouldRender = selectedVertexSets.length > 0;

  useEffect(() => {
    // If the pivotRef isn't set yet, repeatedly wait 10 ms and try setting it again
    if (!pivotRef.current) {
      let pivot: THREE.Group<THREE.Object3DEventMap> | null = null;

      let id = undefined as NodeJS.Timeout | undefined;
      const deferredSet = () => {
        // ts linter is wrong here. ignore it.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        id = setTimeout(() => {
          if (!pivotRef.current) {
            deferredSet();
            return;
          }

          pivot = pivotRef.current;
          id = undefined;
          addGizmo(pivot);
        }, 10);
      }
      deferredSet();

      return () => {
        if (id)
          removeGizmo(pivot!);
        else
          clearTimeout(id);
      };
    }

    const pivot = pivotRef.current;
    addGizmo(pivot);

    return () => removeGizmo(pivot);
  }, [addGizmo, removeGizmo, pivotRef.current, shouldRender]);

  useEffect(() => {
    if (!shouldRender)
      endInteraction();
  }, [endInteraction, shouldRender]);

  return shouldRender && (
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
        disableRotations={!multipoint}
        disableScaling={!multipoint}
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