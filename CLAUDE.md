# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React 19.2 + TypeScript + Vite project for the Tenpo technical challenge. The project uses modern React patterns with strict TypeScript configuration.

## Development Commands

### Running the application
```bash
npm run dev          # Start development server with HMR
npm run preview      # Preview production build locally
```

### Building
```bash
npm run build        # Type-check with tsc and build for production
```

### Code Quality
```bash
npm run lint         # Run ESLint on all TypeScript files
npm run lint:fix     # Run ESLint and auto-fix issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting without changing files
```

## Project Structure

```
src/
├── App.tsx          # Main application component
├── main.tsx         # React app entry point with QueryClient and MSW setup
├── lib/
│   └── queryClient.ts  # TanStack Query client configuration
├── mocks/
│   ├── browser.ts      # MSW browser worker setup
│   └── handlers.ts     # MSW request handlers (API mocks)
├── assets/          # Static assets (images, etc.)
├── App.css          # Component-specific styles
└── index.css        # Global styles
```

## TypeScript Configuration

The project uses a strict TypeScript setup with the following key settings:

- **Target**: ES2022 with bundler module resolution
- **Strict mode**: Enabled with additional strictness (`noUnusedLocals`, `noUnusedParameters`)
- **JSX**: `react-jsx` (uses React 19's automatic JSX runtime)
- **Build info**: Stored in `./node_modules/.tmp/tsconfig.app.tsbuildinfo`

The configuration is split across multiple files:
- `tsconfig.json` - Root config with project references
- `tsconfig.app.json` - Application-specific settings (src/)
- `tsconfig.node.json` - Node/Vite tooling settings

## ESLint & Prettier Configuration

Uses flat config format (`eslint.config.js`) with:
- TypeScript ESLint recommended rules
- React Hooks plugin (recommended rules)
- React Refresh plugin for Vite HMR
- Prettier integration (eslint-plugin-prettier)
- Ignores `dist/` directory

Prettier settings (`.prettierrc`):
- Semicolons enabled
- Double quotes
- 80 character line width
- 2-space indentation
- ES5 trailing commas

## Git Commit Conventions

The project uses commitlint with conventional commits format. Commits can optionally include emojis:

```
[emoji] type(scope): subject
```

Example: `feat(auth): add login component`

The parser accepts emojis at the beginning of commit messages.

## Technology Stack

- **React**: 19.2 (latest with automatic JSX runtime)
- **Build tool**: Vite 7.2
- **Language**: TypeScript 5.9
- **HTTP Client**: Axios 1.13
- **State Management**: TanStack Query (React Query) 5.90
- **API Mocking**: Mock Service Worker (MSW) 2.12
- **Linting**: ESLint 9 with TypeScript support
- **Formatting**: Prettier 3.6
- **Commit linting**: commitlint with conventional config
- **Git hooks**: Husky 9.1 with lint-staged 16.2

## API Mocking with MSW

Mock Service Worker is configured to run automatically in development mode. To add new API mocks:

1. Add handlers in `src/mocks/handlers.ts`
2. MSW will intercept matching requests automatically
3. Check browser console for `[MSW]` logs confirming interception

Example handler:
```typescript
http.get('/api/users', () => {
  return HttpResponse.json({ users: [] })
})
```

## TanStack Query Setup

The QueryClient is configured in `src/lib/queryClient.ts` with:
- 5-minute stale time
- 10-minute garbage collection time
- Single retry on failure
- No refetch on window focus

The app is wrapped with `QueryClientProvider` in `main.tsx`.

## Git Hooks (Husky)

Pre-commit hook (`.husky/pre-commit`):
- Runs lint-staged on staged files
- Automatically formats with Prettier
- Runs ESLint with auto-fix

Commit-msg hook (`.husky/commit-msg`):
- Validates commit messages with commitlint
- Enforces conventional commits format
- Allows optional emoji prefix

Configuration in `.lintstagedrc`:
- TypeScript/JavaScript files: Prettier + ESLint
- CSS files: Prettier only

## Notes

- The project has no StrictMode wrapper in main.tsx
- Uses React 19's `createRoot` API
- MSW worker files are in `public/` directory
- No testing framework is currently configured
