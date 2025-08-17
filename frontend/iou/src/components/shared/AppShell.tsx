import type { ReactNode } from "react";

/**
 * Props for the AppShell component
 */
interface AppShellProps {
  children: ReactNode;
}

/**
 * It provides a consistent layout structure for all pages/views in the application.
 * It acts as a container that wraps around the main content (children).
 * The children prop allows any content to be rendered within the main content area while maintaining the consistent header and overall layout structure.
 * @param AppShellProps - Props containing the children elements to be rendered inside the shell.
 * @returns The rendered AppShell component.
 */
export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          {/* App Title */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">IOU Calculator</h1>
          </div>

          {/* User Avatar */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">U</span>
            </div>
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
