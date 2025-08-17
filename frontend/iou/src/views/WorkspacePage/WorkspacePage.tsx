import FlexyCanvas from "@/components/shared/FlexyCanvas.tsx";
import ShapeRenderer from "@/components/three/shape/ShapeRenderer.tsx";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button.tsx";
import { LogOut } from "lucide-react"
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
} from "@/components/ui/menubar"

export default function WorkspacePage() {

  // Add these props to the camera to make it orthographic:
  // orthographic camera={{ zoom: 50, position: [0, 0, 100] }}

  const overlay = (
    <div className="flex flex-row justify-center w-full h-full py-3 p-3 gap-3">
      <div className="flex-grow">
        <div className="grid grid-cols-[auto_auto] gap-3 w-fit">
          {/* Main view overlay */}
          <div>
            <Button variant="outline" size="icon" className="size-8 pointer-events-auto w-9 h-9 cursor-pointer shadow-lg">
              <LogOut className="transform scale-x-[-1] " />
            </Button>
          </div>
          <div>
            <Menubar className="pointer-events-auto shadow-lg">
              <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    New Workspace <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarSub>
                    <MenubarSubTrigger>Share</MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>Email link</MenubarItem>
                      <MenubarItem>Messages</MenubarItem>
                      <MenubarItem>Notes</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />
                  <MenubarItem>
                    Print... <MenubarShortcut>⌘P</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
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
                <MenubarTrigger>View</MenubarTrigger>
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
          </div>

        </div>
      </div>
      <div className="min-w-64">
        {/* Right side-bar */}
        <Card className="w-full max-w-sm pointer-events-auto">
          <CardHeader>
            <CardTitle>Context Menu</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );

  return (
    <FlexyCanvas
      className="flex-grow w-screen h-screen overflow-clip"
      overlay={overlay}
    >
      {/* Add 3D content here: */}
      <ShapeRenderer vertices={[[2, 0, 0], [0, 2, 0], [-2, 0, 0], [2, 2, 0], [0, 1, 2]]}/>

      <ambientLight intensity={0.125} color="blue"/>
      <directionalLight position={[0, 0, 5]} color="#EEE" />
      {/*<orthographicCamera position={[0, 0, 5]} ></orthographicCamera>*/}
    </FlexyCanvas>
  );
}




