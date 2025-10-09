import useInvalidateOnVisibilityChange from "@/hooks/workspace/useInvalidateOnVisibilityChange.ts";

/**
 * Component that triggers canvas invalidation when shape visibility changes.
 * Must be rendered inside the Canvas component.
 */
export default function InvalidateOnVisibilityChange() {
  useInvalidateOnVisibilityChange();
  return null;
}
