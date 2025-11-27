# Full-Stack Development Orchestrator for Claude Code

A comprehensive orchestration system that transforms Claude Code into a **full-stack development team** with specialized agents, automated workflows, domain-specific skills, and **RAG-powered intelligent context management**.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [MCP Server with RAG](#mcp-server-with-rag)
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
- **MCP Server with RAG** - Intelligent context management and semantic search

### Why Use This?

| Without Orchestrator | With Orchestrator               |
| -------------------- | ------------------------------- |
| Generic responses    | Role-specific expertise         |
| Manual workflows     | Automated pipelines             |
| Context overload     | Efficient RAG-powered retrieval |
| Ad-hoc quality       | Enforced quality gates          |
| Re-reading files     | Semantic search across codebase |
| Lost context         | Persistent memory via RAG       |

---

## Quick Start

```bash
# 1. Clone and deploy to your project
git clone <this-repo>
./setup.sh /path/to/your/project

# 2. Navigate to your project
cd /path/to/your/project

# 3. (Optional) Set up MCP Server with RAG
cd mcp-server && npm install && npm run build && cd ..
cp .mcp.json.template .mcp.json
cd mcp-server && npm run index && cd ..  # Index your project

# 4. Initialize with Claude Code
claude
> /project-init

# 5. Start building!
> /project-plan "Add user authentication"
```

### With RAG Enabled

Once the MCP server is running, Claude can:

```bash
# Semantic search across your codebase
> "Find code related to user authentication"
# → Uses search_codebase tool, returns relevant code chunks

# Recall past decisions
> "What was decided about the database schema?"
# → Searches ADRs and PRPs for context

# Get relevant skill guidance
> "How should I structure React components?"
# → Retrieves relevant sections from react-development skill
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

## MCP Server with RAG

The orchestrator includes a powerful MCP (Model Context Protocol) server with RAG (Retrieval-Augmented Generation) capabilities for intelligent context management.

### What is RAG?

RAG allows Claude to **semantically search** your codebase and documentation instead of re-reading entire files. This means:

- **Efficient context usage** - Only relevant code chunks are loaded
- **Semantic search** - Find code by intent, not just keywords
- **Persistent memory** - Past decisions and patterns are indexed
- **Cross-session continuity** - Context survives between sessions

### MCP Server Setup

```bash
cd mcp-server
npm install
npm run build

# Index your project for RAG search
npm run index

# Configure Claude Code to use the MCP server
cd ..
cp .mcp.json.template .mcp.json
```

### Available MCP Tools

| Tool                    | Description                           | Example Use                          |
| ----------------------- | ------------------------------------- | ------------------------------------ |
| `get_project_context`   | Get project config, state, PRPs, ADRs | "What's the current project status?" |
| `search_codebase`       | Semantic search across source code    | "Find authentication logic"          |
| `search_documentation`  | Search PRPs, ADRs, and guides         | "What was decided about caching?"    |
| `get_relevant_skill`    | Retrieve relevant skill sections      | "How do I use React hooks?"          |
| `recall_decision`       | Find past architectural decisions     | "Why did we choose PostgreSQL?"      |
| `update_workflow_state` | Update current phase/task             | Automatic during workflows           |
| `index_project`         | Re-index project for fresh search     | After major changes                  |
| `get_rag_stats`         | Get indexing statistics               | Verify indexing status               |

### Available MCP Resources

| URI                    | Description                  |
| ---------------------- | ---------------------------- |
| `project://config`     | Project configuration (YAML) |
| `project://state`      | Current workflow state       |
| `project://prps`       | List of all PRPs             |
| `project://adrs`       | List of all ADRs             |
| `project://agents`     | Available agents             |
| `project://skills`     | Available skills             |
| `project://commands`   | Slash commands               |
| `project://prp/{name}` | Specific PRP content         |
| `project://adr/{name}` | Specific ADR content         |

### Available MCP Prompts

Pre-built prompt templates for common workflows:

| Prompt              | Arguments                 | Description                   |
| ------------------- | ------------------------- | ----------------------------- |
| `create-prp`        | feature_name, description | Generate a comprehensive PRP  |
| `code-review`       | files, focus              | Systematic code review        |
| `tdd-cycle`         | feature                   | Test-Driven Development guide |
| `create-adr`        | title, context            | Architecture Decision Record  |
| `refactor-safely`   | target, goal              | Safe refactoring workflow     |
| `debug-issue`       | symptom, expected         | Systematic debugging          |
| `implement-feature` | prp_name                  | Full implementation workflow  |
| `security-audit`    | scope                     | Security-focused audit        |

### RAG Use Cases

#### 1. Finding Related Code

```bash
# Instead of grepping through files
> "Find all code related to payment processing"

# Claude uses search_codebase tool:
# - Returns semantically relevant code chunks
# - Includes file paths and line numbers
# - Sorted by relevance
```

#### 2. Understanding Past Decisions

```bash
> "Why did we choose this architecture?"

# Claude uses recall_decision tool:
# - Searches ADRs for architectural decisions
# - Returns relevant sections with rationale
# - Includes alternatives that were considered
```

#### 3. Getting Contextual Guidance

```bash
> "How should I implement this React component?"

# Claude uses get_relevant_skill tool:
# - Retrieves React best practices
# - Returns only relevant sections
# - Includes code examples
```

#### 4. Project Context Awareness

```bash
> "What's the current state of the project?"

# Claude uses get_project_context tool:
# - Returns project configuration
# - Current workflow phase
# - Active PRPs and ADRs
# - Recent progress
```

### Re-indexing the Project

After significant changes, re-index for fresh search results:

```bash
# From command line
cd mcp-server && npm run index

# Or ask Claude
> "Re-index the project for RAG search"
# Claude uses index_project tool
```

### RAG Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Query                               │
│            "Find authentication logic"                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 MCP Server                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Tools     │  │  Resources  │  │   Prompts   │        │
│  │ (8 tools)   │  │ (8+ URIs)   │  │(8 templates)│        │
│  └──────┬──────┘  └─────────────┘  └─────────────┘        │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              RAG Engine (ChromaDB)                   │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐             │   │
│  │  │  Code   │  │  Docs   │  │ Skills  │             │   │
│  │  │ Chunks  │  │ Chunks  │  │ Chunks  │             │   │
│  │  └─────────┘  └─────────┘  └─────────┘             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Relevant Results                               │
│  • src/auth/login.ts (lines 45-120)                        │
│  • src/middleware/auth.ts (lines 10-85)                    │
│  • src/utils/jwt.ts (lines 1-50)                           │
└─────────────────────────────────────────────────────────────┘
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
│   │   └── ... (14 more)
│   │
│   ├── skills/              # 12 domain skills
│   │   ├── react-development.md
│   │   ├── vue-development.md
│   │   └── ... (10 more)
│   │
│   ├── hooks/               # 6 automation hooks
│   │   ├── block-dangerous.sh
│   │   ├── auto-format.sh
│   │   └── ... (4 more)
│   │
│   ├── rag-db/              # ChromaDB vector storage (gitignored)
│   ├── logs/                # Activity logs (gitignored)
│   └── settings.json        # Tool permissions
│
├── mcp-server/              # MCP Server with RAG
│   ├── src/
│   │   ├── index.ts         # Server entry point
│   │   ├── tools/           # MCP tools (8)
│   │   ├── resources/       # MCP resources (8+)
│   │   ├── prompts/         # MCP prompts (8)
│   │   ├── rag/             # RAG engine (ChromaDB)
│   │   └── utils/           # Utilities
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── planning/            # PRPs (Product Requirements Prompts)
│   ├── architecture/        # ADRs (Architecture Decision Records)
│   └── progress/            # Progress tracking
│
├── templates/               # Document templates
├── .mcp.json.template       # MCP server configuration template
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

### Use Case 11: RAG-Powered Codebase Exploration

**Scenario**: Understanding a large unfamiliar codebase

```bash
# Get project overview
> "What's the overall structure of this project?"
# → Claude uses get_project_context + search_codebase

# Find specific functionality
> "Where is user authentication handled?"
# → Claude uses search_codebase with semantic query
# Returns: src/auth/*, src/middleware/auth.ts, etc.

# Understand patterns
> "What database access patterns are used here?"
# → Claude searches for ORM usage, query patterns

# Find related code
> "Show me all API endpoints"
# → Returns route definitions across the codebase
```

### Use Case 12: Context-Aware Development

**Scenario**: Building on existing patterns

```bash
# Claude automatically retrieves relevant context
> "Add a new API endpoint for user preferences"

# RAG provides context:
# - Existing endpoint patterns (from search_codebase)
# - API design guidelines (from get_relevant_skill)
# - Past decisions about API structure (from recall_decision)

# Claude then generates code matching existing patterns:
# - Same error handling
# - Same validation approach
# - Same response format
```

### Use Case 13: Decision Recall & Consistency

**Scenario**: Maintaining architectural consistency

```bash
# Before making a decision
> "We need to add caching. What caching approaches have we used?"

# Claude uses recall_decision:
# - Finds ADR-003: Caching Strategy
# - Returns: "We use Redis for session cache, in-memory for API cache"
# - Includes rationale and trade-offs

# New implementation follows existing decisions
> "Add caching to the product listing endpoint"
# → Uses existing Redis client and patterns
```

### Use Case 14: Smart Documentation Search

**Scenario**: Finding specific requirements or design decisions

```bash
# Search across all PRPs
> "What are the requirements for the payment system?"

# Claude uses search_documentation:
# - Finds PRP-007: Payment Integration
# - Returns relevant sections about payment requirements

# Search ADRs for rationale
> "Why did we choose Stripe over PayPal?"

# Claude uses recall_decision:
# - Finds ADR-012: Payment Provider Selection
# - Returns decision rationale and alternatives
```

### Use Case 15: Skill-Based Guidance

**Scenario**: Getting best practices for specific technologies

```bash
# React-specific guidance
> "How should I handle form state in React?"

# Claude uses get_relevant_skill(react-development):
# - Returns form handling best practices
# - Controlled vs uncontrolled components
# - React Hook Form integration patterns

# Testing guidance
> "How do I test async functions in this project?"

# Claude uses get_relevant_skill(testing-tdd):
# - Returns async testing patterns
# - Project-specific test utilities
# - Mock and fixture patterns
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

### 7. Leverage RAG for Context

```bash
# Let Claude find relevant code semantically
> "Find code similar to the user service"
# → RAG returns related patterns

# Don't manually point to every file
# Bad:
> "Look at src/services/user.ts, src/models/user.ts,
   src/routes/user.ts and create a product service"

# Good:
> "Create a product service following the same patterns as user service"
# → RAG finds and applies existing patterns
```

### 8. Keep RAG Index Fresh

```bash
# Re-index after major changes
> "Re-index the project"

# Or from command line
cd mcp-server && npm run index

# Good times to re-index:
# - After adding new modules
# - After significant refactoring
# - After merging major PRs
# - When search results seem stale
```

### 9. Use Decision Recall

```bash
# Before making architectural decisions
> "What decisions have we made about authentication?"
# → Returns relevant ADRs

# This ensures:
# - Consistency with past decisions
# - Understanding of trade-offs already considered
# - Avoiding repeated discussions
```

### 10. Document for RAG

```bash
# Write PRPs and ADRs that RAG can find
# Include keywords and clear sections

# Good ADR structure:
# - Clear title (searchable)
# - Context (what problem)
# - Decision (what we chose)
# - Rationale (why)
# - Alternatives (what else considered)

# Claude can then recall these decisions later
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

### MCP/RAG Issues

**MCP server not connecting**

```bash
# Verify the server is built
cd mcp-server
npm run build

# Check .mcp.json exists and has correct paths
cat .mcp.json

# Test the server directly
node dist/index.js
```

**RAG search returns no results**

```bash
# Check if project is indexed
> "Get RAG stats"

# Re-index the project
cd mcp-server && npm run index

# Verify index was created
ls -la ../.claude/rag-db/
```

**RAG search returns irrelevant results**

```bash
# Try more specific queries
# Instead of: "find auth"
# Use: "user authentication login handler"

# Re-index with fresh data
cd mcp-server && npm run index
```

**ChromaDB connection issues**

```bash
# Check if rag-db directory is writable
ls -la .claude/rag-db/

# Clear and re-index
rm -rf .claude/rag-db/
cd mcp-server && npm run index
```

**MCP tools not appearing in Claude**

```bash
# Verify .mcp.json configuration
cat .mcp.json

# Ensure claude-orchestrator is not disabled
# Check: "disabled": false

# Restart Claude Code
# The MCP server connects on startup
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
