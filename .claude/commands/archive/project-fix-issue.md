---
name: project-fix-issue
description: "Automatically fix a GitHub issue. Analyzes, plans, implements, tests, and creates PR."
tools: Read, Write, Edit, MultiEdit, Grep, Glob, Bash(git:*), Bash(gh:*), Bash(pytest:*), Bash(ruff:*)
---

# Fix GitHub Issue

Automatically analyze and fix a GitHub issue.

**Issue to fix:** $ARGUMENTS (issue number, e.g., 123)

## Prerequisites

1. GitHub CLI (`gh`) must be installed and authenticated
2. Repository must be linked to GitHub

Check:
```bash
gh auth status
gh repo view
```

## Fix Process

### Step 1: Fetch Issue Details
```bash
gh issue view $ARGUMENTS
```

Extract:
- Issue title
- Description
- Labels
- Related issues/PRs

### Step 2: Analyze Issue

Use **project-manager** subagent:
```
Use the project-manager subagent to:
1. Understand the issue requirements
2. Identify acceptance criteria
3. Estimate complexity
```

### Step 3: Locate Relevant Code
```bash
# Search for keywords from issue
grep -rn "[keywords]" --include="*.py"

# Find related files
```

Use **developer** subagent:
```
Use the developer subagent to:
1. Find code related to this issue
2. Understand the current implementation
3. Identify what needs to change
```

### Step 4: Create Fix Branch
```bash
git checkout -b fix/issue-$ARGUMENTS
```

### Step 5: Create Mini-PRP

Create a lightweight plan for the fix:
```markdown
## Issue Fix Plan: #$ARGUMENTS

**Issue:** [title]
**Root Cause:** [identified cause]
**Fix Approach:** [planned approach]

### Changes Required
1. [Change 1]
2. [Change 2]

### Tests Needed
1. [Test 1]
2. [Test 2]
```

### Step 6: Implement Fix

Use **developer** and **tester** subagents:
1. Write/update tests for the fix
2. Implement the fix
3. Verify tests pass

```bash
# Run related tests
pytest tests/ -k "[related]" -v
```

### Step 7: Validate Fix
```bash
# Lint
ruff check [files]

# Type check
pyright [files]

# All tests
pytest tests/ -v
```

### Step 8: Create Commit
```bash
git add [files]
git commit -m "fix: [description]

Fixes #$ARGUMENTS

- [change 1]
- [change 2]"
```

### Step 9: Create Pull Request
```bash
gh pr create \
  --title "fix: [description]" \
  --body "## Summary
Fixes #$ARGUMENTS

## Changes
- [change 1]
- [change 2]

## Testing
- [test 1]
- [test 2]

## Checklist
- [x] Tests pass
- [x] Lint clean
- [x] Type check clean"
```

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║  ✅ ISSUE FIX COMPLETE                                        ║
╠══════════════════════════════════════════════════════════════╣
║  Issue: #$ARGUMENTS - [title]                                 ║
║  PR: #[pr-number]                                             ║
╠══════════════════════════════════════════════════════════════╣
║  CHANGES                                                      ║
║  ├── Files Modified:  [count]                                 ║
║  ├── Tests Added:     [count]                                 ║
║  └── Lines Changed:   +[add] -[del]                           ║
╠══════════════════════════════════════════════════════════════╣
║  VALIDATION                                                   ║
║  ├── Tests:           ✅ Passing                              ║
║  ├── Lint:            ✅ Clean                                ║
║  └── Types:           ✅ Clean                                ║
╠══════════════════════════════════════════════════════════════╣
║  PR LINK: https://github.com/[repo]/pull/[number]            ║
╠══════════════════════════════════════════════════════════════╣
║  ➡️  NEXT STEPS:                                              ║
║  1. Review PR changes                                         ║
║  2. Request reviews if needed                                 ║
║  3. Merge when approved                                       ║
╚══════════════════════════════════════════════════════════════╝
```

## Error Handling

If GitHub CLI not available:
```
╔══════════════════════════════════════════════════════════════╗
║  ⚠️ GITHUB CLI NOT AVAILABLE                                  ║
╠══════════════════════════════════════════════════════════════╣
║  The gh CLI is required for this command.                     ║
║                                                               ║
║  Install: https://cli.github.com/                            ║
║  Auth: gh auth login                                         ║
╚══════════════════════════════════════════════════════════════╝
```
