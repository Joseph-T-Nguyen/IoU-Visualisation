import type { ReactNode } from "react";
import { Button } from "@/components/ui/button.tsx";

/**
 * Props for the AppShell component
 */
interface AppShellProps {
  children: ReactNode;
  user?: { name: string; email: string; picture?: string } | null;
  onLogout?: () => void;
  isLoggingOut?: boolean;
}

/**
 * It provides a consistent layout structure for all pages/views in the application.
 * It acts as a container that wraps around the main content (children).
 * The children prop allows any content to be rendered within the main content area while maintaining the consistent header and overall layout structure.
 * @param AppShellProps - Props containing the children elements to be rendered inside the shell.
 * @returns The rendered AppShell component.
 */
export default function AppShell({ children, user, onLogout, isLoggingOut }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          {/* App Title */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">IOU Calculator</h1>
          </div>

          {/* User Avatar and Logout */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        console.log('Failed to load profile picture, using fallback avatar');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm text-white font-semibold">
                      {user.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div>
                {onLogout && (
                  <Button
                    variant="outline"
                    onClick={onLogout}
                    className="shadow-sm"
                    disabled={isLoggingOut}
                    size="sm"
                  >
                    {isLoggingOut ? "Logging out..." : "Log Out"}
                  </Button>
                )}
              </>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-sm text-white font-semibold">
                ?
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16 py-16">
        {children}
      </main>
    </div>
  );
}
