# Universal Project Orchestrator for Claude Code

> **IMPORTANT**: This is a dynamic, reusable system for managing any software project with Claude Code.
> Run `./setup.sh /path/to/your/project` to deploy to a new project.

## 🎯 Purpose

This orchestrator transforms Claude Code into a **team of expert engineers** working together through:
- **Specialized Subagents** for different roles (Architect, Developer, Tester, Security, etc.)
- **Custom Commands** for standardized workflows (TDD, Explore, Refactor, etc.)
- **Hooks** for automation and quality gates
- **Skills** for domain-specific knowledge

## 📁 Project Structure

```
your-project/
├── .claude/
│   ├── agents/              # 9 Specialized subagents
│   │   ├── architect.md
│   │   ├── developer.md
│   │   ├── documenter.md
│   │   ├── performance-specialist.md
│   │   ├── project-manager.md
│   │   ├── reviewer.md
│   │   ├── security-auditor.md
│   │   ├── tester.md
│   │   └── validation-gates.md
│   ├── commands/            # 12 Custom slash commands
│   │   ├── primer.md
│   │   ├── project-deploy.md
│   │   ├── project-explore.md
│   │   ├── project-fix-issue.md
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
│   │   ├── auto-format.sh
│   │   ├── block-dangerous.sh
│   │   ├── log-tool-usage.sh
│   │   ├── save-context.sh
│   │   ├── session-tracker.sh
│   │   └── validate-planning.sh
│   ├── skills/              # 5 Domain skills
│   │   ├── api-design.md
│   │   ├── database.md
│   │   ├── git-workflow.md
│   │   ├── python-development.md
│   │   └── testing-tdd.md
│   ├── logs/                # Activity logs
│   └── settings.json        # Tool permissions & hooks
├── docs/
│   ├── planning/            # PRPs (feature plans)
│   ├── architecture/        # ADRs (design decisions)
│   └── progress/            # Progress tracking
├── templates/               # Document templates
│   ├── ADR-TEMPLATE.md
│   └── PRP-TEMPLATE.md
├── .mcp.json.template       # MCP server config template
├── project-config.yaml      # Project configuration
├── CLAUDE.md                # This file
└── setup.sh                 # Deployment script
```

## 🚀 Quick Start Commands

| Command | Description |
|---------|-------------|
| `/project:init` | Initialize project structure & config |
| `/project:plan` | Create a comprehensive feature plan (PRP) |
| `/project:explore` | Deep dive into codebase area |
| `/project:implement` | Execute implementation from a plan |
| `/project:tdd` | Test-Driven Development workflow |
| `/project:refactor` | Safe code refactoring |
| `/project:review` | Run comprehensive code review |
| `/project:test` | Execute test cycle |
| `/project:validate` | Run all quality gates |
| `/project:fix-issue` | Fix a GitHub issue automatically |
| `/project:deploy` | Prepare deployment & release notes |
| `/project:status` | Show project progress dashboard |
| `/primer` | Comprehensive repository analysis |

## 🔄 Development Lifecycle

```
1. DISCOVER → 2. PLAN → 3. DESIGN → 4. IMPLEMENT → 5. TEST → 6. REVIEW → 7. DEPLOY
     │           │          │            │           │          │          │
   explore    plan       architect    implement    tdd       review     deploy
```

## 🤖 Subagent Team

| Agent | Role | Key Capabilities |
|-------|------|------------------|
| `project-manager` | Requirements, planning | PRPs, issue tracking |
| `architect` | System design | ADRs, patterns |
| `developer` | Implementation | Code, refactoring |
| `tester` | Quality assurance | TDD, coverage |
| `reviewer` | Code review | Standards, best practices |
| `documenter` | Documentation | README, API docs |
| `security-auditor` | Security review | OWASP, vulnerabilities |
| `performance-specialist` | Optimization | Profiling, bottlenecks |
| `validation-gates` | Quality gates | All checks must pass |

## ⚡ Hooks (Automation)

| Hook | Trigger | Purpose |
|------|---------|---------|
| `block-dangerous.sh` | PreToolUse (Bash) | Block risky commands |
| `validate-planning.sh` | PreToolUse (Edit/Write) | Remind about planning |
| `auto-format.sh` | PostToolUse | Format code after edits |
| `log-tool-usage.sh` | PostToolUse | Audit trail |
| `session-tracker.sh` | Stop | Track session activity |
| `save-context.sh` | PreCompact | Preserve context snapshots |

## 📋 Workflow Rules

### IMPORTANT - Always Follow These Steps:

1. **Before ANY implementation**: Run `/project:plan` or ensure a plan exists
2. **Use TDD when possible**: `/project:tdd` for test-driven approach
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
- [ ] Type checking (`pyright` / `mypy`)
- [ ] Linting (`ruff` / `eslint`)
- [ ] Unit tests (100% pass rate)
- [ ] Coverage threshold met
- [ ] Security review (no secrets, safe patterns)
- [ ] Documentation updated

## 🔧 Configuration

Edit `project-config.yaml` in your project root to customize:
- Project identity and tech stack
- Code quality tools and thresholds
- Testing framework and coverage requirements
- Git workflow preferences
- Quality gate requirements

## 💡 Best Practices (from Anthropic)

1. **Be specific** - Clear, detailed instructions improve results
2. **Provide examples** - Show patterns you want to follow
3. **Use iterative approach** - Build incrementally with validation
4. **Leverage subagents** - Keep main context clean
5. **Plan before coding** - "Explore, plan, code, commit" workflow
6. **Test-driven** - Write tests first when possible
7. **Course correct early** - Use Escape to redirect Claude

## 🔗 Resources

- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [MCP Integration](https://docs.anthropic.com/en/docs/claude-code/mcp)

---

*This orchestrator is designed to work across all Python projects. Customize `project-config.yaml` for your specific needs.*
