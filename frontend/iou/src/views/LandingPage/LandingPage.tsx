import FlexyCanvas from "@/components/shared/FlexyCanvas.tsx";
import SpinningCube from "@/components/three/SpinningCube.tsx";
import {Button} from "@/components/ui/button.tsx";
import {TrackballControls} from "@react-three/drei";
import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // optional if you want to parse profile info

export default function LandingPage() {
  const navigate = useNavigate();


  /**************************************************************************************************************************** */
  const handleLoginSuccess = (credentialResponse: any) => {       // TODO: Very bad rn but need to figure type of response we get 

  /**************************************************************************************************************************** */

    if (credentialResponse.credential) {
      // Decode JWT if you want profile info
      const user = jwtDecode<{ name: string; email: string }>(
        credentialResponse.credential
      );
      console.log("Logged in user:", user);

      // TODO: store user info in context/localStorage and redirect
      navigate("/workspaces");
    }
  };
  

  const handleLoginError = () => {
    console.error("Google login failed");
  };

  return (
    <div className="relative py-0 flex p-0 min-h-[100dv] overflow-hidden h-screen w-full flex-col bg-secondary">
      <div className="flex flex-row justify-between items-center py-3 px-6">
        <h1 className="text-4xl font-light">IOU Calculator</h1>
        <div className="flex gap-3">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            className="shadow-lg"
          >
            Log In
          </Button>
          <Button 
            onClick={() => navigate("/signup")}
            className="shadow-lg"
          >
            Sign Up
          </Button>
        </div>
      </div>

      <FlexyCanvas className="flex-grow"
        overlay={<div className="w-full flex flex-row justify-center h-full items-center">
          <Button 
            className="pointer-events-auto shadow-lg cursor-pointer" 
            variant={"outline"} 
            size="lg"
            onClick={() => navigate("/workspaces")}
          >
            Open Workspace
          </Button>
        </div>}
      >
        <SpinningCube></SpinningCube>
        <TrackballControls />
        <ambientLight intensity={0.1} color="blue"/>
        <directionalLight position={[0, 0, 5]} color="#CCC" />
        <orthographicCamera position={[0, 0, 1]} ></orthographicCamera>
      </FlexyCanvas>
    </div>
  );
}