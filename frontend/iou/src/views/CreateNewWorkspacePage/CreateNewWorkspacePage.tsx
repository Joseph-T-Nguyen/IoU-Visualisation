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
import { useState } from "react";

export default function CreateNewWorkspacePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("Untitled");
  const [dimensions, setDimensions] = useState<"2d" | "3d">("3d");
  const [isCreating, setIsCreating] = useState(false);

  const handleCancel = () => {
    navigate("/workspaces");
  };

  const handleCreateWorkspace = async () => {
    if (!name.trim()) {
      alert("Please enter a workspace name");
      return;
    }

    setIsCreating(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const ownerId = import.meta.env.VITE_USER_ID || '1';

      const res = await fetch(`${apiUrl}/api/workspaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId,
          name: name.trim()
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create workspace: ${res.status}`);
      }

      const created = await res.json();
      console.log("Workspace created:", created);

      // Navigate to the newly created workspace
      navigate(`/workspace/${created.id}`);
    } catch (error) {
      console.error("Failed to create workspace:", error);
      alert("Failed to create workspace. Please try again.");
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isCreating}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-22 text-sm font-medium">Dimensions</label>
            <Tabs value={dimensions} onValueChange={(v) => setDimensions(v as "2d" | "3d")} className="flex-1">
              <TabsList className="grid grid-cols-2 w-full rounded-sm">
                <TabsTrigger value="2d" className="rounded-sm" disabled={isCreating}>2D</TabsTrigger>
                <TabsTrigger value="3d" className="rounded-sm" disabled={isCreating}>3D</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex justify-end pt-4 space-x-2 w-1/2 ml-auto">
            <Button variant="outline" onClick={handleCancel} disabled={isCreating}>Cancel</Button>
            <Button onClick={handleCreateWorkspace} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Workspace"}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
