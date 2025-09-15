import {create} from "zustand/react";

export interface CameraControlsStore {
  activeInteractions: string[],

  addInteraction: (interaction: string) => void,
  removeInteraction: (interaction: string) => void,
}

const useCameraControlsStore = create<CameraControlsStore>((set) => ({
  activeInteractions: [],
  addInteraction: (interaction: string) => set(state => ({
    activeInteractions: [...state.activeInteractions, interaction]
  })),
  removeInteraction: (interaction: string) => set(state => ({
    activeInteractions: state.activeInteractions.filter(element => element !== interaction)
  })),
}))

export default useCameraControlsStore;