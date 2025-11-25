---
name: project-status
description: "Display comprehensive project status dashboard including workflow state, progress, and recommendations."
tools: Read, Bash(find:*), Bash(git:*), Bash(wc:*), Bash(ls:*), Bash(gh:*)
---

# Project Status Dashboard

Display comprehensive project status and progress with next-step recommendations.

## Data Collection

### Step 1: Load Project Configuration
```bash
# Read project config
cat project-config.yaml 2>/dev/null || echo "No config found"
```

### Step 2: Load Workflow State
```bash
# Read current workflow state
cat .claude/workflow/STATE.md 2>/dev/null || echo "Workflow not initialized"
```

### Step 3: Gather Metrics

#### Codebase Stats
```bash
# Count source files
find . -name "*.py" -not -path "./.*" -not -path "./.venv/*" | wc -l

# Count test files
find . -name "test_*.py" -o -name "*_test.py" | wc -l

# Count documentation files
find docs -name "*.md" 2>/dev/null | wc -l
```

#### Git Status
```bash
# Current branch
git branch --show-current

# Uncommitted changes
git status --porcelain | wc -l

# Recent commits
git log --oneline -5
```

#### Planning Status
```bash
# Count PRPs
ls docs/planning/PRP-*.md 2>/dev/null | wc -l

# Active PRPs (not completed)
grep -l "Status.*In Progress" docs/planning/PRP-*.md 2>/dev/null | wc -l
```

### Step 4: GitHub Status (if available)
```bash
# Open issues
gh issue list --limit 5 2>/dev/null || echo "gh CLI not available"

# Open PRs
gh pr list --limit 5 2>/dev/null || echo ""
```

## Dashboard Output

```
╔══════════════════════════════════════════════════════════════════╗
║                    PROJECT STATUS DASHBOARD                       ║
╠══════════════════════════════════════════════════════════════════╣
║  Project: [name from config]                                      ║
║  Language: [language] | Framework: [framework]                    ║
║  Current Phase: [phase from STATE.md]                             ║
╠══════════════════════════════════════════════════════════════════╣
║  📁 CODEBASE                                                      ║
║  ├── Source Files:     [count]                                    ║
║  ├── Test Files:       [count]                                    ║
║  ├── Documentation:    [count]                                    ║
║  └── Lines of Code:    [estimate]                                 ║
╠══════════════════════════════════════════════════════════════════╣
║  🔀 GIT STATUS                                                    ║
║  ├── Branch:           [current branch]                           ║
║  ├── Uncommitted:      [count] files                              ║
║  ├── Last Commit:      [hash] [message]                           ║
║  └── Status:           [clean/dirty]                              ║
╠══════════════════════════════════════════════════════════════════╣
║  📋 WORKFLOW STATE                                                ║
║  ├── Current Phase:    [phase]                                    ║
║  ├── Active Task:      [task or "none"]                           ║
║  └── Completed Steps:  [count]/[total]                            ║
╠══════════════════════════════════════════════════════════════════╣
║  📝 PLANNING                                                      ║
║  ├── Total PRPs:       [count]                                    ║
║  ├── Active:           [count]                                    ║
║  └── Completed:        [count]                                    ║
╠══════════════════════════════════════════════════════════════════╣
║  🔗 GITHUB (if available)                                         ║
║  ├── Open Issues:      [count]                                    ║
║  └── Open PRs:         [count]                                    ║
╠══════════════════════════════════════════════════════════════════╣
║  RECENT ACTIVITY                                                  ║
║  • [commit 1]                                                     ║
║  • [commit 2]                                                     ║
║  • [commit 3]                                                     ║
╠══════════════════════════════════════════════════════════════════╣
║  ➡️  RECOMMENDED NEXT ACTION                                      ║
║  ───────────────────────────────────────────────────────────────  ║
║  [Based on workflow state, suggest next command]                  ║
║                                                                   ║
║  Options:                                                         ║
║  • [option 1]                                                     ║
║  • [option 2]                                                     ║
╚══════════════════════════════════════════════════════════════════╝
```

## Next Action Logic

Based on workflow state, recommend:

| Current State | Recommendation |
|---------------|----------------|
| Not initialized | `/project:init` |
| Initialized, no analysis | `/primer` |
| No active PRP | `/project:plan [feature]` |
| PRP exists, not started | `/project:implement [PRP]` |
| Implementation done | `/project:review` |
| Review passed | `/project:validate` |
| Validation passed | `/project:deploy` |
| Uncommitted changes | `git commit -m "..."` |

## Workflow Progress Visualization

```
[✅] Init ──▶ [✅] Discover ──▶ [🔄] Plan ──▶ [⬜] Implement ──▶ [⬜] Review ──▶ [⬜] Validate ──▶ [⬜] Deploy
                                   │
                                   └── You are here
```

## Health Indicators

Show health status:
- 🟢 Healthy: All checks pass, workflow on track
- 🟡 Warning: Some issues, needs attention
- 🔴 Critical: Blocking issues, action required

```
HEALTH CHECK
├── Tests:        🟢 All passing
├── Linting:      🟡 3 warnings
├── Coverage:     🟢 85%
├── Security:     🟢 No issues
└── Git:          🟡 Uncommitted changes
```
