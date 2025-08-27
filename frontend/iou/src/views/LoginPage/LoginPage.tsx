import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
      <Card className="w-[400px] p-4 rounded-sm">
        <CardHeader>
          <CardTitle className="text-center -mt-1">Log in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 -mt-3 p-0">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <label className="w-30 text-sm font-medium">Email</label>
              <Input type="email" />
            </div>
            <div className="flex items-center space-x-3">
              <label className="w-30 text-sm font-medium">Password</label>
              <Input type="password" />
            </div>
          </div>
          <Button className="w-full rounded-sm">Log in</Button>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-22 w-[400px] text-sm">
        <span className="text-muted-foreground cursor-pointer">Create an Account</span>
        <span className="text-muted-foreground cursor-pointer">Forgot Password?</span>
      </div>
    </div>
  );
}