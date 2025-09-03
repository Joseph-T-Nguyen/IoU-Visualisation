# IoU-Visualisation

A modern web application for creating, managing, and visualizing workspaces with interactive 3D elements and Intersection over Union metric visualization.

## Project Overview

IoU Visualisation is a React-based application that provides users with a workspace management system featuring:
- Workspace creation and management
- Interactive 3D visualizations using Three.js
- Version history tracking
- Workspace sharing capabilities
- Duplicate workspace functionality
- Intersection over Union metric visualization

## Tech Stack

### Core Technologies
- **React 19.1.0** - UI library
- **TypeScript 5.8.3** - Type-safe JavaScript
- **Vite 7.0.4** - Build tool and dev server
- **React Router 7.7.1** - Client-side routing

### UI & Styling
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI components
- **Lucide React** - Icon library
- **shadcn/ui** - Re-usable component library built on Radix UI

### 3D Graphics
- **Three.js 0.178.0** - 3D graphics library
- **React Three Fiber 9.3.0** - React renderer for Three.js

## Project Structure

```
IoU-Visualisation/
├── frontend/
│   └── iou/                    # Main React application
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   │   ├── shared/     # Shared components across views
│       │   │   ├── three/      # Three.js/3D components
│       │   │   └── ui/         # Base UI components (shadcn/ui)
│       │   ├── hooks/          # Custom React hooks
│       │   ├── lib/            # Utility functions
│       │   ├── views/          # Page components
│       │   └── App.tsx         # Main application component
│       ├── package.json        # Dependencies and scripts
│       └── vite.config.ts      # Vite configuration
└── README.md                   # This file
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/IoU-Visualisation.git
cd IoU-Visualisation
```

2. Navigate to the frontend directory:
```bash
cd frontend/iou
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

### Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

### Other Commands

- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

## Features

### Workspace Management
- Create new workspaces with custom names
- Rename existing workspaces
- Delete workspaces with confirmation
- Duplicate workspaces (creates copies with auto-numbered names)
- View workspace version history

### Workspace Sharing
- Share workspaces with customizable permissions (Viewer/Editor)
- Generate shareable links
- Copy share links to clipboard

### UI Features
- Responsive grid layout
- Scrollable workspace grid for large collections
- Context menus for workspace actions
- Modal dialogs for user interactions
- Real-time date formatting

## Architecture

### Component Architecture
The application follows a modular component structure:
- **Views**: Full-page components (LandingPage, WorkspacesPage)
- **Shared Components**: Reusable components (AppShell, WorkspaceCard, WorkspaceGrid)
- **UI Components**: Base components from shadcn/ui
- **Three Components**: 3D visualization components

### State Management
- Local component state using React hooks
- Custom hooks for business logic (`useWorkspaces`)
- Mock data for development (to be replaced with API integration)

### Frontend

The frontend is written in React with TypeScript. Please look under [`./frontend`](./frontend/README.md) for more details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- 3D graphics powered by [Three.js](https://threejs.org/)