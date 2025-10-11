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
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useState } from "react";

export default function CreateNewWorkspacePage() {
  const navigate = useNavigate();
  const { createWorkspace } = useWorkspaces();
  const [workspaceName, setWorkspaceName] = useState("Untitled");
  const [isCreating, setIsCreating] = useState(false);

  const handleCancel = () => {
    navigate("/workspaces");
  };

  const handleCreateWorkspace = async () => {
    setIsCreating(true);
    try {
      // Create the workspace in the database
      const newWorkspace = await createWorkspace(workspaceName);
      if (newWorkspace) {
        // Navigate directly to the newly created workspace
        navigate(`/workspace/${newWorkspace.id}`);
      } else {
        // If creation failed, go back to workspaces page
        navigate("/workspaces");
      }
    } catch (error) {
      console.error("Failed to create workspace:", error);
      navigate("/workspaces");
    } finally {
      setIsCreating(false);
    }
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
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
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
            <Button variant="outline" onClick={handleCancel} disabled={isCreating}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkspace} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Workspace"}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
