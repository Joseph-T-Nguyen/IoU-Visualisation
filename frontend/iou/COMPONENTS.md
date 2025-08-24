# Components Reference Guide

This document provides detailed documentation for all components in the IoU Visualisation application.

## Table of Contents

- [View Components](#view-components)
- [Shared Components](#shared-components)
- [UI Components](#ui-components)
- [Three.js Components](#threejs-components)

---

## View Components

### WorkspacesPage

**Location**: `src/views/WorkspacesPage/WorkspacesPage.tsx`

**Description**: The main workspace management page where users can view, create, and manage their workspaces.

**Features**:
- Display all user workspaces in a grid layout
- Create new workspaces
- Rename existing workspaces
- Delete workspaces with confirmation
- Duplicate workspaces
- View version history
- Share workspaces with permissions

**State Variables**:
```typescript
- isDialogOpen: boolean              // Create workspace dialog
- workspaceName: string              // New workspace name
- isRenameDialogOpen: boolean        // Rename dialog
- renameWorkspaceId: string | null   // ID of workspace being renamed
- renameWorkspaceName: string        // New name for rename
- isDeleteDialogOpen: boolean        // Delete confirmation dialog
- deleteWorkspaceId: string | null   // ID of workspace being deleted
- deleteWorkspaceName: string        // Name of workspace being deleted
- isVersionDialogOpen: boolean       // Version history dialog
- versionWorkspaceId: string | null  // ID for version history
- versionWorkspaceName: string       // Name for version display
- isShareDialogOpen: boolean         // Share dialog
- shareWorkspaceId: string | null    // ID of workspace being shared
- shareWorkspaceName: string         // Name of workspace being shared
- sharePermission: "viewer" | "editor" // Share permission level
- isCopied: boolean                  // Copy link feedback
```

**Key Functions**:
- `handleCreateWorkspace()`: Creates new workspace
- `handleOpenDialog()`: Opens create dialog
- `handleOpenRenameDialog()`: Opens rename dialog
- `handleRenameWorkspace()`: Executes rename
- `handleOpenDeleteDialog()`: Opens delete confirmation
- `handleDeleteWorkspace()`: Executes deletion
- `handleOpenVersionDialog()`: Opens version history
- `handleOpenShareDialog()`: Opens share dialog
- `getShareUrl()`: Generates shareable URL
- `handleCopyLink()`: Copies share link to clipboard

---

## Shared Components

### AppShell

**Location**: `src/components/shared/AppShell.tsx`

**Description**: The main application layout wrapper that provides consistent structure across all pages.

**Props**:
```typescript
interface AppShellProps {
  children: ReactNode
}
```

**Usage**:
```tsx
<AppShell>
  <YourPageContent />
</AppShell>
```

---

### WorkspaceGrid

**Location**: `src/components/shared/WorkspaceGrid.tsx`

**Description**: Responsive grid container for displaying workspace cards.

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

**Features**:
- Responsive grid (1-4 columns)
- Automatic scrolling for >8 cards
- Scroll indicator
- Consistent spacing

**Grid Breakpoints**:
- Mobile: 1 column
- Tablet (sm): 2 columns
- Desktop (lg): 4 columns

---

### WorkspaceCard

**Location**: `src/components/shared/WorkspaceCard.tsx`

**Description**: Individual workspace card component with preview and actions.

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

**Menu Actions**:
1. Open workspace
2. Rename
3. Duplicate
4. Version history
5. Share
6. Delete (destructive action)

**Styling**:
- Card with hover shadow effect
- Preview area (gray background)
- Content area with name and date
- Three-dot menu for actions

---

### FlexyCanvas

**Location**: `src/components/shared/FlexyCanvas.tsx`

**Description**: Flexible canvas component for custom visualizations.

**Usage**: Base component for interactive visual elements and drawings.

---

## UI Components

These are base UI components from shadcn/ui, customized for the application.

### Button

**Location**: `src/components/ui/button.tsx`

**Variants**:
- `default`: Primary button style
- `destructive`: Red button for dangerous actions
- `outline`: Border-only button
- `secondary`: Secondary action button
- `ghost`: Minimal button style
- `link`: Text link style

**Sizes**:
- `default`: Standard size
- `sm`: Small size
- `lg`: Large size
- `icon`: Square icon button

**Example**:
```tsx
<Button variant="outline" size="sm" onClick={handleClick}>
  Click me
</Button>
```

---

### Card

**Location**: `src/components/ui/card.tsx`

**Sub-components**:
- `Card`: Main container
- `CardHeader`: Header section
- `CardTitle`: Title text
- `CardDescription`: Description text
- `CardContent`: Main content area
- `CardFooter`: Footer section

**Example**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer content</CardFooter>
</Card>
```

---

### Dialog

**Location**: `src/components/ui/dialog.tsx`

**Sub-components**:
- `Dialog`: Main container with open/onOpenChange props
- `DialogTrigger`: Element that triggers dialog
- `DialogContent`: Modal content container
- `DialogHeader`: Header section
- `DialogTitle`: Dialog title
- `DialogDescription`: Dialog description
- `DialogFooter`: Footer with actions

**Example**:
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <div>Content</div>
    <DialogFooter>
      <Button onClick={() => setIsOpen(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### DropdownMenu

**Location**: `src/components/ui/dropdown-menu.tsx`

**Sub-components**:
- `DropdownMenu`: Container
- `DropdownMenuTrigger`: Trigger element
- `DropdownMenuContent`: Menu content
- `DropdownMenuItem`: Individual menu item
- `DropdownMenuSeparator`: Visual separator

**Example**:
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={action1}>Item 1</DropdownMenuItem>
    <DropdownMenuItem onClick={action2}>Item 2</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={action3}>Item 3</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### Input

**Location**: `src/components/ui/input.tsx`

**Props**: Extends standard HTML input attributes

**Features**:
- Consistent styling
- Full accessibility support
- Works with form libraries

**Example**:
```tsx
<Input
  type="text"
  placeholder="Enter text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

### ScrollArea

**Location**: `src/components/ui/scroll-area.tsx`

**Props**:
```typescript
interface ScrollAreaProps {
  className?: string
  style?: CSSProperties
  type?: "auto" | "always" | "scroll" | "hover"
  children: ReactNode
}
```

**Usage**: Provides custom scrollbar styling for overflow content.

**Example**:
```tsx
<ScrollArea className="h-[300px]" type="always">
  <div>Long content that needs scrolling...</div>
</ScrollArea>
```

---

## Three.js Components

### SpinningCube

**Location**: `src/components/three/SpinningCube.tsx`

**Description**: Animated 3D cube demonstration using React Three Fiber.

**Features**:
- Continuous rotation animation
- React Three Fiber integration
- Example of 3D graphics in React

**Usage**:
```tsx
import { Canvas } from '@react-three/fiber'
import SpinningCube from '@/components/three/SpinningCube'

<Canvas>
  <SpinningCube />
</Canvas>
```

---

## Component Patterns

### Dialog Pattern

All dialogs in the application follow a consistent pattern:

1. **State Management**:
   - `isOpen` state variable
   - Related data states (IDs, names, etc.)

2. **Handler Functions**:
   - `handleOpen`: Prepares and opens dialog
   - `handleAction`: Executes the main action
   - `handleClose`: Cleanup and close

3. **Structure**:
   - Header with title and description
   - Content area with inputs/display
   - Footer with Cancel and Action buttons

### Action Menu Pattern

Dropdown menus for actions follow this structure:

1. **Trigger**: Three-dot icon or button
2. **Menu Items**: Grouped by type
   - Primary actions (Open, Edit)
   - Secondary actions (Share, History)
   - Destructive actions (Delete) - separated

### Grid Layout Pattern

Responsive grids use:
- Mobile-first approach
- Breakpoint-based columns
- Consistent gap spacing
- Overflow handling with ScrollArea

---

## Component Communication

### Props Flow
```
WorkspacesPage
  └── WorkspaceGrid (receives action handlers)
      └── WorkspaceCard (receives individual handlers)
          └── DropdownMenu (triggers actions)
```

### State Management Flow
1. Page component manages dialog states
2. `useWorkspaces` hook manages data
3. Actions flow up through callbacks
4. Data flows down through props

---

## Styling Guidelines

### Component Styling Priority
1. Tailwind utility classes
2. Component variants (via CVA)
3. Custom CSS (rarely needed)

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Use responsive utilities: `sm:`, `md:`, `lg:`, `xl:`

### Color Scheme
- Primary: Default button colors
- Destructive: Red variants for delete actions
- Muted: Gray backgrounds and borders
- Focus states: Ring utilities for accessibility

---

## Best Practices

### Component Creation
1. Start with TypeScript interface for props
2. Use functional components with hooks
3. Keep components focused on single responsibility
4. Extract reusable logic to custom hooks
5. Document complex logic with comments

### Performance
1. Use `React.memo` for expensive renders
2. Implement `useCallback` for stable callbacks
3. Use `useMemo` for expensive computations
4. Lazy load large components

### Accessibility
1. Use semantic HTML elements
2. Include ARIA labels where needed
3. Ensure keyboard navigation works
4. Test with screen readers

### Testing Considerations
1. Test user interactions
2. Test edge cases (empty states, errors)
3. Test responsive behavior
4. Mock external dependencies