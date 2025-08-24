# Frontend Architecture Documentation

## Overview

This document provides a comprehensive overview of the frontend architecture for the IoU Visualisation application.

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── shared/         # Shared components used across multiple views
│   ├── three/          # Three.js and 3D visualization components
│   └── ui/             # Base UI components (from shadcn/ui)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── views/              # Page-level components
├── assets/             # Static assets (images, icons)
├── App.tsx             # Main application component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Component Documentation

### Views (Pages)

#### `WorkspacesPage` (`src/views/WorkspacesPage/WorkspacesPage.tsx`)
**Purpose**: Main workspace management interface
**Key Features**:
- Displays grid of user workspaces
- Handles workspace CRUD operations
- Manages dialogs for create, rename, delete, share, and version history
**State Management**:
- Uses `useWorkspaces` hook for data and operations
- Local state for dialog management
**Props**: None (top-level page component)

#### `LandingPage` (`src/views/LandingPage/LandingPage.tsx`)
**Purpose**: Application landing/home page
**Features**: Initial user interface with navigation to workspaces

#### `ReactExampleView` (`src/views/ReactExampleView/ReactExampleView.tsx`)
**Purpose**: Example view demonstrating React patterns
**Usage**: Development reference and testing

### Shared Components

#### `AppShell` (`src/components/shared/AppShell.tsx`)
**Purpose**: Main application layout wrapper
**Features**:
- Consistent page structure
- Navigation elements
- Content container
**Props**:
- `children: ReactNode` - Page content to render

#### `WorkspaceGrid` (`src/components/shared/WorkspaceGrid.tsx`)
**Purpose**: Grid layout for workspace cards
**Features**:
- Responsive grid (1-4 columns based on screen size)
- Scrollable when more than 8 workspaces
- Passes workspace actions to individual cards
**Props**:
```typescript
interface WorkspaceGridProps {
  workspaces: Workspace[]
  maxVisibleCards?: number // Default: 8
  onRenameWorkspace?: (id: string, currentName: string) => void
  onDeleteWorkspace?: (id: string, name: string) => void
  onVersionHistory?: (id: string, name: string) => void
  onShareWorkspace?: (id: string, name: string) => void
  onDuplicateWorkspace?: (id: string) => void
}
```

#### `WorkspaceCard` (`src/components/shared/WorkspaceCard.tsx`)
**Purpose**: Individual workspace display card
**Features**:
- Preview image area
- Workspace name and last edited date
- Dropdown menu with actions
**Props**:
```typescript
interface WorkspaceCardProps {
  name: string
  lastEdited: string
  previewImage?: ReactNode
  onMenuClick?: () => void
  onRename?: () => void
  onDelete?: () => void
  onVersionHistory?: () => void
  onShare?: () => void
  onDuplicate?: () => void
}
```

#### `FlexyCanvas` (`src/components/shared/FlexyCanvas.tsx`)
**Purpose**: Flexible canvas component for visualizations
**Usage**: Base for interactive visual elements

### Three.js Components

#### `SpinningCube` (`src/components/three/SpinningCube.tsx`)
**Purpose**: 3D animated cube demonstration
**Features**:
- Rotating 3D cube using Three.js
- Example of React Three Fiber integration
**Usage**: 3D visualization demonstrations

### UI Components (shadcn/ui)

These are base UI components from the shadcn/ui library, customized for our application:

#### `Button` (`src/components/ui/button.tsx`)
**Purpose**: Reusable button component
**Variants**: default, destructive, outline, secondary, ghost, link
**Sizes**: default, sm, lg, icon

#### `Card` (`src/components/ui/card.tsx`)
**Purpose**: Container component for content
**Sub-components**: CardHeader, CardTitle, CardDescription, CardContent, CardFooter

#### `Dialog` (`src/components/ui/dialog.tsx`)
**Purpose**: Modal dialog component
**Sub-components**: DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter

#### `DropdownMenu` (`src/components/ui/dropdown-menu.tsx`)
**Purpose**: Dropdown menu component
**Sub-components**: DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator

#### `Input` (`src/components/ui/input.tsx`)
**Purpose**: Text input field component
**Features**: Consistent styling, accessibility

#### `ScrollArea` (`src/components/ui/scroll-area.tsx`)
**Purpose**: Scrollable container with custom scrollbar
**Usage**: Used in WorkspaceGrid for overflow handling

## Hooks Documentation

### `useWorkspaces` (`src/hooks/useWorkspaces.ts`)
**Purpose**: Central workspace data management
**Returns**:
```typescript
{
  workspaces: Workspace[]           // Array of workspace objects
  loading: boolean                  // Loading state
  createWorkspace: (name: string) => void
  renameWorkspace: (id: string, newName: string) => void
  deleteWorkspace: (id: string) => void
  duplicateWorkspace: (id: string) => void
  getWorkspaceVersions: (id: string) => Version[]
}
```
**Features**:
- Mock data generation (to be replaced with API calls)
- Version history tracking
- Smart duplicate naming (adds "(copy)" or "(copy N)")

## Utilities

### `utils.ts` (`src/lib/utils.ts`)
**Purpose**: Utility functions
**Key Functions**:
- `cn()`: Class name merger using clsx and tailwind-merge
  ```typescript
  cn(...inputs: ClassValue[]) => string
  ```

## Data Models

### Workspace Interface
```typescript
interface Workspace {
  id: string
  name: string
  lastEdited: string
  previewImage?: string
  versions?: Version[]
}
```

### Version Interface
```typescript
interface Version {
  id: string
  timestamp: string
  action: string
}
```

## Styling Architecture

### Tailwind CSS
- Utility-first CSS framework
- Configuration in `tailwind.config.js`
- Custom theme extensions for brand colors

### CSS Architecture
- Global styles in `index.css`
- Component-specific styles using Tailwind classes
- CSS-in-JS via className props

## State Management Strategy

### Current Implementation
- Local component state using React hooks
- Prop drilling for shared state
- Custom hooks for business logic

### Future Considerations
- Context API for global state (user, theme)
- Potential integration with state management library (Redux/Zustand)
- API state management with React Query/SWR

## Routing

### React Router Configuration
- Routes defined in `App.tsx`
- Current routes:
  - `/` - Landing page
  - `/workspaces` - Workspaces page
  - `/react-example` - Example view

## Build and Development

### Vite Configuration
- Fast HMR (Hot Module Replacement)
- TypeScript support
- Path aliases (`@/` for `src/`)
- Environment variable handling

### TypeScript Configuration
- Strict mode enabled
- Path mapping for imports
- Separate configs for app and node

## Best Practices

### Component Guidelines
1. Use functional components with hooks
2. Keep components focused and single-purpose
3. Extract reusable logic into custom hooks
4. Use TypeScript interfaces for props
5. Document complex logic with comments

### File Organization
1. Group related components together
2. Keep styles close to components
3. Use index files for cleaner imports
4. Separate business logic from UI

### Performance Considerations
1. Use React.memo for expensive components
2. Implement lazy loading for routes
3. Optimize re-renders with useCallback/useMemo
4. Keep bundle size minimal

## Testing Strategy (To Be Implemented)

### Unit Testing
- Jest for test runner
- React Testing Library for component tests
- Mock service worker for API mocking

### Integration Testing
- Test user workflows
- Test component interactions
- Validate data flows

### E2E Testing
- Playwright or Cypress for end-to-end tests
- Test critical user paths

## Future Enhancements

1. **API Integration**
   - Replace mock data with real backend
   - Implement authentication
   - Add real-time updates

2. **Enhanced Features**
   - Collaborative editing
   - Advanced visualization tools
   - Export/import functionality

3. **Performance Optimizations**
   - Code splitting
   - Virtual scrolling for large lists
   - Image optimization

4. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

## Dependencies Overview

### Production Dependencies
- **React & React DOM**: Core framework
- **React Router**: Client-side routing
- **Three.js & React Three Fiber**: 3D graphics
- **Radix UI**: Accessible UI primitives
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **clsx & tailwind-merge**: Utility functions

### Development Dependencies
- **TypeScript**: Type safety
- **Vite**: Build tool
- **ESLint**: Code linting
- **shadcn**: Component generator