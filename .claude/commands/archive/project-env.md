---
name: project-env
description: "Set up development environment with proper configuration. Handles dependencies, environment variables, and local services."
tools: Read, Write, Edit, Bash(npm:*), Bash(yarn:*), Bash(pnpm:*), Bash(pip:*), Bash(python:*), Bash(docker-compose:*), Bash(cp:*), Bash(mkdir:*)
---

# Development Environment Setup

Set up and configure the development environment for this project.

**Arguments:** $ARGUMENTS

## Step 1: Detect Project Type

Analyze the project to determine the tech stack:

```bash
# Check for project files
ls -la package.json pyproject.toml requirements.txt go.mod Cargo.toml Gemfile 2>/dev/null
```

### Detection Rules:
- `package.json` → Node.js project
- `pyproject.toml` or `requirements.txt` → Python project
- `go.mod` → Go project
- `Cargo.toml` → Rust project

## Step 2: Environment Variables

### 2.1 Check for existing .env
```bash
ls -la .env .env.example .env.local .env.development 2>/dev/null
```

### 2.2 Create .env from template if missing
If `.env.example` exists but `.env` doesn't:
```bash
cp .env.example .env
echo "Created .env from .env.example - please update with your values"
```

### 2.3 Required Environment Variables
For a typical full-stack project, ensure these are set:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app_dev

# Redis (if applicable)
REDIS_URL=redis://localhost:6379

# Authentication (if applicable)
JWT_SECRET=your-development-secret-change-in-production
SESSION_SECRET=another-development-secret

# External Services (if applicable)
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# STRIPE_SECRET_KEY=
```

## Step 3: Install Dependencies

### Node.js Projects
```bash
# Detect package manager
if [ -f "pnpm-lock.yaml" ]; then
  pnpm install
elif [ -f "yarn.lock" ]; then
  yarn install
else
  npm install
fi
```

### Python Projects
```bash
# Check for virtual environment
if [ ! -d ".venv" ]; then
  python -m venv .venv
fi

# Activate and install
source .venv/bin/activate
if [ -f "pyproject.toml" ]; then
  pip install -e ".[dev]"
elif [ -f "requirements-dev.txt" ]; then
  pip install -r requirements-dev.txt
elif [ -f "requirements.txt" ]; then
  pip install -r requirements.txt
fi
```

## Step 4: Database Setup

### Check for Docker Compose
```bash
if [ -f "docker-compose.yml" ] || [ -f "docker-compose.yaml" ]; then
  docker-compose up -d db redis 2>/dev/null || echo "Docker services not configured"
fi
```

### Run Migrations (if applicable)
```bash
# Node.js (Prisma)
npx prisma migrate dev 2>/dev/null || true

# Node.js (TypeORM)
npm run migration:run 2>/dev/null || true

# Python (Alembic)
alembic upgrade head 2>/dev/null || true

# Python (Django)
python manage.py migrate 2>/dev/null || true
```

### Seed Database (if applicable)
```bash
# Check for seed script
npm run seed 2>/dev/null || npm run db:seed 2>/dev/null || true
```

## Step 5: Generate Types/Clients (if applicable)

### Prisma Client
```bash
npx prisma generate 2>/dev/null || true
```

### GraphQL Codegen
```bash
npm run codegen 2>/dev/null || npm run generate 2>/dev/null || true
```

### OpenAPI Client
```bash
npm run generate:api 2>/dev/null || true
```

## Step 6: Verify Setup

### Run Health Checks
```bash
# Check if dev server can start (dry run)
npm run build 2>/dev/null && echo "✓ Build successful" || echo "⚠ Build check failed"

# Run type checking
npm run type-check 2>/dev/null || npx tsc --noEmit 2>/dev/null || true

# Run linting
npm run lint 2>/dev/null || true
```

## Step 7: Pre-commit Hooks (if applicable)

```bash
# Husky (Node.js)
npx husky install 2>/dev/null || true

# Pre-commit (Python)
pre-commit install 2>/dev/null || true
```

## Output Format

After completion, display:

```
╔══════════════════════════════════════════════════════════════╗
║  ✅ ENVIRONMENT SETUP COMPLETE                               ║
╠══════════════════════════════════════════════════════════════╣
║  Project Type: [Node.js / Python / etc.]                     ║
║  Package Manager: [npm / yarn / pnpm / pip]                  ║
╠══════════════════════════════════════════════════════════════╣
║  COMPLETED STEPS                                             ║
║  ✓ Environment variables configured                          ║
║  ✓ Dependencies installed                                    ║
║  ✓ Database migrations applied                               ║
║  ✓ Type generation completed                                 ║
║  ✓ Pre-commit hooks installed                                ║
╠══════════════════════════════════════════════════════════════╣
║  MANUAL STEPS REQUIRED                                       ║
║  • Update .env with your specific values                     ║
║  • Configure external service credentials                    ║
╠══════════════════════════════════════════════════════════════╣
║  START DEVELOPMENT                                           ║
║  $ npm run dev                                               ║
║  $ npm run test:watch                                        ║
╚══════════════════════════════════════════════════════════════╝
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   lsof -i :3000  # Find process
   kill -9 <PID>  # Kill if needed
   ```

2. **Database connection failed**
   - Check if Docker is running
   - Verify DATABASE_URL in .env
   - Ensure database container is healthy

3. **Node modules issues**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Python virtual environment issues**
   ```bash
   rm -rf .venv
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
