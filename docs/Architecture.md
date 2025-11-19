# Architecture Documentation

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Public/Private Context Design](#publicprivate-context-design)
- [Data Flow](#data-flow)
- [Authentication Strategy](#authentication-strategy)
- [API Layer Architecture](#api-layer-architecture)
- [State Management](#state-management)
- [Component Architecture](#component-architecture)
- [Scalability Considerations](#scalability-considerations)

## Overview

This application follows a **modular, scalable architecture** designed to support both public (unauthenticated) and private (authenticated) contexts. The architecture is built on modern React patterns with a focus on maintainability, type safety, and performance.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               React Application                      │  │
│  │                                                      │  │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │  │
│  │  │   Pages    │  │ Components │  │    Hooks     │  │  │
│  │  │            │  │            │  │              │  │  │
│  │  │ Login      │  │ MovieList  │  │  useAuth     │  │  │
│  │  │ Home       │  │ CardMovie  │  │              │  │  │
│  │  └────────────┘  └────────────┘  └──────────────┘  │  │
│  │         │                │                │         │  │
│  │         └────────────────┴────────────────┘         │  │
│  │                        │                            │  │
│  │                        ▼                            │  │
│  │              ┌──────────────────┐                   │  │
│  │              │    Services      │                   │  │
│  │              │                  │                   │  │
│  │              │ auth.service     │                   │  │
│  │              │ movies.service   │                   │  │
│  │              └──────────────────┘                   │  │
│  │                        │                            │  │
│  │                        ▼                            │  │
│  │              ┌──────────────────┐                   │  │
│  │              │   Axios Layer    │                   │  │
│  │              │                  │                   │  │
│  │              │  authApi  │ tmdbApi                  │  │
│  │              └──────────────────┘                   │  │
│  │                   │         │                       │  │
│  └───────────────────┼─────────┼───────────────────────┘  │
│                      │         │                          │
└──────────────────────┼─────────┼──────────────────────────┘
                       │         │
                       ▼         ▼
              ┌─────────┐   ┌──────────┐
              │   MSW   │   │  TMDb    │
              │   Mock  │   │   API    │
              │   API   │   │ (Real)   │
              └─────────┘   └──────────┘
```

## Public/Private Context Design

### Design Philosophy

The application is architected to support two distinct contexts:

1. **Public Context** - Unauthenticated users
2. **Private Context** - Authenticated users

This design enables easy scaling with new modules while maintaining security and separation of concerns.

### Implementation

**Route Structure (`src/routes/index.tsx`):**

```typescript
<Switch>
  {/* Public Routes */}
  <Route path="/login" component={Login} />
  
  {/* Private Routes */}
  <Route path="/">
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  </Route>
  
  {/* Fallback */}
  <Route>
    <Redirect to="/login" />
  </Route>
</Switch>
```

**Protected Route Component (`src/components/ProtectedRoute.tsx`):**

```typescript
export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const isAuthenticated = !!getToken();
  if (!isAuthenticated) return <Redirect to="/login" />;
  return <>{children}</>;
};
```

### Scalability Examples

**Adding a new public module (e.g., Forgot Password):**

```typescript
// No authentication required
<Route path="/forgot-password" component={ForgotPassword} />
<Route path="/reset-password/:token" component={ResetPassword} />
```

**Adding a new private module (e.g., User Profile):**

```typescript
// Requires authentication
<Route path="/profile">
  <ProtectedRoute>
    <UserProfile />
  </ProtectedRoute>
</Route>

<Route path="/settings">
  <ProtectedRoute>
    <Settings />
  </ProtectedRoute>
</Route>
```

**Future Enhancement: Role-Based Access Control:**

```typescript
<Route path="/admin">
  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
    <AdminDashboard />
  </ProtectedRoute>
</Route>
```

## Data Flow

### Authentication Flow

```
User enters credentials
       │
       ▼
useAuth hook (useMutation)
       │
       ▼
authService.login()
       │
       ▼
authApi.post('/sign-in') ─────► MSW intercepts ─────► Mock response
       │
       ▼
Token received
       │
       ├─► setToken() ─────► Cookie storage
       │
       ├─► setIsAuthenticated(true) ─────► Local state
       │
       └─► Redirect to "/"
```

### Movie Data Flow

```
Component mounts
       │
       ▼
useInfiniteQuery
       │
       ▼
moviesService.getPopularMovies(page)
       │
       ▼
tmdbApi.get('/movie/popular')
       │
       ├─► Interceptor adds api_key & language
       │
       ▼
TMDb API (real external API)
       │
       ▼
Response received
       │
       ├─► TanStack Query caches data
       │
       └─► Component re-renders with data
       
User scrolls to bottom
       │
       ▼
Intersection Observer triggers
       │
       ▼
fetchNextPage() called
       │
       └─► Repeat flow with page + 1
```

## Authentication Strategy

### Token Persistence

**Library:** `js-cookie` v3.0.5

**Strategy:** Cookie-based storage with 7-day expiration

**Location:** `src/utils/cookies.ts`

**API:**

```typescript
// Set token (7-day expiration)
export const setToken = (token: string): void => {
  Cookies.set(TOKEN_NAME, token, { expires: 7 });
};

// Get token
export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_NAME);
};

// Remove token
export const removeToken = (): void => {
  Cookies.remove(TOKEN_NAME);
};
```

### Why Cookies Over Other Storage?

| Storage Type | Pros | Cons | Our Choice |
|--------------|------|------|------------|
| **Cookies** | ✅ Persistent<br>✅ Auto-expiration<br>✅ SSR compatible<br>✅ Can be HTTP-only | ⚠️ Size limit (4KB) | ✅ **Selected** |
| localStorage | ✅ Large storage<br>✅ Simple API | ❌ Vulnerable to XSS<br>❌ No auto-expiration<br>❌ Not SSR compatible | ❌ |
| sessionStorage | ✅ Auto-clear on tab close | ❌ Lost on reload<br>❌ Not SSR compatible | ❌ |
| Memory only | ✅ Most secure | ❌ Lost on reload<br>❌ Complex implementation | ❌ |

### Logout Strategy

**Flow:**

```typescript
// 1. User clicks logout button
const handleLogout = async () => {
  await logout();          // Hook function
  setLocation("/login");   // Manual redirect
};

// 2. useAuth logout implementation
const logout = useCallback(async () => {
  await authService.logout();  // Notify backend
  removeToken();               // Clear cookie
  setIsAuthenticated(false);   // Update local state
}, []);
```

**Why this approach?**

1. **Backend notification** - Allows server-side token blacklisting
2. **Complete cleanup** - Cookie removed, state updated
3. **Scalable** - Easy to add additional cleanup (Redux, WebSocket, etc.)

## API Layer Architecture

### Dual Axios Instance Strategy

**Location:** `src/lib/api.ts`

We use **two separate axios instances** to handle different API concerns:

#### 1. Auth API Instance (`authApi`)

**Purpose:** Internal authentication endpoints (MSW mocked)

```typescript
export const authApi = axios.create({
  baseURL: "/v1/auth",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Request Interceptor - Inject token
authApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Features:**
- ✅ Automatic token injection
- ✅ Development logging
- ✅ Error handling by status code (401, 403, 404, 500)

#### 2. TMDb API Instance (`tmdbApi`)

**Purpose:** The Movie Database API (external, real)

```typescript
export const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 30000,
  params: {
    api_key: TMDB_API_KEY,      // Auto-injected
    language: getLocale(),       // User's locale
  },
});
```

**Features:**
- ✅ Automatic API key injection
- ✅ Automatic language parameter
- ✅ TMDb-specific error handling (429 rate limiting)

### Why Two Instances?

| Concern | Auth API | TMDb API |
|---------|----------|----------|
| Base URL | `/v1/auth` | `https://api.themoviedb.org/3` |
| Authentication | Bearer token | API key in params |
| Mock/Real | Mocked (MSW) | Real API |
| Rate Limiting | N/A | 429 handling |
| Token Injection | ✅ Yes | ❌ No |
| API Key Injection | ❌ No | ✅ Yes |

### Interceptor Flow

**Request Interceptor:**
```
User makes request
       │
       ▼
Interceptor runs
       │
       ├─► Add Authorization header (authApi)
       ├─► Add api_key param (tmdbApi)
       ├─► Add language param (tmdbApi)
       │
       ▼
Log request in dev mode
       │
       ▼
Send to server
```

**Response Interceptor:**
```
Response received
       │
       ▼
Interceptor runs
       │
       ├─► Log response in dev mode
       │
       ▼
Check status code
       │
       ├─► 401: Unauthorized
       ├─► 403: Forbidden
       ├─► 404: Not Found
       ├─► 429: Rate Limited (TMDb)
       └─► 500: Server Error
       │
       ▼
Handle error or pass data
```

## State Management

### Strategy: Hybrid Approach

We use a **combination of state management solutions** based on the type of state:

| State Type | Solution | Example |
|------------|----------|---------|
| **Server State** | TanStack Query | Movies list, user profile |
| **Authentication State** | React hooks + Cookies | Login status, token |
| **Local UI State** | React useState | Form inputs, modals |
| **URL State** | Wouter | Current route, query params |

### TanStack Query Configuration

**Location:** `src/lib/queryClient.ts`

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 minutes
      gcTime: 10 * 60 * 1000,         // 10 minutes
      retry: 1,                        // Retry failed requests once
      refetchOnWindowFocus: false,     // Don't refetch on tab focus
    },
  },
});
```

**Why TanStack Query?**

- ✅ Automatic caching
- ✅ Background refetching
- ✅ Infinite scroll support
- ✅ Loading and error states
- ✅ Request deduplication
- ✅ Optimistic updates

### Infinite Query Example

```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ["movies", "popular"],
  queryFn: ({ pageParam = 1 }) => moviesService.getPopularMovies(pageParam),
  getNextPageParam: (lastPage) => {
    if (lastPage.page < lastPage.total_pages) {
      return lastPage.page + 1;
    }
    return undefined;
  },
  initialPageParam: 1,
});
```

## Component Architecture

### Design Principles

1. **Atomic Design** - Build from small, reusable components
2. **Separation of Concerns** - UI vs Logic vs Data
3. **Single Responsibility** - Each component does one thing well
4. **Composition over Inheritance** - Combine simple components

### Component Hierarchy

```
App
  │
  ├─ Router
  │    │
  │    ├─ Login (Public)
  │    │    │
  │    │    ├─ Input (shadcn)
  │    │    ├─ Label (shadcn)
  │    │    ├─ Button (shadcn)
  │    │    └─ Alert (shadcn)
  │    │
  │    └─ ProtectedRoute
  │         │
  │         └─ Home (Private)
  │              │
  │              ├─ Header
  │              │    └─ Button (Logout)
  │              │
  │              └─ MovieList
  │                   │
  │                   └─ CardMovie (repeated)
  │                        │
  │                        ├─ Card (shadcn)
  │                        ├─ Badge (shadcn)
  │                        └─ Image
```

### Component Categories

**1. Page Components** (`src/pages/`)
- Top-level route components
- Handle page-level logic
- Examples: `Login.tsx`, `Home.tsx`

**2. Feature Components** (`src/components/`)
- Complex, feature-specific components
- Examples: `MovieList.tsx`, `CardMovie.tsx`

**3. Layout Components** (`src/components/`)
- Control access and routing
- Example: `ProtectedRoute.tsx`

**4. UI Components** (`src/components/ui/`)
- shadcn/ui primitives
- Reusable, accessible, styled
- Examples: `Button.tsx`, `Card.tsx`, `Input.tsx`

### Custom Hooks

**Location:** `src/hooks/`

**Example: `useAuth.ts`**

```typescript
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (data.success && data.data?.token) {
        setToken(data.data.token);
        setIsAuthenticated(true);
      }
    },
  });

  const logout = useCallback(async () => {
    await authService.logout();
    removeToken();
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
};
```

**Benefits:**
- ✅ Encapsulates authentication logic
- ✅ Reusable across components
- ✅ Single source of truth
- ✅ Easy to test

## Scalability Considerations

### Current Architecture Supports

1. **New Routes**
   - Add public routes without protection
   - Add private routes with `<ProtectedRoute>`
   - Add role-based routes with enhanced `<ProtectedRoute>`

2. **New API Services**
   - Create new axios instance if needed
   - Reuse existing instances for similar APIs
   - Add interceptors for specific needs

3. **New State**
   - Server state: Add TanStack Query hooks
   - Global state: Add Zustand/Redux if needed
   - URL state: Use Wouter search params

4. **New Features**
   - i18n: Add translation keys to `locales/`
   - Components: Add to `components/` folder
   - Types: Add to `models/` folder

### Future Enhancements

**Short-term (1-3 months):**
- [ ] Add React Query Devtools
- [ ] Implement error boundaries
- [ ] Add loading skeletons
- [ ] Implement optimistic updates

**Mid-term (3-6 months):**
- [ ] Add E2E testing (Playwright)
- [ ] Implement feature flags
- [ ] Add analytics integration
- [ ] Implement PWA features

**Long-term (6-12 months):**
- [ ] Server-side rendering (Next.js migration)
- [ ] Micro-frontend architecture
- [ ] GraphQL integration
- [ ] Real-time features (WebSocket)

### Performance Optimizations

**Implemented:**
- ✅ Code splitting (Vite automatic)
- ✅ Lazy image loading
- ✅ TanStack Query caching
- ✅ Intersection Observer for infinite scroll

**Future:**
- [ ] Route-based code splitting
- [ ] Component lazy loading
- [ ] Service Worker caching
- [ ] Image optimization (WebP)

---

**Last Updated:** 2025-01-19
**Version:** 1.0.0
