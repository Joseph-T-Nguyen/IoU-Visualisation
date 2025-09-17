import {create} from "zustand/react";
import * as THREE from "three";

export interface CameraControlsStore {
  activeInteractions: string[],

  addInteraction: (interaction: string) => void,
  removeInteraction: (interaction: string) => void,

  addGizmo: (gizmo: THREE.Object3D) => void,
  removeGizmo: (gizmo: THREE.Object3D) => void,
  gizmoMeshIdSet: Set<number>,
  getGizmoMeshIdSet: () => Set<number>,
}

const useCameraControlsStore = create<CameraControlsStore>((set, get) => ({
  activeInteractions: [],

  addInteraction: (interaction: string) => set(state => ({
    activeInteractions: [...state.activeInteractions, interaction]
  })),
  removeInteraction: (interaction: string) => set(state => ({
    activeInteractions: state.activeInteractions.filter(element => element !== interaction)
  })),

  gizmoMeshIdSet: new Set<number>(),

  addGizmo: (gizmo: THREE.Object3D) => set((state) => {
    return ({
      gizmoMeshIdSet: new Set<number>([...state.gizmoMeshIdSet, gizmo.id])
    })
  }),
  removeGizmo: (gizmo: THREE.Object3D) => set((state) => {
    return ({
      gizmoMeshIdSet: new Set<number>([...state.gizmoMeshIdSet].filter(id => id !== gizmo.id))
    })
  }),

  getGizmoMeshIdSet: () => get().gizmoMeshIdSet,
}))

export default useCameraControlsStore;