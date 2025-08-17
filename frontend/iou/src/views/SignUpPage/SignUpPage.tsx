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
      <Card className="w-[400px] p-6">
        <CardHeader>
          <CardTitle className="text-center text-xl">Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <label className="w-32 text-sm font-medium">Email</label>
              <Input type="email" />
            </div>
            <div className="flex items-center space-x-3">
              <label className="w-32 text-sm font-medium">Username</label>
              <Input type="text" />
            </div>
            <div className="flex items-center space-x-3">
              <label className="w-32 text-sm font-medium">Password</label>
              <Input type="password" />
            </div>
            <div className="flex items-center space-x-3">
              <label className="w-32 text-sm font-medium">Confirm Password</label>
              <Input type="password" />
            </div>
          </div>
          <Button className="w-full mt-2">Sign Up</Button>
        </CardContent>
      </Card>
      <span className="text-muted-foreground">Log in</span>
    </div>
  );
}
