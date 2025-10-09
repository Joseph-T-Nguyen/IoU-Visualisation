import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar.tsx";
import { useNavigate } from "react-router";

export interface WorkspaceMenubarProps {
  onDuplicate: () => void;
  onDownload: () => void;
  onImport: () => void;
  onScreenshot: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
}

export default function WorkspaceMenubar({
  onDuplicate,
  onDownload,
  onImport,
  onScreenshot,
  onUndo,
  onRedo,
  onCut,
  onCopy,
  onPaste,
}: WorkspaceMenubarProps) {
  const navigate = useNavigate();

  return (
    <Menubar className="pointer-events-auto shadow-lg">
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer">File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => navigate("/workspaces/new")}>
            New Workspace <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={onDuplicate}>
            Duplicate Workspace <MenubarShortcut>⇧⌘D</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={onImport}>Import</MenubarItem>
          <MenubarItem onClick={onDownload}>Download</MenubarItem>
          <MenubarItem onClick={onScreenshot}>Take a screenshot</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer">Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={onUndo}>
            Undo <MenubarShortcut>Ctrl+Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={onRedo}>
            Redo <MenubarShortcut>Shift+Ctrl+Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={onCut}>
            Cut <MenubarShortcut>Ctrl+X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={onCopy}>
            Copy <MenubarShortcut>Ctrl+C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={onPaste}>
            Paste <MenubarShortcut>Ctrl+V</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
