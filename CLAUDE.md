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
```

## Project Structure

```
src/
├── App.tsx          # Main application component
├── main.tsx         # React app entry point
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

## ESLint Configuration

Uses flat config format (`eslint.config.js`) with:
- TypeScript ESLint recommended rules
- React Hooks plugin (recommended rules)
- React Refresh plugin for Vite HMR
- Ignores `dist/` directory

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
- **Linting**: ESLint 9 with TypeScript support
- **Commit linting**: commitlint with conventional config

## Notes

- The project has no StrictMode wrapper in main.tsx
- Uses React 19's `createRoot` API
- No testing framework is currently configured
