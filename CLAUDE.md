# Full-Stack Development Orchestrator for Claude Code

> **Streamlined Edition** - Essential components for reliable fullstack development.
> Run `./setup.sh /path/to/your/project` to deploy to a new project.

## Purpose

This orchestrator provides a **focused, reliable workflow** for fullstack development with Claude Code:

- **6 Specialized Agents** for different roles
- **8 Essential Commands** for standardized workflows
- **5 Core Skills** for domain knowledge
- **3 MCP Tools** for project context management

## Core Philosophy

### KISS (Keep It Simple, Stupid)

Simplicity is the key goal. This orchestrator has been deliberately slimmed down from a larger system to focus on what actually works reliably.

### YAGNI (You Aren't Gonna Need It)

Implement features only when needed, not when you anticipate they might be useful.

### Design Principles

- **Single Responsibility**: Each function, class, and module should have one clear purpose
- **Fail Fast**: Check for potential errors early
- **No Speculation**: Implement features when needed, not anticipated

### Code Structure Limits

| Element         | Max Lines | Rationale                                 |
| --------------- | --------- | ----------------------------------------- |
| **Files**       | 500       | Split into modules when approaching limit |
| **Functions**   | 50        | Single, clear responsibility              |
| **Classes**     | 100       | Represent one concept or entity           |
| **Line Length** | 100 chars | Readability                               |

### Search Commands

Always use `rg` (ripgrep) instead of `grep` and `find`:

```bash
rg "pattern"                    # Search for pattern
rg --files -g "*.py"           # Find files by extension
rg "function" --type ts        # Search in TypeScript files
```

## Project Structure

```
your-project/
├── .claude/
│   ├── agents/              # 6 Core agents
│   │   ├── developer.md
│   │   ├── frontend-developer.md
│   │   ├── tester.md
│   │   ├── reviewer.md
│   │   ├── devops-engineer.md
│   │   └── validation-gates.md
│   ├── commands/            # 8 Essential commands
│   │   ├── primer.md
│   │   ├── project-init.md
│   │   ├── project-plan.md
│   │   ├── project-implement.md
│   │   ├── project-tdd.md
│   │   ├── project-test.md
│   │   ├── project-validate.md
│   │   └── project-status.md
│   ├── skills/              # 5 Core skills
│   │   ├── api-design.md
│   │   ├── database.md
│   │   ├── git-workflow.md
│   │   ├── react-development.md
│   │   └── testing-tdd.md
│   ├── logs/                # Activity logs
│   ├── workflow/            # Workflow state tracking
│   └── settings.json        # Tool permissions
├── mcp-server/              # MCP server (3 tools)
├── docs/
│   ├── planning/            # PRPs (feature plans)
│   ├── architecture/        # ADRs (design decisions)
│   └── progress/            # Progress tracking
├── project-config.yaml      # Project configuration
└── CLAUDE.md                # This file
```

## Commands

### Core Workflow

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `/primer`            | Analyze codebase before starting work    |
| `/project-init`      | Initialize project structure             |
| `/project-plan`      | Create feature plan (PRP)                |
| `/project-implement` | Execute implementation from PRP          |
| `/project-tdd`       | Test-Driven Development workflow         |
| `/project-test`      | Run test suite                           |
| `/project-validate`  | Run all quality gates                    |
| `/project-status`    | Show project dashboard                   |

### Typical Workflow

```
1. /primer          → Understand codebase
2. /project-plan    → Create PRP for feature
3. /project-tdd     → Implement with tests first
4. /project-validate → Verify quality gates
5. Commit and push
```

## Agents

| Agent                | Role                   | Key Capabilities           |
| -------------------- | ---------------------- | -------------------------- |
| `developer`          | Backend implementation | API, services, clean code  |
| `frontend-developer` | UI implementation      | React, Vue, components     |
| `tester`             | Quality assurance      | TDD, coverage, tests       |
| `reviewer`           | Code review            | Standards, best practices  |
| `devops-engineer`    | Infrastructure         | Docker, CI/CD              |
| `validation-gates`   | Quality gates          | All checks must pass       |

## Skills

| Skill                | Purpose                        |
| -------------------- | ------------------------------ |
| `api-design`         | REST patterns, validation      |
| `database`           | ORM, migrations, queries       |
| `git-workflow`       | Commits, branches, PRs         |
| `react-development`  | React, hooks, components       |
| `testing-tdd`        | TDD methodology, test patterns |

## MCP Server

The MCP server provides **3 essential tools**:

| Tool                    | Description                           |
| ----------------------- | ------------------------------------- |
| `get_project_context`   | Get config, state, PRPs, ADRs         |
| `update_workflow_state` | Update workflow phase/task            |
| `index_project`         | Re-index project for search           |

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

## Configuration

Edit `project-config.yaml` for your project:

```yaml
project:
  name: "your-project"
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

## Quality Gates

All implementations must pass:

- [ ] Type checking (tsc / pyright)
- [ ] Linting (ESLint / Ruff)
- [ ] Unit tests (100% pass rate)
- [ ] Coverage threshold (80%+)
- [ ] Build successful

## Workflow Rules

### Planning Location

**Use `/project-plan` for feature planning** - NOT Claude's built-in plan mode.

- `/project-plan feature-name` → Saves to `docs/planning/PRP-feature-name.md` (project-local)
- Claude's built-in plan mode → Saves to `~/.claude/plans/` (global, not project-specific)

### Best Practices

1. **Always run /primer first** on a new codebase
2. **Create a PRP before implementing** with /project-plan
3. **Use TDD** with /project-tdd when possible
4. **Validate before committing** with /project-validate
5. **Check project-config.yaml** for stack settings

## Tech Stack Support

### Frontend

- React / Next.js 14+
- Vue 3 / Nuxt 3
- TypeScript
- Tailwind CSS

### Backend

- Node.js / Express / NestJS
- Python / FastAPI / Django
- GraphQL / tRPC

### Database

- PostgreSQL / MySQL / SQLite
- Prisma / Drizzle / SQLAlchemy

### DevOps

- Docker / Docker Compose
- GitHub Actions / GitLab CI

## Archived Components

Additional components available in archive directories if needed:

- `.claude/agents/archive/` - architect, documenter, project-manager, etc.
- `.claude/commands/archive/` - docker, db, deploy, env, refactor, etc.
- `.claude/skills/archive/` - vue, graphql, docker-kubernetes, ci-cd, etc.

Restore from archive when your project requires specific capabilities.

## Resources

- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

---

*This orchestrator is designed to be reliable and focused. Add complexity only when needed.*
