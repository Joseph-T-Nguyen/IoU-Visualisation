import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
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
}

export default function WorkspaceMenubar({
  onDuplicate,
  onDownload,
  onImport,
  onScreenshot,
  onUndo,
  onRedo,
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
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Search the web</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Find...</MenubarItem>
              <MenubarItem>Find Next</MenubarItem>
              <MenubarItem>Find Previous</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer">View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>
            Always Show Full URLs
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            Reload <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Toggle Fullscreen</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Hide Sidebar</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
