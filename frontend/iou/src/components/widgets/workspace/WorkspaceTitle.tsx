import useWorkspaceStore from "@/hooks/workspace/stores/useWorkspaceStore.ts";
import {Input} from "@/components/ui/input.tsx";


export default function WorkspaceTitle() {
  const { displayName: workspaceName, setDisplayName } = useWorkspaceStore();

  return (
    <Input
      className="h-8 flex-grow font-medium text-left align-middle border-none shadow-none pointer-events-auto px-0 focus-visible:px-1.5 transition-[padding] w-96 text-shadow-sm w-fit"
      fontSizeClassName="text-lg"
      value={workspaceName}
      onChange={(event) => setDisplayName(event.target.value)}
    />
  );
}