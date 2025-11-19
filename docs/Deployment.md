# Deployment Guide

## Table of Contents

- [Overview](#overview)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Build Process](#build-process)
- [Deployment Platforms](#deployment-platforms)
  - [Vercel](#vercel-recommended)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [AWS S3 + CloudFront](#aws-s3--cloudfront)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)
- [Performance Optimization](#performance-optimization)

## Overview

This guide covers deploying the Tenpo Challenge application to various hosting platforms. The application is a static site built with Vite and can be deployed to any static hosting service.

## Pre-Deployment Checklist

Before deploying, ensure the following:

### Code Quality

- [ ] All tests pass (if implemented)
- [ ] No ESLint errors: `npm run lint`
- [ ] Code is formatted: `npm run format:check`
- [ ] TypeScript compiles without errors: `npx tsc --noEmit`
- [ ] Build succeeds locally: `npm run build`
- [ ] Preview works correctly: `npm run preview`

### Configuration

- [ ] Environment variables are configured
- [ ] `.env.production` file created with production values
- [ ] API keys are restricted to production domains
- [ ] All dependencies are in `package.json`
- [ ] `package-lock.json` is committed

### Security

- [ ] No secrets in source code
- [ ] `.env` files are in `.gitignore`
- [ ] API keys have domain restrictions
- [ ] HTTPS is enforced
- [ ] Security headers are configured (CSP, HSTS, etc.)

### Performance

- [ ] Images are optimized
- [ ] Code splitting is enabled (Vite default)
- [ ] Lazy loading is implemented where appropriate
- [ ] Bundle size is acceptable (check with `npm run build`)

## Build Process

### Local Build

```bash
# Install dependencies
npm install

# Type-check and build
npm run build

# Preview production build
npm run preview
```

### Build Output

After running `npm run build`, Vite generates optimized files in the `dist/` directory:

```
dist/
├── index.html           # Entry HTML file
├── assets/              # Bundled JS, CSS, images
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [images]
└── mockServiceWorker.js # MSW worker (not needed in prod)
```

**Build Statistics Example:**
```
dist/index.html                      0.56 kB │ gzip:  0.35 kB
dist/assets/index-abc123.css        12.34 kB │ gzip:  3.45 kB
dist/assets/index-def456.js        156.78 kB │ gzip: 52.34 kB
```

## Deployment Platforms

### Vercel (Recommended)

**Why Vercel?**
- ✅ Zero configuration for Vite projects
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments on git push
- ✅ Preview deployments for pull requests
- ✅ Environment variable management

#### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Method 2: Vercel Git Integration

1. **Push code to GitHub**
   ```bash
   git remote add origin https://github.com/your-username/tenpo-challenge.git
   git push -u origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite configuration

3. **Configure environment variables**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_TMDB_API_KEY=your_production_api_key
     VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
     ```

4. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically

#### Vercel Configuration File

Create `vercel.json` (optional):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

### Netlify

**Why Netlify?**
- ✅ Simple drag-and-drop deployment
- ✅ Automatic HTTPS
- ✅ Form handling (if needed)
- ✅ Serverless functions support
- ✅ Split testing

#### Method 1: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

#### Method 2: Netlify Git Integration

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect repository in Netlify**
   - Go to [netlify.com](https://www.netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository

3. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variables:
     ```
     VITE_TMDB_API_KEY=your_production_api_key
     ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify builds and deploys automatically

#### Netlify Configuration File

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

### GitHub Pages

**Why GitHub Pages?**
- ✅ Free for public repositories
- ✅ Simple setup
- ✅ Integrated with GitHub
- ❌ Limited to static content
- ❌ No environment variable UI (must use GitHub Secrets)

#### Setup

1. **Install gh-pages package**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update `package.json`**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://your-username.github.io/tenpo-challenge"
   }
   ```

3. **Update `vite.config.ts`**
   ```typescript
   export default defineConfig({
     base: '/tenpo-challenge/', // Your repo name
     plugins: [react()],
   });
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages`
   - Folder: `/root`

#### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        env:
          VITE_TMDB_API_KEY: ${{ secrets.VITE_TMDB_API_KEY }}
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Add GitHub Secret:**
- Go to Settings → Secrets and variables → Actions
- Add secret: `VITE_TMDB_API_KEY`

---

### AWS S3 + CloudFront

**Why AWS?**
- ✅ Highly scalable
- ✅ Full control over infrastructure
- ✅ Integrate with other AWS services
- ❌ More complex setup
- ❌ Requires AWS knowledge

#### Prerequisites

- AWS account
- AWS CLI installed
- S3 bucket created
- CloudFront distribution (optional but recommended)

#### Deployment Steps

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Create S3 bucket**
   ```bash
   aws s3 mb s3://tenpo-challenge-prod
   ```

3. **Configure bucket for static website hosting**
   ```bash
   aws s3 website s3://tenpo-challenge-prod/ \
     --index-document index.html \
     --error-document index.html
   ```

4. **Upload files**
   ```bash
   aws s3 sync dist/ s3://tenpo-challenge-prod/ \
     --delete \
     --cache-control "public, max-age=31536000, immutable" \
     --exclude "index.html" \
     --exclude "mockServiceWorker.js"

   # Upload index.html separately with different cache
   aws s3 cp dist/index.html s3://tenpo-challenge-prod/ \
     --cache-control "public, max-age=0, must-revalidate"
   ```

5. **Set bucket policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::tenpo-challenge-prod/*"
       }
     ]
   }
   ```

6. **Create CloudFront distribution** (optional)
   - Origin: Your S3 bucket
   - Enable HTTPS
   - Set custom error responses (404 → /index.html)

#### Automated Deployment Script

Create `deploy-aws.sh`:

```bash
#!/bin/bash

# Build
npm run build

# Sync to S3
aws s3 sync dist/ s3://tenpo-challenge-prod/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

# Upload index.html with no cache
aws s3 cp dist/index.html s3://tenpo-challenge-prod/ \
  --cache-control "public, max-age=0, must-revalidate"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy-aws.sh
```

Run deployment:
```bash
./deploy-aws.sh
```

---

## Post-Deployment

### Verification Checklist

After deployment, verify the following:

- [ ] Site loads correctly at production URL
- [ ] All pages are accessible (/, /login)
- [ ] Protected routes redirect to /login when not authenticated
- [ ] Login functionality works
- [ ] Movies load from TMDb API
- [ ] Infinite scroll works
- [ ] Logout functionality works
- [ ] Images load correctly
- [ ] i18n works (English and Spanish)
- [ ] Responsive design works on mobile
- [ ] HTTPS is enforced
- [ ] No console errors

### Performance Testing

**Lighthouse Audit:**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-production-url.com \
  --view \
  --preset=desktop
```

**Target Scores:**
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90

### Monitoring

**Recommended Tools:**
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay
- [Google Analytics](https://analytics.google.com) - User analytics
- [Vercel Analytics](https://vercel.com/analytics) - Web vitals

## Troubleshooting

### Problem: 404 on page refresh

**Cause:** Server doesn't know how to handle client-side routes

**Solution:** Configure server to serve `index.html` for all routes

**Vercel/Netlify:** Automatic (no action needed)

**GitHub Pages:** Add `404.html` that's a copy of `index.html`

**Apache:** Add `.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

### Problem: Environment variables not working

**Symptoms:** TMDb API returns 401 errors in production

**Solution:**

1. **Check environment variable name:**
   - Must start with `VITE_`
   - Correct: `VITE_TMDB_API_KEY`
   - Incorrect: `TMDB_API_KEY`

2. **Verify in deployment platform:**
   - Vercel: Settings → Environment Variables
   - Netlify: Site settings → Environment variables
   - GitHub: Secrets → Actions

3. **Rebuild after adding env vars:**
   - Environment variables are baked into build
   - Must rebuild after changing

---

### Problem: Build fails in production

**Common causes:**

1. **TypeScript errors:**
   ```bash
   # Test locally
   npx tsc --noEmit
   ```

2. **ESLint errors:**
   ```bash
   npm run lint
   ```

3. **Missing dependencies:**
   ```bash
   # Ensure all deps are in package.json
   npm install
   ```

4. **Node version mismatch:**
   - Ensure deployment uses Node 18+
   - Set in `package.json`:
     ```json
     {
       "engines": {
         "node": ">=18.0.0"
       }
     }
     ```

---

## Performance Optimization

### Code Splitting

**Already implemented by Vite:**
- Automatic code splitting
- Dynamic imports for routes (if using React.lazy)

**Further optimization:**

```typescript
// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));

<Suspense fallback={<Loading />}>
  <Routes />
</Suspense>
```

### Caching Strategy

**Static assets (JS, CSS, images):**
```
Cache-Control: public, max-age=31536000, immutable
```

**HTML:**
```
Cache-Control: public, max-age=0, must-revalidate
```

### CDN Configuration

**Vercel/Netlify:** Automatic global CDN

**CloudFront:** Configure edge locations near your users

### Compression

**Enable Brotli compression:**
- Vercel/Netlify: Automatic
- Nginx:
  ```nginx
  brotli on;
  brotli_comp_level 6;
  brotli_types text/plain text/css application/json application/javascript;
  ```

### Image Optimization

**Current:** Uses TMDb CDN (already optimized)

**Future enhancement:**
```typescript
// Use next-gen formats
<picture>
  <source srcset="movie.webp" type="image/webp" />
  <img src="movie.jpg" alt="Movie" />
</picture>
```

---

## Rollback Strategy

### Vercel

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Netlify

```bash
# View deployments in Netlify UI
# Click "Publish deploy" on any previous deployment
```

### GitHub Pages

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard abc123
git push origin main --force
```

---

**Last Updated:** 2025-01-19
**Version:** 1.0.0
