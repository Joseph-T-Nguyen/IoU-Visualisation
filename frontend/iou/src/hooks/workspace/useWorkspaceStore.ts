import {create} from "zustand/react";

export interface WorkspaceStore {
  displayName: string,
  setDisplayName: (name: string) => void,
}

/**
 * A zustand store to store the internal data of the workspace. Used to define other hooks. Do not use directly in your
 * react components!
 */
const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  // Metadata
  displayName: "Workspace",
  setDisplayName: (displayName: string) => set({displayName})
}));

export default useWorkspaceStore;