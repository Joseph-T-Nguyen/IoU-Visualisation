import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* App Title */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                IOU Calculator
              </h1>
            </div>
            
            {/* User Avatar */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">U</span>
              </div>
            </div>
          
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}