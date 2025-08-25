import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateNewWorkspacePage() {
  const [dimension, setDimension] = useState("2D");
    
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
      <Card className="w-[400px] p-6"> {/* widened from 400px to 500px */}
        <CardHeader>
          <CardTitle className="text-center text-xl">New Workspace</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="w-32 text-sm font-medium">Name</label>
            <Input
              className="w-full" // takes all remaining space inside the row
              type="text"
              placeholder="Workspace Name"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="w-32 text-sm font-medium">Dimensions</label>
            <div className="flex w-full gap-2">
              <Button
                className="flex-1"
                variant={dimension === "2D" ? "default" : "outline"}
                onClick={() => setDimension("2D")}
              >
                2D
              </Button>
              <Button
                className="flex-1"
                variant={dimension === "3D" ? "default" : "outline"}
                onClick={() => setDimension("3D")}
              >
                3D
              </Button>
            </div>
          </div>


          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1">
              Create Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
