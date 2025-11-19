# Environment Variables Documentation

## Table of Contents

- [Overview](#overview)
- [Quick Setup](#quick-setup)
- [Available Variables](#available-variables)
- [Getting a TMDb API Key](#getting-a-tmdb-api-key)
- [Environment-Specific Configuration](#environment-specific-configuration)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

This application uses environment variables to manage configuration across different environments (development, staging, production). All environment variables are prefixed with `VITE_` to be accessible in the browser.

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your TMDb API key:**
   ```bash
   # Edit .env file
   VITE_TMDB_API_KEY=your_actual_api_key_here
   ```

3. **Restart the development server:**
   ```bash
   npm run dev
   ```

## Available Variables

### Required Variables

#### `VITE_TMDB_API_KEY`

**Type:** `string` (required)

**Description:** API key for The Movie Database (TMDb) API. Used to fetch movie data.

**How to get:** See [Getting a TMDb API Key](#getting-a-tmdb-api-key)

**Example:**
```env
VITE_TMDB_API_KEY=abc123def456ghi789jkl012mno345pq
```

**Usage in code:**
```typescript
// src/lib/api.ts
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
```

**Security Note:** 
- This key is **public** and will be exposed in the browser
- Use TMDb's account settings to restrict the key to specific domains
- Never use a production API key in a public repository

---

### Optional Variables

#### `VITE_TMDB_BASE_URL`

**Type:** `string` (optional)

**Default:** `https://api.themoviedb.org/3`

**Description:** Base URL for the TMDb API. Override this only if you're using a proxy or custom TMDb endpoint.

**Example:**
```env
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```

**Usage in code:**
```typescript
// src/lib/api.ts
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
```

**When to override:**
- Using a caching proxy
- Using a custom TMDb API wrapper
- Testing with a mock server

---

## Getting a TMDb API Key

### Step 1: Create a TMDb Account

1. Visit [themoviedb.org](https://www.themoviedb.org/)
2. Click "Sign Up" in the top right
3. Fill in your details and verify your email

### Step 2: Request API Access

1. Log in to your TMDb account
2. Go to **Settings** → **API**
3. Click "Request an API Key"
4. Choose "Developer" (for non-commercial use)

### Step 3: Fill in Application Details

**Required information:**
- **Application Name:** Tenpo Challenge - Movie Database
- **Application URL:** http://localhost:5174 (or your domain)
- **Application Summary:** Movie browsing application built with React and TypeScript

### Step 4: Get Your API Key

Once approved (usually instant), you'll see:

- **API Key (v3 auth)** ← Use this one
- **API Read Access Token (v4 auth)** ← Don't use this

Copy the **API Key (v3 auth)** and paste it into your `.env` file.

### Step 5: Configure Domain Restrictions (Recommended)

1. In TMDb Settings → API
2. Add allowed domains:
   ```
   localhost:5174
   yourdomain.com
   ```

This prevents unauthorized use of your API key.

## Environment-Specific Configuration

### Development (`.env.local`)

```env
# Development environment
VITE_TMDB_API_KEY=dev_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```

**Characteristics:**
- Hot module replacement enabled
- Debug logging enabled
- MSW interceptors active
- Source maps available

### Production (`.env.production`)

```env
# Production environment
VITE_TMDB_API_KEY=prod_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```

**Characteristics:**
- Minified code
- No debug logging
- MSW disabled
- No source maps

### Environment Priority

Vite loads environment variables in this order (last one wins):

1. `.env` - All environments
2. `.env.local` - All environments (local only, ignored by git)
3. `.env.[mode]` - Specific mode (e.g., `.env.production`)
4. `.env.[mode].local` - Specific mode, local only

**Example hierarchy:**
```
.env                    # Base config
.env.local              # Local overrides (git ignored)
.env.production         # Production config
.env.production.local   # Production overrides (git ignored)
```

## Security Best Practices

### Do's ✅

1. **Use `.env.local` for sensitive values**
   ```bash
   # .env.local (git ignored)
   VITE_TMDB_API_KEY=your_real_key
   ```

2. **Commit `.env.example` with placeholder values**
   ```bash
   # .env.example (git tracked)
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```

3. **Restrict API key to specific domains**
   - Go to TMDb Settings → API
   - Add only authorized domains

4. **Use different keys for different environments**
   ```bash
   # Development
   VITE_TMDB_API_KEY=dev_key

   # Production
   VITE_TMDB_API_KEY=prod_key
   ```

5. **Rotate keys regularly**
   - Change keys every 6 months
   - Revoke old keys in TMDb settings

### Don'ts ❌

1. **Never commit `.env` or `.env.local` files**
   ```bash
   # .gitignore (should already contain)
   .env
   .env.local
   .env.*.local
   ```

2. **Never hardcode API keys in source code**
   ```typescript
   // ❌ Bad
   const API_KEY = "abc123def456";

   // ✅ Good
   const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
   ```

3. **Never log environment variables**
   ```typescript
   // ❌ Bad
   console.log(import.meta.env.VITE_TMDB_API_KEY);

   // ✅ Good
   console.log("API key is configured:", !!import.meta.env.VITE_TMDB_API_KEY);
   ```

4. **Never use production keys in development**
   - Keep environments separate
   - Use separate TMDb accounts if needed

## Troubleshooting

### Problem: "Invalid API key" error

**Symptoms:**
```
[TMDb API] Response Error: Invalid API key
```

**Solutions:**

1. **Check if key is set correctly:**
   ```bash
   # View your .env file
   cat .env

   # Should show:
   VITE_TMDB_API_KEY=your_key_here
   ```

2. **Check if key has `VITE_` prefix:**
   ```bash
   # ❌ Wrong
   TMDB_API_KEY=abc123

   # ✅ Correct
   VITE_TMDB_API_KEY=abc123
   ```

3. **Restart development server:**
   ```bash
   # Stop server (Ctrl+C)
   # Start again
   npm run dev
   ```

4. **Verify key in TMDb settings:**
   - Go to themoviedb.org → Settings → API
   - Check if key is active
   - Generate new key if needed

---

### Problem: Environment variables not loading

**Symptoms:**
- `import.meta.env.VITE_TMDB_API_KEY` is `undefined`
- Console shows: `API key is not configured`

**Solutions:**

1. **Check file location:**
   ```bash
   # .env should be in project root
   tenpo-challenge/
   ├── .env              ← Here
   ├── src/
   ├── package.json
   └── vite.config.ts
   ```

2. **Check file naming:**
   ```bash
   # ❌ Wrong
   env.txt
   .env.txt
   env

   # ✅ Correct
   .env
   .env.local
   .env.production
   ```

3. **Restart server after creating `.env`:**
   - Vite only loads environment variables on startup
   - Must restart after creating or modifying `.env`

4. **Check TypeScript types:**
   ```typescript
   // If TypeScript complains, add to vite-env.d.ts:
   interface ImportMetaEnv {
     readonly VITE_TMDB_API_KEY: string
     readonly VITE_TMDB_BASE_URL: string
   }
   ```

---

### Problem: Different behavior in dev vs production

**Symptoms:**
- Works in development (`npm run dev`)
- Fails in production build (`npm run build`)

**Solutions:**

1. **Check production environment file:**
   ```bash
   # Create .env.production if it doesn't exist
   cat > .env.production << EOF
   VITE_TMDB_API_KEY=your_prod_key_here
   EOF
   ```

2. **Verify build includes env variables:**
   ```bash
   npm run build
   npm run preview

   # Check console for:
   # [TMDb API] ...
   ```

3. **Check deployment platform env vars:**
   - Vercel: Settings → Environment Variables
   - Netlify: Site settings → Environment variables
   - GitHub Pages: Repository settings → Secrets

---

### Problem: API rate limiting (429 errors)

**Symptoms:**
```
[TMDb API] Response Error: Rate limit exceeded - too many requests
```

**Solutions:**

1. **Check rate limits:**
   - TMDb free tier: 40 requests per 10 seconds
   - Upgrade to higher tier if needed

2. **Implement request caching:**
   ```typescript
   // Increase staleTime in queryClient config
   staleTime: 10 * 60 * 1000, // 10 minutes (instead of 5)
   ```

3. **Add request debouncing:**
   ```typescript
   // Avoid rapid requests on scroll
   const debouncedFetch = debounce(fetchNextPage, 500);
   ```

4. **Use different API key:**
   - Create separate TMDb account
   - Use different key for development

---

## Environment Variable Checklist

Before deploying to production, verify:

- [ ] `.env.example` is committed to git
- [ ] `.env` and `.env.local` are in `.gitignore`
- [ ] Production API key is different from development
- [ ] API key is restricted to production domains
- [ ] All required variables are set in deployment platform
- [ ] Environment variables are tested in staging
- [ ] Sensitive values are not logged or exposed
- [ ] API keys are rotated regularly (every 6 months)

---

**Last Updated:** 2025-01-19
**Version:** 1.0.0
