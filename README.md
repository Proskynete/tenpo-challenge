# Tenpo Challenge - Movie Database Application

> Modern movie browsing application built with React 19, TypeScript, and The Movie Database API

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Coverage Status](https://coveralls.io/repos/github/Proskynete/tenpo-challenge/badge.svg?branch=main)](https://coveralls.io/github/Proskynete/tenpo-challenge?branch=main)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Authentication](#authentication)
- [Architecture](#architecture)
- [Documentation](#documentation)
- [License](#license)

## Overview

This is a full-stack React application developed as part of the Tenpo technical challenge. The application features user authentication, movie browsing with infinite scroll, internationalization support, and a modern, responsive UI built with shadcn/ui components.

**Live Demo Credentials:**

- Email: `leopoldo.henchoz@tenpo.cl`
- Password: any password (mocked authentication)

## Features

### Core Functionality

- **Authentication System**
  - Cookie-based token persistence (7-day expiration)
  - Protected routes with automatic redirects
  - Secure logout with token cleanup
  - Mock Service Worker (MSW) for API simulation

- **Movie Browsing**
  - Real-time data from The Movie Database (TMDb) API
  - Infinite scroll with TanStack Query
  - Responsive grid layout (2-5 columns)
  - Intersection Observer API for performance
  - Loading states and error handling

- **Internationalization (i18n)**
  - English and Spanish support
  - Automatic browser locale detection
  - i18next + react-i18next integration

- **Modern UI/UX**
  - shadcn/ui component library
  - Tailwind CSS v4 with standard color system
  - Lucide React icons
  - Responsive design (mobile-first)
  - Accessibility-ready components
  - Light mode only (dark mode removed for simplicity)

### Technical Features

- **TypeScript Strict Mode**
  - Full type safety across the application
  - ESLint with TypeScript support
  - Prettier code formatting

- **Performance Optimizations**
  - Route-based code splitting with React.lazy
  - Lazy loading for page components
  - 15% bundle size reduction (602 kB → 510 kB)
  - Separate chunks for route modules

- **Development Tools**
  - Husky for Git hooks
  - lint-staged for pre-commit checks
  - Commitlint for conventional commits
  - Hot Module Replacement (HMR)

## Tech Stack

### Core

| Technology | Version | Purpose                               |
| ---------- | ------- | ------------------------------------- |
| React      | 19.2    | UI library with automatic JSX runtime |
| TypeScript | 5.9     | Type-safe JavaScript                  |
| Vite       | 7.2     | Build tool and dev server             |

### State Management & Data Fetching

| Technology     | Version | Purpose                 |
| -------------- | ------- | ----------------------- |
| TanStack Query | 5.90    | Server state management |
| Axios          | 1.13    | HTTP client             |

### UI & Styling

| Technology   | Version | Purpose                        |
| ------------ | ------- | ------------------------------ |
| Tailwind CSS | 4.1     | Utility-first CSS framework    |
| shadcn/ui    | Latest  | Accessible component library   |
| Lucide React | 0.554   | Icon library                   |
| Radix UI     | Latest  | Unstyled accessible primitives |

### Routing & i18n

| Technology    | Version | Purpose                        |
| ------------- | ------- | ------------------------------ |
| Wouter        | 3.7     | Lightweight router             |
| i18next       | 25.6    | Internationalization framework |
| react-i18next | 16.3    | React bindings for i18next     |

### Development Tools

| Technology | Version | Purpose         |
| ---------- | ------- | --------------- |
| ESLint     | 9.39    | Linting         |
| Prettier   | 3.6     | Code formatting |
| Husky      | 9.1     | Git hooks       |
| MSW        | 2.12    | API mocking     |

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- A TMDb API key (get one at [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/tenpo-challenge.git
   cd tenpo-challenge
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your TMDb API key:

   ```env
   VITE_TMDB_API_KEY=your_api_key_here # 7731000248d6df7604f1524f4ad13ac0
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5174`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
tenpo-challenge/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── CardMovie.tsx    # Movie card component
│   │   ├── MovieList.tsx    # Movie list with infinite scroll
│   │   └── ProtectedRoute.tsx
│   ├── pages/               # Page components
│   │   ├── Home.tsx         # Main application page
│   │   └── Login.tsx        # Authentication page
│   ├── services/            # API services
│   │   ├── auth.service.ts
│   │   └── movies.service.ts
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.ts
│   ├── lib/                 # Library configurations
│   │   ├── api.ts           # Axios instances
│   │   ├── queryClient.ts   # TanStack Query config
│   │   └── utils.ts         # Utility functions
│   ├── utils/               # Utility functions
│   │   ├── common.ts
│   │   ├── cookies.ts       # Token management
│   │   ├── date.ts
│   │   └── number.ts
│   ├── i18n/                # Internationalization
│   │   ├── config.ts        # i18next configuration
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en.json      # English translations
│   │       └── es.json      # Spanish translations
│   ├── routes/              # Route definitions
│   │   ├── index.tsx        # Router with lazy-loaded routes
│   │   └── LazyComponent.tsx # Utility for lazy loading with Suspense
│   ├── models/              # TypeScript interfaces
│   │   ├── auth.ts
│   │   ├── common.ts
│   │   └── movies.ts
│   ├── mocks/               # MSW handlers
│   │   ├── handlers/
│   │   │   ├── auth/
│   │   │   └── movies/
│   │   ├── browser.ts
│   │   └── server.ts
│   ├── App.tsx              # Root component
│   └── main.tsx             # Application entry point
├── tests/                   # Test files
│   ├── components/          # Component tests
│   ├── hooks/               # Hook tests
│   ├── pages/               # Page tests
│   ├── services/            # Service tests
│   ├── utils/               # Utility tests
│   ├── setup.ts             # Test setup
│   └── test-utils.tsx       # Testing utilities
├── docs/                    # Additional documentation
│   └── Architecture.md      # Architecture details
├── public/                  # Static assets
├── .env.example             # Environment variables template
├── components.json          # shadcn/ui configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Vitest configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json             # Dependencies and scripts
```

## Available Scripts

| Command                 | Description                            |
| ----------------------- | -------------------------------------- |
| `npm run dev`           | Start development server with HMR      |
| `npm run build`         | Type-check and build for production    |
| `npm run preview`       | Preview production build locally       |
| `npm run lint`          | Run ESLint on all files                |
| `npm run lint:fix`      | Run ESLint and auto-fix issues         |
| `npm run format`        | Format code with Prettier              |
| `npm run format:check`  | Check code formatting                  |
| `npm test`              | Run all tests once                     |
| `npm run test:watch`    | Run tests in watch mode                |
| `npm run test:ui`       | Open Vitest UI for interactive testing |
| `npm run test:coverage` | Run tests with coverage report         |

## Authentication

### Flow

1. User visits the application
2. If not authenticated, redirects to `/login`
3. User enters credentials (email: `leopoldo.henchoz@tenpo.cl`, any password)
4. On successful login:
   - Token is stored in a cookie (7-day expiration)
   - User is redirected to `/` (Home)
5. Protected routes validate token presence
6. Logout clears cookie and redirects to `/login`

### Token Management

Tokens are managed using `js-cookie` with the following strategy:

```typescript
// Set token (7-day expiration)
setToken(token: string): void

// Get token
getToken(): string | undefined

// Remove token
removeToken(): void
```

**Location:** `src/utils/cookies.ts`

## Architecture

### Design Patterns

- **Public/Private Context Architecture**
  - Public routes: `/login`, `/forgot-password` (future)
  - Private routes: `/`, `/profile` (future)
  - Scalable for new modules

- **Axios Configuration**
  - Two instances: `authApi` and `tmdbApi`
  - Automatic token injection via interceptors
  - Centralized error handling
  - Request/response logging in development

- **State Management**
  - TanStack Query for server state
  - React hooks for local state
  - Cookie-based authentication state

- **Component Architecture**
  - Atomic design principles
  - Separation of concerns
  - Reusable shadcn/ui components

For detailed architecture documentation, see [docs/Architecture.md](./docs/Architecture.md).

## Infinite Scroll Implementation

The application uses a **CSS Grid + Intersection Observer** approach instead of virtualization:

**Why this approach?**

- Simpler implementation and maintenance
- Better suited for card-based layouts
- Native browser API (Intersection Observer)
- Excellent performance for <10,000 items
- Responsive grid (2-5 columns based on screen size)

**Key features:**

- TanStack Query handles pagination automatically
- Loads next page when user scrolls near bottom
- Caches loaded pages for instant navigation
- Loading states for initial load and pagination

**Location:** `src/components/MovieList.tsx:36-51`

## Internationalization

The application supports English and Spanish with automatic locale detection:

```typescript
// Supported languages
const supportedLanguages = ["en", "es"];

// Browser locale detection
const browserLocale = navigator.languages[0]; // e.g., "es-ES"
const languageCode = browserLocale.split("-")[0]; // "es"
```

**Translation keys structure:**

```json
{
  "common": { ... },
  "movies": { ... },
  "auth": { ... },
  "errors": { ... }
}
```

**Location:** `src/i18n/`

## Documentation

For more detailed information, check the following documentation:

- [Architecture Guide](./docs/Architecture.md) - Detailed architecture decisions and patterns

## Development Guidelines

### Code Quality

- Follow TypeScript strict mode guidelines
- Use ESLint and Prettier configurations
- Write semantic commit messages (Conventional Commits)
- Test locally before committing (pre-commit hooks enabled)

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Example:**

```
feat(auth): implement logout endpoint integration

Add logout service that calls POST /v1/auth/sign-out
and properly cleans up authentication state.
```

### Adding New Features

1. Create feature branch from `main`
2. Implement changes with tests
3. Run linting and formatting
4. Create pull request with description
5. Wait for code review

## Troubleshooting

### Development server not starting

**Issue:** Port 5174 already in use
**Solution:** Kill the process using port 5174 or change the port in `vite.config.ts`

```bash
lsof -ti:5174 | xargs kill -9
```

### ESLint errors in shadcn/ui components

**Issue:** Fast refresh warnings for exported constants
**Solution:** These are expected and handled with `eslint-disable-next-line` comments

### MSW not intercepting requests

**Issue:** Mock Service Worker not initialized
**Solution:** Ensure `public/mockServiceWorker.js` exists

```bash
npx msw init public/ --save
```

### TMDb API not working

**Issue:** 401 Unauthorized from TMDb API
**Solution:** Check your API key in `.env` file

```env
VITE_TMDB_API_KEY=your_valid_api_key # 7731000248d6df7604f1524f4ad13ac0
```

## License

This project is developed as part of a technical challenge and is not licensed for production use.
