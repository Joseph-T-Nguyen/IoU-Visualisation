import {PivotControls} from "@react-three/drei";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";
import * as THREE from "three";
import {useEffect, useRef} from "react";
import useSetCameraInteraction from "@/hooks/workspace/useSetCameraInteration.ts";
import useDimensions from "@/hooks/workspace/useDimensions.ts";

export default function VertexControls() {
  const { beginInteraction, endInteraction } = useSetCameraInteraction("vertex-controls");
  const [dimensions, ] = useDimensions();

  // Used to mess with the pivots in side effects
  const pivotRef = useRef<THREE.Group<THREE.Object3DEventMap>>(null);

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

  const selectedVertices = selectedVertexSets.flat();

  const matrix = new THREE.Matrix4();
  if (selectedVertices.length > 0)
    matrix.makeTranslation(new THREE.Vector3(...selectedVertices[0]));


  // <group onClick={(e) => e.stopPropagation()}>
  // </group>
  return selectedVertexSets.length > 0 && (
      <PivotControls
        ref={pivotRef}
        autoTransform={false}
        matrix={matrix}
        disableRotations
        disableScaling
        activeAxes={[true, true, dimensions === "3d"]}

        onDragStart={() => {
          previousMatrix.current.copy(matrix);
          beginInteraction();
        }}
        onDragEnd={() => {
          endInteraction();

        }}
        onDrag={(_, _2, w) => {
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
        <mesh renderOrder={999} layers={1}/>


      </PivotControls>
  );
}