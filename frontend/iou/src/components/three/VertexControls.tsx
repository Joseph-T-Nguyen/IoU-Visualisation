import {DragControls, PivotControls} from "@react-three/drei";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";
import * as THREE from "three";

export default function VertexControls() {

  const selections = useShapesStore(s => s.selections);
  const shapes = useShapesStore(s => s.shapes);

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

  return selectedVertexSets.length > 0 && (
    <PivotControls autoTransform={false} matrix={matrix} disableRotations disableScaling>
      <mesh />
    </PivotControls>
  );
}