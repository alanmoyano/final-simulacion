# Agent Guidelines

## Build/Test Commands
- **Dev server**: `npm run dev` or `bun dev`
- **Build**: `npm run build` or `bun run build` (runs TypeScript check + Vite build)
- **Lint**: `npm run lint` or `bun run lint`
- **Preview**: `npm run preview` or `bun run preview`

## Code Style
- **Formatting**: Uses Prettier with single quotes, no semicolons, trailing commas
- **Imports**: Use `@/` alias for src imports (e.g., `import { Button } from '@/components/ui/button'`)
- **TypeScript**: Strict typing enabled, use proper type annotations
- **React**: Functional components with hooks, use `React.ComponentProps<>` for prop types
- **Naming**: camelCase for variables/functions, PascalCase for components
- **File structure**: Components in `/components`, services in `/services`, utils in `/lib`
- **Styling**: Tailwind CSS with utility classes, use `cn()` from utils for conditional classes
- **Error handling**: Use TypeScript strict mode, handle unknown types explicitly

## Framework Details
- **Build tool**: Vite + SWC for React
- **UI**: Radix UI primitives + Tailwind CSS
- **State**: React hooks (useState, etc.)
- **Package manager**: Bun (bun.lock present)