import useWorkspaceDelete from "@/hooks/workspace/input/useWorkspaceDelete.ts";
import useWorkspaceDeselect from "@/hooks/workspace/input/useWorkspaceDeselect.ts";
import useWorkspaceHide from "@/hooks/workspace/input/useWorkspaceHide.ts";
import useWorkspaceUndo from "@/hooks/workspace/input/useWorkspaceUndo.ts";
import useWorkspaceClipboard from "@/hooks/workspace/input/useWorkspaceClipboard.ts";

/**
 * A component that just contains all the hooks for workspace actions.
 * I put this here to avoid unnecessary rerenders of the whole workspace page.
 * @constructor
 */
export default function WorkspaceActionListener() {
  useWorkspaceDelete();
  useWorkspaceDeselect();
  useWorkspaceHide();

  useWorkspaceUndo();
  useWorkspaceClipboard();

  return (<></>);
}