import type {StateCreator} from "zustand/vanilla";

export type WorkspaceMultiSelection = {[key: string]: WorkspaceObjectSelection};

export interface WorkspaceObjectSelection {
  /**
   * The set of selected child Ids. undefined if no selected children (and the whole object should be selected instead)
   * or a set of AT LEAST 1 child id. Will never be an empty set.
   */
  children?: Set<number>
}

export interface SelectionSlice {
  /**
   * The set of all current selections in the workspace
   */
  selections: WorkspaceMultiSelection,

  /**
   * Replaces all other selections with the given selection
   * @param id The identifier for the selectee
   */
  select: (id: string) => void,
  /**
   * Selects a given set of children on an object, replacing any existing selections and selected children
   * @param id Id of the object to replace child selection of
   * @param children The ids of children to make selected
   */
  selectChild: (id: string, children: number[]) => void,
  /**
   * Removes all selections
   */
  deselect: () => void,

  /**
   * Adds a selection without replacing all other selections
   * @param id The identifier for the selectee
   */
  addSelection: (id: string) => void,
  /**
   * Removes a selection without replacing all other selections
   * @param id The identifier for the selectee
   */
  removeSelection: (id: string) => void,
  toggleSelection: (id: string) => void,

  /**
   * Adds a set of children to being selected on an object
   * @param id Id of the object to update child selection of
   * @param children The ids of children to deselect
   */
  addChildSelection: (id: string, children: number[]) => void,
  /**
   * Removes a set of children from being selected on an object
   * @param id Id of the object to update child selection of
   * @param children The ids of children to deselect
   */
  removeChildSelection: (id: string, children: number[]) => void,
  toggleChildSelection: (id: string, children: number[]) => void,
}

/**
 * A zustand store to store selection states.
 */
const createSelectionSlice: StateCreator<SelectionSlice, [], [], SelectionSlice> = ((set) => ({
  // Metadata
  selections: {},

  select: (id: string) => set(() => {
    return {
      selections: {[id]: {}}
    };
  }),
  selectChild: (id: string, children: number[]) => set(() => {
    if (children.length === 0)
      return {selections: {[id]: {}}};

    const newChildren = new Set<number>([...children]);

    return {
      selections: {[id]: {children: newChildren}}
    };
  }),
  deselect: () => set(() => {
    return {
      selections: {}
    }
  }),

  addSelection: (id: string) => set(state => {
    return {
      selections: {[id]: {}, ...state.selections}
    };
  }),
  removeSelection: (id: string) => set(state => {
    // Select all elements in state.selections, excluding [id]
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {[id]: _, ...selections} = state.selections;
    return {
      selections: selections
    };
  }),
  toggleSelection: (id: string) => set(state => {
    // Select all elements in state.selections, extracting [id] separately
    const {[id]: current, ...selections} = state.selections;
    return {
      selections: current === undefined ? { ...selections, [id]: {} } : selections
    };
  }),

  addChildSelection: (id: string, children: number[]) => set(state => {
    const maybePreviousChildren: Set<number> | [] = state.selections[id]?.children ?? [];
    const newChildren = new Set<number>([...maybePreviousChildren, ...children]);

    return {
      selections: {...state.selections, [id]: {children: newChildren}}
    };
  }),
  removeChildSelection: (id: string, children: number[]) => set(state => {
    const maybePreviousChildren: Set<number> | [] = state.selections[id]?.children ?? [];
    const newSet = new Set<number>([...maybePreviousChildren].filter(child => !children.includes(child)));
    const newChildren = newSet.size > 0 ? newSet : undefined;

    return {
      selections: {...state.selections, [id]: {children: newChildren}}
    };
  }),
  toggleChildSelection: (id: string, children: number[]) => set(state => {
    // Select all elements in state.selections, extracting [id] separately
    const {[id]: current, ...selections} = state.selections;
    console.log("current: ", current);

    const previousChildren: Set<number> = current?.children ?? new Set<number>();
    const childrenSet = new Set<number>(children);

    const symmetricDiff = new Set<number>([
      ...[...previousChildren].filter(x => !childrenSet.has(x)),
      ...[...childrenSet].filter(x => !previousChildren.has(x))
    ]);

    console.log("symmetricDiff: ", symmetricDiff, "\npreviousChildren: ", previousChildren, "\nchildrenSet: ", childrenSet);

    if (symmetricDiff.size === 0)
      return {selections: selections};

    return {
      selections: {...selections, [id]: {children: symmetricDiff}}
    };
  }),
}));

export default createSelectionSlice;
