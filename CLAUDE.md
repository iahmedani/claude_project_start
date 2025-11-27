# Full-Stack Development Orchestrator for Claude Code

> **IMPORTANT**: This is a comprehensive full-stack development system for managing any software project with Claude Code.
> Run `./setup.sh /path/to/your/project` to deploy to a new project.

## Purpose

This orchestrator transforms Claude Code into a **full-stack development team** working together through:

- **12 Specialized Subagents** for different roles (Architect, Developer, Tester, Frontend, DevOps, etc.)
- **17 Custom Commands** for standardized workflows (TDD, Docker, Database, Frontend, etc.)
- **Hooks** for automation and quality gates
- **12 Skills** for domain-specific knowledge (React, Vue, GraphQL, Docker, etc.)
- **MCP Server with RAG** for intelligent context management and semantic search

## Core Development Philosophy

### KISS (Keep It Simple, Stupid)

Simplicity should be a key goal in design. Choose straightforward solutions over complex ones. Simple solutions are easier to understand, maintain, and debug.

### YAGNI (You Aren't Gonna Need It)

Implement features only when needed, not when you anticipate they might be useful. Avoid building functionality on speculation.

### Design Principles

- **Single Responsibility**: Each function, class, and module should have one clear purpose
- **Open/Closed**: Software entities should be open for extension but closed for modification
- **Dependency Inversion**: High-level modules should depend on abstractions, not implementations
- **Fail Fast**: Check for potential errors early and raise exceptions immediately

### Code Structure Limits

| Element         | Max Lines | Rationale                                 |
| --------------- | --------- | ----------------------------------------- |
| **Files**       | 500       | Split into modules when approaching limit |
| **Functions**   | 50        | Single, clear responsibility              |
| **Classes**     | 100       | Represent one concept or entity           |
| **Line Length** | 100 chars | Readability (configurable in linters)     |

### Search Command Requirements

Always use `rg` (ripgrep) instead of `grep` and `find`:

```bash
# Use rg for searching
rg "pattern"                    # Instead of: grep -r "pattern" .
rg --files -g "*.py"           # Instead of: find . -name "*.py"
rg "function" --type ts        # Search in TypeScript files
```

## Project Structure

```
your-project/
├── .claude/
│   ├── agents/              # 12 Specialized subagents
│   │   ├── architect.md
│   │   ├── developer.md
│   │   ├── documenter.md
│   │   ├── devops-engineer.md
│   │   ├── frontend-developer.md
│   │   ├── fullstack-architect.md
│   │   ├── performance-specialist.md
│   │   ├── project-manager.md
│   │   ├── reviewer.md
│   │   ├── security-auditor.md
│   │   ├── tester.md
│   │   └── validation-gates.md
│   ├── commands/            # 17 Custom slash commands
│   │   ├── primer.md
│   │   ├── project-db.md
│   │   ├── project-deploy.md
│   │   ├── project-docker.md
│   │   ├── project-env.md
│   │   ├── project-explore.md
│   │   ├── project-fix-issue.md
│   │   ├── project-frontend.md
│   │   ├── project-implement.md
│   │   ├── project-init.md
│   │   ├── project-plan.md
│   │   ├── project-refactor.md
│   │   ├── project-review.md
│   │   ├── project-status.md
│   │   ├── project-tdd.md
│   │   ├── project-test.md
│   │   └── project-validate.md
│   ├── hooks/               # 6 Automation hooks
│   ├── skills/              # 12 Domain skills
│   │   ├── api-design.md
│   │   ├── ci-cd.md
│   │   ├── css-styling.md
│   │   ├── database.md
│   │   ├── docker-kubernetes.md
│   │   ├── git-workflow.md
│   │   ├── graphql-api.md
│   │   ├── python-development.md
│   │   ├── react-development.md
│   │   ├── state-management.md
│   │   ├── testing-tdd.md
│   │   └── vue-development.md
│   ├── logs/                # Activity logs
│   ├── rag-db/              # Vector database for RAG
│   └── settings.json        # Tool permissions & hooks
├── mcp-server/              # MCP server with RAG
│   ├── src/                 # TypeScript source
│   ├── dist/                # Compiled output
│   └── package.json
├── docs/
│   ├── planning/            # PRPs (feature plans)
│   ├── architecture/        # ADRs (design decisions)
│   └── progress/            # Progress tracking
├── templates/               # Document templates
├── project-config.yaml      # Project configuration
├── CLAUDE.md                # This file
└── setup.sh                 # Deployment script
```

## Quick Start Commands

### Project Management

| Command           | Description                               |
| ----------------- | ----------------------------------------- |
| `/project-init`   | Initialize project structure & config     |
| `/project-plan`   | Create a comprehensive feature plan (PRP) |
| `/project-status` | Show project progress dashboard           |
| `/primer`         | Comprehensive repository analysis         |

### Development

| Command              | Description                           |
| -------------------- | ------------------------------------- |
| `/project-implement` | Execute implementation from a plan    |
| `/project-tdd`       | Test-Driven Development workflow      |
| `/project-refactor`  | Safe code refactoring                 |
| `/project-frontend`  | Frontend component/page/hook creation |

### Infrastructure

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `/project-env`    | Set up development environment   |
| `/project-docker` | Manage Docker containers         |
| `/project-db`     | Database migrations & management |

### Quality & Review

| Command              | Description                      |
| -------------------- | -------------------------------- |
| `/project-test`      | Execute test cycle               |
| `/project-review`    | Run comprehensive code review    |
| `/project-validate`  | Run all quality gates            |
| `/project-fix-issue` | Fix a GitHub issue automatically |

### Deployment

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `/project-deploy` | Prepare deployment & release notes |

## Development Lifecycle

```
1. DISCOVER → 2. PLAN → 3. DESIGN → 4. IMPLEMENT → 5. TEST → 6. REVIEW → 7. DEPLOY
     │           │          │            │           │          │          │
   explore     plan      architect    implement    tdd       review     deploy
                                     + frontend
                                     + docker
                                     + db
```

## Subagent Team

### Core Team

| Agent                 | Role                   | Key Capabilities           |
| --------------------- | ---------------------- | -------------------------- |
| `project-manager`     | Requirements, planning | PRPs, issue tracking       |
| `fullstack-architect` | System design          | ADRs, tech stack, patterns |
| `developer`           | Backend implementation | API, services, clean code  |
| `frontend-developer`  | UI implementation      | React, Vue, components     |
| `tester`              | Quality assurance      | TDD, coverage              |

### Support Team

| Agent                    | Role            | Key Capabilities          |
| ------------------------ | --------------- | ------------------------- |
| `architect`              | Backend design  | Service patterns          |
| `reviewer`               | Code review     | Standards, best practices |
| `documenter`             | Documentation   | README, API docs          |
| `security-auditor`       | Security review | OWASP, vulnerabilities    |
| `performance-specialist` | Optimization    | Profiling, bottlenecks    |
| `devops-engineer`        | Infrastructure  | Docker, K8s, CI/CD        |
| `validation-gates`       | Quality gates   | All checks must pass      |

## Skills Reference

### Frontend

- **react-development** - React, Next.js, hooks, patterns
- **vue-development** - Vue 3, Composition API, Pinia
- **css-styling** - Tailwind, modern CSS, animations
- **state-management** - Zustand, React Query, Pinia

### Backend

- **api-design** - REST, response formats, validation
- **graphql-api** - Schema design, Apollo, resolvers
- **database** - ORM patterns, migrations, queries
- **python-development** - Python best practices

### DevOps

- **docker-kubernetes** - Containers, orchestration
- **ci-cd** - GitHub Actions, pipelines, IaC

### General

- **git-workflow** - Branching, commits, PRs
- **testing-tdd** - TDD methodology, test patterns

## Hooks (Automation)

| Hook                   | Trigger                 | Purpose                    |
| ---------------------- | ----------------------- | -------------------------- |
| `block-dangerous.sh`   | PreToolUse (Bash)       | Block risky commands       |
| `validate-planning.sh` | PreToolUse (Edit/Write) | Remind about planning      |
| `auto-format.sh`       | PostToolUse             | Format code after edits    |
| `log-tool-usage.sh`    | PostToolUse             | Audit trail                |
| `session-tracker.sh`   | Stop                    | Track session activity     |
| `save-context.sh`      | PreCompact              | Preserve context snapshots |

## MCP Server (RAG-Powered)

The orchestrator includes an MCP server with RAG capabilities for intelligent context management.

### What is RAG?

RAG (Retrieval-Augmented Generation) allows Claude to **semantically search** your codebase instead of re-reading entire files:

- **Efficient context** - Only relevant code chunks are loaded
- **Semantic search** - Find code by intent, not just keywords
- **Persistent memory** - Past decisions and patterns are indexed
- **Cross-session continuity** - Context survives between sessions

### Setup

```bash
cd mcp-server
npm install
npm run build
npm run index  # Index project for RAG search

# Configure Claude Code
cd ..
cp .mcp.json.template .mcp.json
```

### MCP Tools

| Tool                    | Description                        | Example Use                       |
| ----------------------- | ---------------------------------- | --------------------------------- |
| `get_project_context`   | Get config, state, PRPs, ADRs      | "What's the project status?"      |
| `search_codebase`       | Semantic search across source code | "Find authentication logic"       |
| `search_documentation`  | Search PRPs, ADRs, and guides      | "What was decided about caching?" |
| `get_relevant_skill`    | Retrieve relevant skill sections   | "How do I use React hooks?"       |
| `recall_decision`       | Find past architectural decisions  | "Why did we choose PostgreSQL?"   |
| `update_workflow_state` | Update workflow phase/task         | Automatic during workflows        |
| `index_project`         | Re-index project for RAG           | After major changes               |
| `get_rag_stats`         | Get indexing statistics            | Verify indexing status            |

### MCP Resources

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

### MCP Prompts

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

### RAG Usage Examples

```bash
# Semantic code search
> "Find all code related to payment processing"
# → Returns relevant code chunks with file paths and line numbers

# Understanding past decisions
> "Why did we choose this architecture?"
# → Searches ADRs for architectural decisions and rationale

# Getting contextual guidance
> "How should I implement this React component?"
# → Retrieves relevant sections from react-development skill

# Project context awareness
> "What's the current state of the project?"
# → Returns config, workflow phase, active PRPs/ADRs
```

### Re-indexing

After significant changes, re-index for fresh search results:

```bash
# From command line
cd mcp-server && npm run index

# Or ask Claude
> "Re-index the project for RAG search"
```

## Workflow Rules

### IMPORTANT - Planning Location

**Use `/project-plan` for feature planning** - NOT Claude's built-in plan mode.

- `/project-plan feature-name` → Saves to `docs/planning/PRP-feature-name.md` (project-local)
- Claude's built-in plan mode → Saves to `~/.claude/plans/` (global, not project-specific)

Always use the `/project-plan` command to keep plans in your project repository.

### IMPORTANT - Always Follow These Steps:

1. **Before ANY implementation**: Run `/project-plan` or ensure a plan exists
2. **Use TDD when possible**: `/project-tdd` for test-driven approach
3. **Use subagents**: Delegate specialized tasks to appropriate agents
4. **Validate gates**: All code must pass review before completion
5. **Document changes**: Update docs and CHANGELOG with every feature

### Context Management

- Use `/clear` between major tasks to keep context focused
- Delegate exploration to subagents to preserve main context
- Use `think hard` or `ultrathink` for complex planning
- Check `.claude/logs/context-snapshots/` for preserved context

### Quality Gates

All implementations must pass:

- [ ] Type checking (tsc / pyright / mypy)
- [ ] Linting (ESLint / Ruff)
- [ ] Unit tests (100% pass rate)
- [ ] Coverage threshold met (80%+)
- [ ] Security review (no secrets, safe patterns)
- [ ] Documentation updated
- [ ] Build successful

## Configuration

Edit `project-config.yaml` in your project root to customize:

- **Stack configuration** - Frontend, backend, database, API style
- **Language versions** - Node, Python, TypeScript
- **Code quality tools** - Linters, formatters, type checkers
- **Testing setup** - Frameworks, coverage thresholds
- **Infrastructure** - Docker, K8s, CI/CD
- **Quality gates** - Required and recommended checks

## Best Practices

1. **Be specific** - Clear, detailed instructions improve results
2. **Provide examples** - Show patterns you want to follow
3. **Use iterative approach** - Build incrementally with validation
4. **Leverage subagents** - Keep main context clean
5. **Plan before coding** - "Explore, plan, code, commit" workflow
6. **Test-driven** - Write tests first when possible
7. **Course correct early** - Use Escape to redirect Claude

## Tech Stack Support

### Frontend

- React / Next.js 14+
- Vue 3 / Nuxt 3
- Svelte / SvelteKit
- TypeScript
- Tailwind CSS
- Zustand / Pinia / Redux

### Backend

- Node.js / Express / NestJS
- Python / FastAPI / Django
- Go / Rust
- GraphQL / tRPC

### Database

- PostgreSQL / MySQL / SQLite
- MongoDB / Redis
- Prisma / Drizzle / SQLAlchemy

### DevOps

- Docker / Docker Compose
- Kubernetes / Helm
- GitHub Actions / GitLab CI
- Terraform / AWS / GCP

## Resources

- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [MCP Integration](https://docs.anthropic.com/en/docs/claude-code/mcp)

---

_This orchestrator is designed for full-stack development across any tech stack. Customize `project-config.yaml` for your specific needs._
