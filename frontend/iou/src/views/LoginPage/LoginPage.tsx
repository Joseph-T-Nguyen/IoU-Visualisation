import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px] p-6">
        <CardHeader>
          <CardTitle className="text-center text-xl">Log in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <label className="w-24 text-sm font-medium">Email</label>
              <Input type="email" />
            </div>
            <div className="flex items-center space-x-3">
              <label className="w-24 text-sm font-medium">Password</label>
              <Input type="password" />
            </div>
          </div>
          <Button className="w-full mt-2">Log in</Button>
        </CardContent>
        <CardFooter className="flex justify-between text-sm">
          <span className="text-muted-foreground">Create an Account</span>
          <span className="text-muted-foreground">Forgot Password?</span>
        </CardFooter>
      </Card>
    </div>
  );
}