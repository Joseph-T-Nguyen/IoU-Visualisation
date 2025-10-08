import FlexyCanvas from "@/components/shared/FlexyCanvas.tsx";
import SpinningCube from "@/components/three/SpinningCube.tsx";
import {Button} from "@/components/ui/button.tsx";
import {TrackballControls} from "@react-three/drei";
import { useNavigate } from "react-router";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

/************* Type declarations *************/
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          disableAutoSelect: () => void;
          revoke: (hint: string, callback: () => void) => void;
        };
      };
    };
  }
}

interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
  clientId?: string;
}
/********************************************/

export default function LandingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string; picture?: string } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (credentialResponse: GoogleCredentialResponse) => {
    if (credentialResponse.credential) {
      // Decode JWT to get profile info
      const decoded = jwtDecode<{ name: string; email: string; picture?: string }>(
        credentialResponse.credential
      );
      console.log("Logged in user:", decoded);
      
      // Store user in state and localStorage
      setUser(decoded);
      localStorage.setItem('user', JSON.stringify(decoded));
      
      // Optionally redirect
      // navigate("/workspaces");
    }
  };
  
  const handleLoginError = () => {
    console.error("Google login failed");
  };

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout calls
    setIsLoggingOut(true);

    try {
      // Store email before clearing
      const userEmail = user?.email;

      // Clear Google session
      googleLogout();
      
      // Wait for Google SDK to be ready and revoke
      if (userEmail && window.google?.accounts?.id) {
        // Disable auto-select first
        window.google.accounts.id.disableAutoSelect();
        
        // Revoke with promise wrapper for proper async handling
        await new Promise<void>((resolve) => {
          window.google!.accounts!.id!.revoke(userEmail, () => {
            console.log('Google session revoked for', userEmail);
            resolve();
          });
          
          // Fallback timeout in case callback never fires
          setTimeout(resolve, 1000);
        });
      }
      
      // Small delay to ensure revocation completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Clear local state and storage
      setUser(null);
      localStorage.removeItem('user');
      
      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if revoke fails
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative py-0 flex p-0 min-h-[100dv] overflow-hidden h-screen w-full flex-col bg-secondary">
      <div className="flex flex-row justify-between items-center py-3 px-6">
        <h1 className="text-4xl font-light">IOU Calculator</h1>
        <div className="flex gap-3">
          {!user ? (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
            />
          ) : (
            <>
              <div className="flex items-center gap-2">
                {user.picture && (
                  <img 
                    src={user.picture} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm">{user.name}</span>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="shadow-lg"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Log Out"}
              </Button>
            </>
          )}
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