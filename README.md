# Full-Stack Development Orchestrator for Claude Code

A streamlined orchestration system that provides **focused, reliable workflows** for fullstack development with Claude Code.

## Overview

This orchestrator provides:

- **6 Specialized Agents** - Core development team roles
- **8 Essential Commands** - Standardized workflows
- **5 Core Skills** - Domain knowledge references
- **3 MCP Tools** - Project context management

### Why Use This?

| Without Orchestrator | With Orchestrator           |
| -------------------- | --------------------------- |
| Generic responses    | Role-specific expertise     |
| Manual workflows     | Standardized pipelines      |
| Ad-hoc quality       | Enforced quality gates      |
| No project memory    | Workflow state tracking     |

---

## Quick Start

```bash
# 1. Clone and deploy to your project
git clone <this-repo>
./setup.sh /path/to/your/project

# 2. Navigate to your project
cd /path/to/your/project

# 3. Start with Claude Code
claude
> /primer              # Analyze codebase
> /project-plan "feature"  # Plan your feature
> /project-tdd         # Implement with TDD
> /project-validate    # Verify quality gates
```

---

## Installation

### Prerequisites

- Claude Code CLI installed
- Git
- Node.js 18+ (for frontend projects)
- Python 3.11+ (for backend projects)

### Deploy to Project

```bash
# Run the setup script
./setup.sh /path/to/your/project

# This copies:
# - .claude/agents/     → 6 specialized agents
# - .claude/commands/   → 8 slash commands
# - .claude/skills/     → 5 domain skills
# - .claude/settings.json
# - project-config.yaml
# - CLAUDE.md
```

---

## Project Structure

```
your-project/
├── .claude/
│   ├── agents/              # 6 Specialized agents
│   │   ├── developer.md           # Backend implementation
│   │   ├── frontend-developer.md  # UI implementation
│   │   ├── tester.md              # Quality assurance
│   │   ├── reviewer.md            # Code review
│   │   ├── devops-engineer.md     # Infrastructure
│   │   └── validation-gates.md    # Quality enforcement
│   │
│   ├── commands/            # 8 Essential commands
│   │   ├── primer.md              # Codebase analysis
│   │   ├── project-init.md        # Initialize project
│   │   ├── project-plan.md        # Create PRPs
│   │   ├── project-implement.md   # Execute PRPs
│   │   ├── project-tdd.md         # TDD workflow
│   │   ├── project-test.md        # Run tests
│   │   ├── project-validate.md    # Quality gates
│   │   └── project-status.md      # Dashboard
│   │
│   ├── skills/              # 5 Core skills
│   │   ├── api-design.md          # REST patterns
│   │   ├── database.md            # ORM, migrations
│   │   ├── git-workflow.md        # Commits, branches
│   │   ├── react-development.md   # React, Next.js
│   │   └── testing-tdd.md         # TDD methodology
│   │
│   ├── workflow/            # State tracking
│   └── settings.json        # Tool permissions
│
├── mcp-server/              # MCP Server (3 tools)
├── docs/
│   ├── planning/            # PRPs (feature plans)
│   ├── architecture/        # ADRs (decisions)
│   └── progress/            # Progress tracking
│
├── templates/               # Document templates
├── project-config.yaml      # Project configuration
└── CLAUDE.md               # Claude instructions
```

---

## Agents

| Agent                | Role                   | Key Capabilities          |
| -------------------- | ---------------------- | ------------------------- |
| `developer`          | Backend implementation | API, services, Python/Node |
| `frontend-developer` | UI implementation      | React, Vue, components    |
| `tester`             | Quality assurance      | TDD, pytest, vitest       |
| `reviewer`           | Code review            | Standards, security       |
| `devops-engineer`    | Infrastructure         | Docker, CI/CD             |
| `validation-gates`   | Quality gates          | All checks must pass      |

### Archived Agents

Additional agents available in `.claude/agents/archive/`:
- `architect`, `fullstack-architect`, `documenter`, `project-manager`, `security-auditor`, `performance-specialist`

---

## Commands

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `/primer`            | Analyze codebase (run first)   |
| `/project-init`      | Initialize project structure   |
| `/project-plan`      | Create feature plan (PRP)      |
| `/project-implement` | Execute implementation from PRP |
| `/project-tdd`       | Test-Driven Development        |
| `/project-test`      | Run test suite                 |
| `/project-validate`  | Run all quality gates          |
| `/project-status`    | Show project dashboard         |

### Typical Workflow

```
1. /primer          → Understand codebase
2. /project-plan    → Create PRP for feature
3. /project-tdd     → Implement with tests first
4. /project-validate → Verify quality gates
5. Commit and push
```

### Archived Commands

Additional commands in `.claude/commands/archive/`:
- `/project-docker`, `/project-db`, `/project-deploy`, `/project-env`, `/project-refactor`, `/project-review`, `/project-frontend`, `/project-explore`, `/project-fix-issue`

---

## Skills

| Skill               | Topics Covered                         |
| ------------------- | -------------------------------------- |
| `api-design`        | REST conventions, validation, errors   |
| `database`          | ORM patterns, migrations, queries      |
| `git-workflow`      | Conventional commits, branching, PRs   |
| `react-development` | React 18, Next.js 14, hooks, patterns  |
| `testing-tdd`       | TDD methodology, pytest, vitest        |

### Archived Skills

Additional skills in `.claude/skills/archive/`:
- `vue-development`, `graphql-api`, `docker-kubernetes`, `ci-cd`, `css-styling`, `state-management`, `python-development`

---

## MCP Server

The MCP server provides **3 essential tools** for project context:

| Tool                    | Description                     |
| ----------------------- | ------------------------------- |
| `get_project_context`   | Get config, state, PRPs, ADRs   |
| `update_workflow_state` | Update workflow phase/task      |
| `index_project`         | Re-index project files          |

### Setup

```bash
cd mcp-server
npm install
npm run build

# Configure Claude Code
cd ..
cp .mcp.json.template .mcp.json
```

### Note on Search

For code search, use Claude's built-in tools:
- **Grep** - Pattern search in files
- **Glob** - Find files by pattern

These are more reliable than RAG-based search for most use cases.

---

## Configuration

### project-config.yaml

```yaml
project:
  name: "my-app"
  version: "1.0.0"

stack:
  type: "fullstack"  # fullstack, backend, frontend

  frontend:
    framework: "react"  # react, vue, svelte
    language: "typescript"

  backend:
    framework: "fastapi"  # fastapi, express, nestjs
    language: "python"

quality:
  required_gates:
    - type_check
    - lint
    - test
  coverage_threshold: 80
```

---

## Quality Gates

All implementations must pass:

- [ ] Type checking (tsc / pyright)
- [ ] Linting (ESLint / Ruff)
- [ ] Unit tests (100% pass rate)
- [ ] Coverage threshold (80%+)
- [ ] Build successful

---

## Best Practices

### 1. Always Plan First

```bash
> /project-plan "Add user authentication"
> /project-implement docs/planning/auth-prp.md
```

### 2. Use TDD for Critical Features

```bash
> /project-tdd "Payment processing"
```

### 3. Validate Before Merging

```bash
> /project-validate
```

### 4. Check Stack Settings

Commands read `project-config.yaml` to determine:
- Which test frameworks to use
- Which linters to run
- Frontend vs backend vs fullstack

---

## Troubleshooting

**Commands not found**
```bash
ls -la .claude/commands/
# Re-run setup if missing
./setup.sh .
```

**Agent not responding correctly**
```bash
# Check agent file exists
cat .claude/agents/developer.md

# Try explicit delegation
> "Use the developer agent to implement this API"
```

**MCP server not connecting**
```bash
cd mcp-server
npm run build
cat ../.mcp.json  # Verify paths
```

---

## Resources

- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Best Practices Guide](https://www.anthropic.com/engineering/claude-code-best-practices)

---

*This orchestrator is designed to be reliable and focused. Add complexity only when needed.*
