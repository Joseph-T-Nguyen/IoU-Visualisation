import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router";

export default function CreateNewWorkspacePage() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/workspaces");
  };

  const handleCreateWorkspace = () => {
    // TODO: Add actual workspace creation logic when backend is ready
    console.log("Creating workspace...");
    navigate("/workspaces");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
      <Card className="w-[400px] p-4 rounded-sm">
        <CardHeader>
          <CardTitle className="text-center -mt-1">New Workspace</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 p-0">
          <div className="flex items-center gap-2">
            <label className="w-22 text-sm font-medium">Name</label>
            <Input
              className="flex-1"
              type="text"
              placeholder="Workspace Name"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-22 text-sm font-medium">Dimensions</label>
            <Tabs defaultValue="3d" className="flex-1">
              <TabsList className="grid grid-cols-2 w-full rounded-sm">
                <TabsTrigger value="2d" className="rounded-sm">2D</TabsTrigger>
                <TabsTrigger value="3d" className="rounded-sm">3D</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex justify-end pt-4 space-x-2 w-1/2 ml-auto">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleCreateWorkspace}>Create Workspace</Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
