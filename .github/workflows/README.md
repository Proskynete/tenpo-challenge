# GitHub Actions Workflows

This directory contains GitHub Actions workflow configurations for continuous integration and quality assurance.

## Available Workflows

### 🔄 CI (Main Pipeline)
**File:** `ci.yml`

Comprehensive CI pipeline that runs on every push and pull request to `main` and `develop` branches.

**Jobs:**
1. **Lint & Format** - Code quality checks
   - ESLint validation
   - Prettier format check
   - TypeScript type checking

2. **Test** - Test suite execution
   - Runs on Node.js 22.x and 24.x
   - Executes all tests with coverage
   - Uploads coverage to Codecov (Node 24.x only)

3. **Build** - Production build
   - Builds the project for production
   - Archives build artifacts (7-day retention)

**Dependencies:** Lint → Test → Build

---

### ✅ Test
**File:** `test.yml`

Standalone test workflow for running the test suite.

**Features:**
- Matrix testing on Node.js 22.x and 24.x
- Coverage report generation
- Codecov integration
- Archives coverage reports (30-day retention)

**Triggers:**
- Push to `main`, `develop`
- Pull requests to `main`, `develop`

---

### 🔍 Lint
**File:** `lint.yml`

Code quality and formatting checks.

**Checks:**
- ESLint validation
- Prettier format verification
- TypeScript type checking

**Node Version:** 24.x

**Triggers:**
- Push to `main`, `develop`
- Pull requests to `main`, `develop`

---

### 🏗️ Build
**File:** `build.yml`

Production build verification.

**Features:**
- Builds project for production
- Archives dist/ directory (7-day retention)

**Node Version:** 24.x

**Triggers:**
- Push to `main`, `develop`
- Pull requests to `main`, `develop`

---

## Usage

### Running Locally

All workflow jobs can be run locally using the npm scripts:

```bash
# Lint
npm run lint
npm run format:check

# Test
npm test
npm run test:coverage

# Build
npm run build

# Type check
npx tsc --noEmit
```

### Codecov Integration

To enable Codecov integration:

1. Sign up at [codecov.io](https://codecov.io)
2. Add your repository
3. Get your Codecov token
4. Add it as a repository secret: `CODECOV_TOKEN`

### Workflow Status Badges

Add these badges to your README.md:

```markdown
![CI](https://github.com/username/repo/workflows/CI/badge.svg)
![Test](https://github.com/username/repo/workflows/Test/badge.svg)
![Lint](https://github.com/username/repo/workflows/Lint/badge.svg)
![Build](https://github.com/username/repo/workflows/Build/badge.svg)
```

---

## Best Practices

1. **CI Workflow** - Use this as the primary quality gate for pull requests
2. **Individual Workflows** - Use for specific checks during development
3. **Branch Protection** - Require CI workflow to pass before merging
4. **Artifacts** - Build artifacts are retained for 7 days, coverage for 30 days

## Node.js Version Strategy

- **CI Workflow:** Tests on Node 22.x and 24.x (latest versions)
- **Test Workflow:** Tests on Node 22.x and 24.x (latest versions)
- **Lint/Build:** Uses Node 24.x (latest stable)

This ensures compatibility with the latest Node.js versions and modern JavaScript features.
