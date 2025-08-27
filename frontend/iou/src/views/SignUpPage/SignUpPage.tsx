import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
      <Card className="w-[400px] p-4 rounded-sm">
        <CardHeader>
          <CardTitle className="text-center -mt-1">Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 -mt-2 p-0">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <label className="w-30 text-sm font-medium">Email</label>
              <Input type="email" />
            </div>
            <div className="flex items-center space-x-3">
              <label className="w-30 text-sm font-medium">Username</label>
              <Input type="text" />
            </div>
            <div className="flex items-center space-x-3">
              <label className="w-30 text-sm font-medium">Password</label>
              <Input type="password" />
            </div>
            <div className="flex items-center space-x-3">
              <label className="w-30 text-sm font-medium">Confirm Password</label>
              <Input type="password" />
            </div>
            <Button className="w-full mt-2 rounded-sm">Sign Up</Button>
          </div>
        </CardContent>
      </Card>
      <span className="text-muted-foreground">Log in</span>
    </div>
  );
}
