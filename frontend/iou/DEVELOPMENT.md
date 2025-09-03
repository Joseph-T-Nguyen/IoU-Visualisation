# Development Guide

This guide provides instructions for developers working on the IoU Visualisation project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guide](#code-style-guide)
- [Adding New Features](#adding-new-features)
- [Common Tasks](#common-tasks)

---

## Getting Started

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm/yarn**: Latest version recommended
- **Git**: For version control
- **VS Code** (recommended): With TypeScript and ESLint extensions

### Initial Setup

1. **Clone the repository**:

```bash
git clone https://github.com/yourusername/IoU-Visualisation.git
cd IoU-Visualisation
```

2. **Install dependencies**:

```bash
cd frontend/iou
npm install
```

3. **Start development server**:

```bash
npm run dev
```

4. **Open browser**:
   Navigate to `http://localhost:5173`

### Environment Setup

Create a `.env` file in `frontend/iou/` for environment variables:

```env
# API Configuration (when backend is ready)
VITE_API_URL=http://localhost:3000
VITE_API_KEY=your-api-key

# Feature Flags
VITE_ENABLE_3D=true
VITE_ENABLE_SHARING=true
```

---

## Development Workflow

### Branch Strategy

We follow a feature branch workflow:

1. **Main branch**: `main` - Production-ready code
2. **Feature branches**: `feat/feature-name` - New features
3. **Bug fix branches**: `fix/bug-description` - Bug fixes
4. **Documentation**: `docs/description` - Documentation updates

### Creating a New Feature

1. **Create feature branch**:

```bash
git checkout -b feat/your-feature-name
```

2. **Make changes and commit**:

```bash
git add .
git commit -m "feat: add your feature description"
```

3. **Push to remote**:

```bash
git push origin feat/your-feature-name
```

4. **Create Pull Request**:

- Go to GitHub repository
- Click "New Pull Request"
- Select your branch
- Add description and submit

### Commit Message Convention

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:

```bash
git commit -m "feat: add workspace duplication functionality"
git commit -m "fix: resolve dialog closing issue"
git commit -m "docs: update component documentation"
```

---

## Code Style Guide

### TypeScript Guidelines

1. **Always use TypeScript** for new files
2. **Define interfaces** for all props and data structures:

```typescript
interface WorkspaceProps {
  id: string;
  name: string;
  lastEdited: string;
}
```

3. **Use type annotations**:

```typescript
const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
  // handler code
};
```

4. **Avoid `any` type** - use `unknown` if type is truly unknown

### React Best Practices

1. **Functional Components**:

```tsx
export default function ComponentName({ prop1, prop2 }: Props) {
  return <div>Content</div>;
}
```

2. **Custom Hooks** for reusable logic:

```typescript
function useCustomHook() {
  const [state, setState] = useState();
  // hook logic
  return { state, setState };
}
```

3. **Memoization** for expensive operations:

```typescript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(input);
}, [input]);
```

### Styling Guidelines

1. **Use Tailwind classes**:

```tsx
<div className="flex items-center justify-between p-4">
```

2. **Component variants with CVA**:

```typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "default-classes",
      outline: "outline-classes",
    },
  },
});
```

3. **Responsive design**:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
```

### File Organization

1. **Component files**:

```
ComponentName.tsx       # Component implementation
ComponentName.test.tsx  # Component tests (future)
ComponentName.stories.tsx # Storybook stories (future)
```

2. **Import order**:

```typescript
// 1. External imports
import React from "react";
import { useRouter } from "react-router";

// 2. Internal components
import Button from "@/components/ui/button";

// 3. Hooks
import { useWorkspaces } from "@/hooks/useWorkspaces";

// 4. Utils
import { cn } from "@/lib/utils";

// 5. Types
import type { Workspace } from "@/types";

// 6. Styles (if any)
import "./styles.css";
```

---

## Adding New Features

### Creating a New Component

1. **Create component file**:

```bash
touch src/components/shared/NewComponent.tsx
```

2. **Basic component structure**:

```tsx
interface NewComponentProps {
  title: string;
  onAction?: () => void;
}

export default function NewComponent({ title, onAction }: NewComponentProps) {
  return (
    <div className="p-4">
      <h2>{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </div>
  );
}
```

3. **Add to parent component**:

```tsx
import NewComponent from "@/components/shared/NewComponent";

// In parent component
<NewComponent title="My Title" onAction={handleAction} />;
```

### Adding a New Page/View

1. **Create view directory**:

```bash
mkdir src/views/NewPage
touch src/views/NewPage/NewPage.tsx
```

2. **Create page component**:

```tsx
import AppShell from "@/components/shared/AppShell";

export default function NewPage() {
  return (
    <AppShell>
      <h1>New Page</h1>
      {/* Page content */}
    </AppShell>
  );
}
```

3. **Add route in App.tsx**:

```tsx
import NewPage from "@/views/NewPage/NewPage";

// In router configuration
<Route path="/new-page" element={<NewPage />} />;
```

### Adding a Custom Hook

1. **Create hook file**:

```bash
touch src/hooks/useNewHook.ts
```

2. **Implement hook**:

```typescript
import { useState, useEffect } from "react";

export function useNewHook(initialValue: string) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, [value]);

  return { value, setValue };
}
```

### Adding UI Components from shadcn/ui

1. **Use shadcn CLI**:

```bash
npx shadcn add [component-name]
```

2. **Component will be added to** `src/components/ui/`

3. **Import and use**:

```tsx
import { ComponentName } from "@/components/ui/component-name";
```

---

## Common Tasks

### Running Tests (Future Implementation)

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run coverage
npm run test:coverage
```

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update specific dependency
npm install package-name@latest
```

---

## Resources

### Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [shadcn/ui](https://ui.shadcn.com/)

### Tools

- [React DevTools](https://react.dev/learn/react-developer-tools)
- [VS Code Extensions](https://marketplace.visualstudio.com/)
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin

### Learning Resources

- [React Patterns](https://reactpatterns.com/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Three.js Journey](https://threejs-journey.com/)

---

## Getting Help

1. **Check Documentation**: Review this guide and ARCHITECTURE.md
2. **Search Issues**: Check GitHub issues for similar problems
3. **Ask Team**: Reach out to team members
4. **Create Issue**: If bug found, create detailed GitHub issue
