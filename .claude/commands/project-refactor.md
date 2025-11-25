---
name: project-refactor
description: "Safe code refactoring workflow with tests as safety net. Preserves behavior while improving structure."
tools: Read, Write, Edit, MultiEdit, Grep, Glob, Bash(pytest:*), Bash(git:*), Bash(ruff:*)
---

# Safe Refactoring Workflow

Refactor code safely using tests as a safety net.

**Target to refactor:** $ARGUMENTS

## Prerequisites Check

1. **Tests exist** for the target area
2. **All tests pass** before refactoring
3. **Clean git state** (commit or stash changes)

If tests don't exist:
```
⚠️ No tests found for this area.
Recommendation: Run /project:tdd $ARGUMENTS first to create tests.
```

## Refactoring Process

### Step 1: Verify Safety Net
```bash
# Run tests for target area
pytest tests/ -k "[related tests]" -v

# Verify all pass
echo "All tests must pass before refactoring"
```

### Step 2: Analyze Current State

Use **reviewer** subagent:
```
Use the reviewer subagent to analyze $ARGUMENTS and identify:
1. Code smells
2. DRY violations
3. Complex functions that should be split
4. Naming improvements
5. Pattern violations
```

### Step 3: Create Refactoring Plan

Document planned changes:
1. What will change
2. Why it's an improvement
3. Risk assessment

### Step 4: Refactor Incrementally

For each change:
1. Make ONE small refactoring change
2. Run tests immediately
3. If tests pass → continue
4. If tests fail → revert and reconsider

```bash
# After each refactor step
pytest tests/ -k "[related tests]" -v --tb=short
```

### Step 5: Quality Verification
```bash
# Lint check
ruff check [files]

# Type check
pyright [files]

# Full test suite
pytest tests/ -v --cov
```

### Step 6: Commit Refactoring
```bash
git add [files]
git commit -m "refactor: [description]

- [change 1]
- [change 2]

No functional changes."
```

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║  ✅ REFACTORING COMPLETE                                      ║
╠══════════════════════════════════════════════════════════════╣
║  Target: [refactored area]                                    ║
╠══════════════════════════════════════════════════════════════╣
║  CHANGES MADE                                                 ║
║  ├── Files Modified:  [count]                                 ║
║  ├── Functions:       [extracted/renamed/merged]              ║
║  └── Lines:           [before] → [after]                      ║
╠══════════════════════════════════════════════════════════════╣
║  QUALITY                                                      ║
║  ├── Tests:           ✅ All passing                          ║
║  ├── Coverage:        [before]% → [after]%                    ║
║  └── Complexity:      [before] → [after]                      ║
╠══════════════════════════════════════════════════════════════╣
║  STEP COMPLETED: Refactoring                                  ║
║  ───────────────────────────────────────────────────────────  ║
║  ➡️  NEXT STEP: Run /project:review to verify quality         ║
╚══════════════════════════════════════════════════════════════╝
```

## Refactoring Types Supported

| Type | Description |
|------|-------------|
| Extract Function | Split large function into smaller ones |
| Rename | Improve naming for clarity |
| Move | Relocate code to better module |
| Inline | Remove unnecessary abstraction |
| Extract Class | Create class from related functions |
| Simplify | Reduce complexity |
