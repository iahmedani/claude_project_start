# Full-Stack Development Orchestrator for Claude Code

A comprehensive orchestration system that transforms Claude Code into a **full-stack development team** with specialized agents, automated workflows, and domain-specific skills.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Agents](#agents)
- [Commands](#commands)
- [Skills](#skills)
- [Hooks](#hooks)
- [Use Cases & Examples](#use-cases--examples)
- [Workflows](#workflows)
- [Configuration](#configuration)
- [Best Practices](#best-practices)

---

## Overview

This orchestrator provides:

- **12 Specialized Agents** - Backend, Frontend, DevOps, Security, and more
- **17 Slash Commands** - Standardized workflows for common tasks
- **12 Domain Skills** - Deep knowledge in React, Vue, Docker, GraphQL, etc.
- **6 Automation Hooks** - Quality gates and automated formatting

### Why Use This?

| Without Orchestrator | With Orchestrator       |
| -------------------- | ----------------------- |
| Generic responses    | Role-specific expertise |
| Manual workflows     | Automated pipelines     |
| Context overload     | Efficient delegation    |
| Ad-hoc quality       | Enforced quality gates  |

---

## Quick Start

```bash
# 1. Clone and deploy to your project
git clone <this-repo>
./setup.sh /path/to/your/project

# 2. Navigate to your project
cd /path/to/your/project

# 3. Initialize with Claude Code
claude
> /project-init

# 4. Start building!
> /project-plan "Add user authentication"
```

---

## Installation

### Prerequisites

- Claude Code CLI installed
- Git
- Node.js 18+ (for frontend projects)
- Python 3.11+ (for backend projects)
- Docker (optional, for containerization)

### Deploy to Project

```bash
# Run the setup script
./setup.sh /path/to/your/project

# This copies:
# - .claude/agents/     → Specialized subagents
# - .claude/commands/   → Slash commands
# - .claude/skills/     → Domain knowledge
# - .claude/hooks/      → Automation
# - .claude/settings.json
# - project-config.yaml
# - CLAUDE.md
```

### Verify Installation

```bash
cd /path/to/your/project
claude
> /project-status
```

---

## Project Structure

After installation, your project will have:

```
your-project/
├── .claude/
│   ├── agents/              # 12 specialized subagents
│   │   ├── architect.md           # Backend architecture
│   │   ├── developer.md           # Backend implementation
│   │   ├── frontend-developer.md  # UI/UX implementation
│   │   ├── fullstack-architect.md # System-wide design
│   │   ├── devops-engineer.md     # Infrastructure & CI/CD
│   │   ├── tester.md              # Quality assurance
│   │   ├── reviewer.md            # Code review
│   │   ├── security-auditor.md    # Security analysis
│   │   ├── performance-specialist.md
│   │   ├── project-manager.md     # Planning & requirements
│   │   ├── documenter.md          # Documentation
│   │   └── validation-gates.md    # Quality enforcement
│   │
│   ├── commands/            # 17 slash commands
│   │   ├── project-init.md
│   │   ├── project-plan.md
│   │   ├── project-implement.md
│   │   ├── project-frontend.md
│   │   ├── project-tdd.md
│   │   ├── project-test.md
│   │   ├── project-review.md
│   │   ├── project-refactor.md
│   │   ├── project-docker.md
│   │   ├── project-db.md
│   │   ├── project-env.md
│   │   ├── project-deploy.md
│   │   ├── project-validate.md
│   │   ├── project-fix-issue.md
│   │   ├── project-status.md
│   │   ├── project-explore.md
│   │   └── primer.md
│   │
│   ├── skills/              # 12 domain skills
│   │   ├── react-development.md
│   │   ├── vue-development.md
│   │   ├── state-management.md
│   │   ├── css-styling.md
│   │   ├── api-design.md
│   │   ├── graphql-api.md
│   │   ├── database.md
│   │   ├── python-development.md
│   │   ├── docker-kubernetes.md
│   │   ├── ci-cd.md
│   │   ├── testing-tdd.md
│   │   └── git-workflow.md
│   │
│   ├── hooks/               # 6 automation hooks
│   │   ├── block-dangerous.sh
│   │   ├── validate-planning.sh
│   │   ├── auto-format.sh
│   │   ├── log-tool-usage.sh
│   │   ├── session-tracker.sh
│   │   └── save-context.sh
│   │
│   ├── logs/                # Activity logs (gitignored)
│   └── settings.json        # Tool permissions
│
├── docs/
│   ├── planning/            # PRPs (Product Requirements Prompts)
│   ├── architecture/        # ADRs (Architecture Decision Records)
│   └── progress/            # Progress tracking
│
├── templates/               # Document templates
├── project-config.yaml      # Project configuration
└── CLAUDE.md               # Claude instructions
```

---

## Agents

### Core Development Team

| Agent                 | Role                      | When to Use                    |
| --------------------- | ------------------------- | ------------------------------ |
| `fullstack-architect` | System design, tech stack | Major architectural decisions  |
| `developer`           | Backend implementation    | API endpoints, services, logic |
| `frontend-developer`  | UI implementation         | React/Vue components, pages    |
| `tester`              | Quality assurance         | Writing and running tests      |

### Support Team

| Agent                    | Role                    | When to Use                     |
| ------------------------ | ----------------------- | ------------------------------- |
| `architect`              | Backend-specific design | Service patterns, API design    |
| `reviewer`               | Code review             | Before merging, quality checks  |
| `security-auditor`       | Security analysis       | Authentication, vulnerabilities |
| `performance-specialist` | Optimization            | Bottlenecks, profiling          |
| `devops-engineer`        | Infrastructure          | Docker, K8s, CI/CD              |
| `project-manager`        | Planning                | Requirements, tracking          |
| `documenter`             | Documentation           | README, API docs                |
| `validation-gates`       | Quality gates           | Pre-merge validation            |

### Agent Usage Example

```bash
# Claude automatically delegates to appropriate agents
> "Design a microservices architecture for our e-commerce platform"
# → Delegates to fullstack-architect

> "Implement the user authentication API"
# → Delegates to developer

> "Create a product listing component with filters"
# → Delegates to frontend-developer

> "Review the authentication module for security issues"
# → Delegates to security-auditor
```

---

## Commands

### Project Management

| Command           | Description                  | Example                                          |
| ----------------- | ---------------------------- | ------------------------------------------------ |
| `/project-init`   | Initialize project structure | `/project-init`                                  |
| `/project-plan`   | Create feature plan (PRP)    | `/project-plan "User authentication with OAuth"` |
| `/project-status` | Show progress dashboard      | `/project-status`                                |
| `/primer`         | Deep codebase analysis       | `/primer`                                        |

### Development

| Command              | Description             | Example                                        |
| -------------------- | ----------------------- | ---------------------------------------------- |
| `/project-implement` | Execute from plan       | `/project-implement docs/planning/auth-prp.md` |
| `/project-tdd`       | Test-driven development | `/project-tdd "Add email validation"`          |
| `/project-frontend`  | Frontend workflows      | `/project-frontend component ProductCard`      |
| `/project-refactor`  | Safe refactoring        | `/project-refactor "Extract auth service"`     |

### Infrastructure

| Command           | Description           | Example                 |
| ----------------- | --------------------- | ----------------------- |
| `/project-env`    | Setup dev environment | `/project-env`          |
| `/project-docker` | Container management  | `/project-docker build` |
| `/project-db`     | Database operations   | `/project-db migrate`   |

### Quality & Deployment

| Command              | Description        | Example                     |
| -------------------- | ------------------ | --------------------------- |
| `/project-test`      | Run test suite     | `/project-test`             |
| `/project-review`    | Code review        | `/project-review src/auth/` |
| `/project-validate`  | All quality gates  | `/project-validate`         |
| `/project-deploy`    | Prepare deployment | `/project-deploy`           |
| `/project-fix-issue` | Fix GitHub issue   | `/project-fix-issue 123`    |

---

## Skills

Skills provide deep domain knowledge that agents reference.

### Frontend Skills

| Skill               | Topics Covered                                 |
| ------------------- | ---------------------------------------------- |
| `react-development` | React 18, Next.js 14, Server Components, Hooks |
| `vue-development`   | Vue 3, Composition API, Pinia, Nuxt 3          |
| `state-management`  | Zustand, React Query, Pinia, TanStack          |
| `css-styling`       | Tailwind CSS, CSS Variables, Animations        |

### Backend Skills

| Skill                | Topics Covered                               |
| -------------------- | -------------------------------------------- |
| `api-design`         | REST conventions, validation, error handling |
| `graphql-api`        | Schema design, resolvers, Apollo             |
| `database`           | SQLAlchemy, Prisma, migrations, queries      |
| `python-development` | FastAPI, async patterns, type hints          |

### DevOps Skills

| Skill               | Topics Covered                          |
| ------------------- | --------------------------------------- |
| `docker-kubernetes` | Multi-stage builds, K8s manifests, Helm |
| `ci-cd`             | GitHub Actions, GitLab CI, Terraform    |
| `git-workflow`      | Branching, commits, PR workflow         |
| `testing-tdd`       | pytest, Jest, TDD methodology           |

### Skill Cross-References

Skills are interconnected for efficient context usage:

```
react-development ←→ state-management ←→ vue-development
        ↓                   ↓                  ↓
   css-styling         api-design         css-styling
        ↓                   ↓
   testing-tdd ←→ ci-cd ←→ docker-kubernetes
```

---

## Hooks

Hooks automate quality enforcement and logging.

| Hook                   | Trigger     | Purpose                          |
| ---------------------- | ----------- | -------------------------------- |
| `block-dangerous.sh`   | PreToolUse  | Block risky shell commands       |
| `validate-planning.sh` | PreToolUse  | Ensure plans exist before coding |
| `auto-format.sh`       | PostToolUse | Format code after edits          |
| `log-tool-usage.sh`    | PostToolUse | Audit trail of actions           |
| `session-tracker.sh`   | Stop        | Track session activity           |
| `save-context.sh`      | PreCompact  | Preserve context snapshots       |

---

## Use Cases & Examples

### Use Case 1: Building a New Feature

**Scenario**: Add user authentication with JWT tokens

```bash
# Step 1: Plan the feature
> /project-plan "User authentication with JWT"

# Claude creates: docs/planning/user-auth-prp.md
# Contains: Requirements, API design, component specs, test cases

# Step 2: Implement with TDD
> /project-implement docs/planning/user-auth-prp.md

# Claude:
# - Writes tests first (tester agent)
# - Implements backend API (developer agent)
# - Creates login/register components (frontend-developer agent)
# - Runs validation gates

# Step 3: Review and deploy
> /project-validate
> /project-deploy
```

### Use Case 2: Frontend Component Development

**Scenario**: Create a reusable data table component

```bash
# Create a new component
> /project-frontend component DataTable

# Claude (frontend-developer agent):
# - Creates src/components/DataTable/
# - Adds DataTable.tsx with TypeScript
# - Adds DataTable.test.tsx with tests
# - Adds DataTable.stories.tsx for Storybook
# - Uses react-development and css-styling skills

# Add features iteratively
> "Add sorting functionality to DataTable"
> "Add pagination with page size selector"
> "Make it accessible with ARIA attributes"
```

### Use Case 3: API Development

**Scenario**: Build a REST API for product management

```bash
# Plan the API
> /project-plan "Product management CRUD API"

# Implement with TDD
> /project-tdd "Create product endpoints"

# Claude (developer agent with api-design skill):
# - Creates product routes
# - Implements validation schemas
# - Adds database models (database skill)
# - Writes comprehensive tests

# Example output structure:
# src/
# ├── routes/products.py
# ├── models/product.py
# ├── schemas/product.py
# └── tests/test_products.py
```

### Use Case 4: Database Migration

**Scenario**: Add new fields to user table

```bash
# Create and run migration
> /project-db migrate "Add profile fields to users"

# Claude (developer agent with database skill):
# - Creates migration file
# - Adds: bio, avatar_url, social_links
# - Updates ORM model
# - Runs migration safely

# Seed with test data
> /project-db seed users

# Backup before production changes
> /project-db backup
```

### Use Case 5: Dockerizing an Application

**Scenario**: Containerize a Next.js + FastAPI app

```bash
# Generate Docker configuration
> /project-docker init

# Claude (devops-engineer agent):
# - Creates optimized Dockerfile for frontend
# - Creates Dockerfile for backend
# - Generates docker-compose.yml
# - Adds .dockerignore files

# Build and run
> /project-docker build
> /project-docker up

# Example docker-compose.yml:
# services:
#   frontend:
#     build: ./frontend
#     ports: ["3000:3000"]
#   backend:
#     build: ./backend
#     ports: ["8000:8000"]
#   db:
#     image: postgres:15
```

### Use Case 6: Setting Up CI/CD

**Scenario**: Create GitHub Actions pipeline

```bash
# Initialize CI/CD
> "Set up GitHub Actions for our Node.js project"

# Claude (devops-engineer agent with ci-cd skill):
# Creates .github/workflows/ci.yml with:
# - Lint and type check
# - Run tests with coverage
# - Build application
# - Deploy to staging on PR
# - Deploy to production on main

# Example workflow stages:
# test → build → deploy-staging → deploy-production
```

### Use Case 7: Security Audit

**Scenario**: Review authentication module for vulnerabilities

```bash
# Run security review
> /project-review src/auth/ --security

# Claude (security-auditor agent):
# Checks for:
# - SQL injection vulnerabilities
# - XSS attack vectors
# - Insecure token handling
# - Missing rate limiting
# - Exposed secrets

# Output: Security report with findings and fixes
```

### Use Case 8: Performance Optimization

**Scenario**: Improve slow API endpoints

```bash
# Analyze performance
> "Analyze and optimize the /api/products endpoint"

# Claude (performance-specialist agent):
# - Profiles current performance
# - Identifies N+1 queries
# - Suggests database indexing
# - Implements caching strategy
# - Adds pagination

# Before: 2.5s response time
# After: 150ms response time
```

### Use Case 9: Refactoring Legacy Code

**Scenario**: Extract service from monolithic controller

```bash
# Plan refactoring
> /project-refactor "Extract OrderService from OrderController"

# Claude:
# 1. Writes characterization tests (tester agent)
# 2. Extracts service class (developer agent)
# 3. Updates controller to use service
# 4. Runs tests to verify behavior preserved
# 5. Reviews changes (reviewer agent)
```

### Use Case 10: Full-Stack Feature

**Scenario**: Build a complete comments system

```bash
# Step 1: Architecture
> "Design a real-time comments system with replies"

# Claude (fullstack-architect agent):
# - Creates ADR for WebSocket vs polling
# - Designs database schema
# - Plans API endpoints
# - Sketches component hierarchy

# Step 2: Implementation
> /project-plan "Comments system with real-time updates"
> /project-implement docs/planning/comments-prp.md

# Result:
# Backend:
#   - Comment model with nested replies
#   - WebSocket handler for real-time
#   - REST API for CRUD operations
#
# Frontend:
#   - CommentList component
#   - CommentForm with optimistic updates
#   - ReplyThread with infinite nesting
#   - Real-time subscription hook
```

---

## Workflows

### Development Lifecycle

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   DISCOVER  │────▶│    PLAN     │────▶│   DESIGN    │
│   /primer   │     │/project-plan│     │  architect  │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   DEPLOY    │◀────│   REVIEW    │◀────│  IMPLEMENT  │
│/project-    │     │/project-    │     │/project-    │
│   deploy    │     │   review    │     │  implement  │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                   ▲                   │
       │                   │                   ▼
       │            ┌─────────────┐     ┌─────────────┐
       │            │  VALIDATE   │◀────│    TEST     │
       └────────────│/project-    │     │/project-tdd │
                    │  validate   │     │/project-test│
                    └─────────────┘     └─────────────┘
```

### TDD Workflow

```bash
# 1. Write failing test
> /project-tdd "Add password strength validation"

# Claude writes test:
# def test_password_strength():
#     assert is_strong("weak") == False
#     assert is_strong("Str0ng!Pass") == True

# 2. Run test (RED)
# FAILED: NameError: is_strong not defined

# 3. Implement minimal code (GREEN)
# def is_strong(password): ...

# 4. Refactor while tests pass
# Extract regex patterns, add more cases

# 5. Validate
> /project-validate
```

### Code Review Workflow

```bash
# Before PR
> /project-review

# Claude runs:
# 1. reviewer agent - Code quality, patterns
# 2. security-auditor agent - Vulnerabilities
# 3. validation-gates agent - All checks pass

# Output:
# ✓ Code follows project patterns
# ✓ No security issues found
# ✓ Tests passing (98% coverage)
# ✓ Types valid
# ✓ Linting clean
```

---

## Configuration

### project-config.yaml

```yaml
project:
  name: "my-awesome-app"
  type: "fullstack"

stack:
  frontend:
    framework: "next" # next, react, vue, nuxt, svelte
    styling: "tailwind" # tailwind, css-modules, styled-components
    state: "zustand" # zustand, redux, pinia, jotai

  backend:
    framework: "fastapi" # fastapi, express, nestjs, django
    language: "python" # python, typescript, go
    api_style: "rest" # rest, graphql, trpc

  database:
    primary: "postgresql" # postgresql, mysql, mongodb
    orm: "sqlalchemy" # sqlalchemy, prisma, drizzle

  infrastructure:
    containerization: "docker"
    orchestration: "kubernetes" # kubernetes, docker-compose
    ci_cd: "github-actions" # github-actions, gitlab-ci

quality:
  testing:
    framework: "pytest" # pytest, jest, vitest
    coverage_threshold: 80

  linting:
    enabled: true
    tools: ["ruff", "eslint"]

  type_checking:
    enabled: true
    strict: true

gates:
  required:
    - "lint"
    - "type-check"
    - "test"
    - "build"
  recommended:
    - "security-scan"
    - "coverage-check"
```

---

## Best Practices

### 1. Always Plan First

```bash
# Good: Plan before implementing
> /project-plan "Add shopping cart feature"
> /project-implement docs/planning/cart-prp.md

# Avoid: Jumping straight to code
> "Add shopping cart"  # No plan = potential rework
```

### 2. Use TDD for Critical Features

```bash
# Good: Test-driven approach
> /project-tdd "Payment processing"

# This ensures:
# - Clear requirements (tests define behavior)
# - Safety net for refactoring
# - Documentation through tests
```

### 3. Validate Before Merging

```bash
# Always run before PR
> /project-validate

# Checks:
# ✓ Types valid
# ✓ Linting clean
# ✓ Tests passing
# ✓ Coverage met
# ✓ Build successful
```

### 4. Keep Context Clean

```bash
# Use /clear between major tasks
> /project-plan "Feature A"
> /project-implement ...
> /clear  # Clean context

> /project-plan "Feature B"
```

### 5. Leverage Subagents

```bash
# Let specialized agents handle their domains
> "Review this for security issues"
# → security-auditor handles it

> "Optimize database queries"
# → performance-specialist handles it

# Don't try to do everything in one prompt
```

### 6. Iterate Incrementally

```bash
# Good: Small, validated steps
> "Add user model"
> /project-test
> "Add user API endpoints"
> /project-test
> "Add user registration form"
> /project-test

# Avoid: Big bang implementation
> "Build complete user management system"  # Too much at once
```

---

## Troubleshooting

### Common Issues

**Commands not found**

```bash
# Ensure .claude/ directory exists
ls -la .claude/commands/

# Re-run setup if missing
./setup.sh .
```

**Hooks not executing**

```bash
# Check hook permissions
chmod +x .claude/hooks/*.sh

# Verify settings.json
cat .claude/settings.json
```

**Agent not responding correctly**

```bash
# Check agent file exists
cat .claude/agents/developer.md

# Try explicit delegation
> "Use the developer agent to implement this API"
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `/project-validate`
5. Submit a pull request

---

## License

MIT License - See LICENSE file for details.

---

## Resources

- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Best Practices Guide](https://www.anthropic.com/engineering/claude-code-best-practices)
- [MCP Integration](https://docs.anthropic.com/en/docs/claude-code/mcp)

---

_Built with Claude Code Orchestrator - Your AI-powered full-stack development team._
