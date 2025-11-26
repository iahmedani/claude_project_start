---
name: project-validate
description: "Run all quality gates to validate code is ready for merge/deployment. Final checkpoint before release."
tools: Read, Bash(pytest:*), Bash(ruff:*), Bash(pyright:*), Bash(git:*)
---

# Validate Quality Gates

Run all quality gates to ensure code is ready for merge/deployment.

## Prerequisites

This is typically run after:
1. Implementation complete (`/project-implement`)
2. Code review passed (`/project-review`)

## Validation Gates

### Gate 1: Linting ✅

```bash
echo "🔍 Running linter..."
ruff check . --fix
ruff format .
```

Expected: No errors
```
╔═══════════════════════════════════════╗
║  Gate 1: Linting       [✅ PASSED]    ║
║  Errors: 0                            ║
╚═══════════════════════════════════════╝
```

### Gate 2: Type Checking ✅

```bash
echo "🔍 Running type checker..."
pyright .
```

Expected: No type errors
```
╔═══════════════════════════════════════╗
║  Gate 2: Type Check    [✅ PASSED]    ║
║  Errors: 0                            ║
╚═══════════════════════════════════════╝
```

### Gate 3: Unit Tests ✅

```bash
echo "🔍 Running unit tests..."
pytest tests/unit/ -v --tb=short
```

Expected: All tests pass
```
╔═══════════════════════════════════════╗
║  Gate 3: Unit Tests    [✅ PASSED]    ║
║  Tests: XX passed, 0 failed           ║
╚═══════════════════════════════════════╝
```

### Gate 4: Integration Tests ✅

```bash
echo "🔍 Running integration tests..."
pytest tests/integration/ -v --tb=short
```

Expected: All tests pass
```
╔═══════════════════════════════════════╗
║  Gate 4: Integration   [✅ PASSED]    ║
║  Tests: XX passed, 0 failed           ║
╚═══════════════════════════════════════╝
```

### Gate 5: Test Coverage ✅

```bash
echo "🔍 Checking coverage..."
pytest --cov --cov-report=term-missing --cov-fail-under=80
```

Expected: Coverage >= threshold (default 80%)
```
╔═══════════════════════════════════════╗
║  Gate 5: Coverage      [✅ PASSED]    ║
║  Coverage: XX%  (threshold: 80%)      ║
╚═══════════════════════════════════════╝
```

### Gate 6: Security Check ✅

Use the **security-auditor** subagent:
```
Use the security-auditor subagent to perform a final security check.
Focus on:
1. No secrets in code
2. No vulnerable dependencies
3. Safe patterns used
```

```
╔═══════════════════════════════════════╗
║  Gate 6: Security      [✅ PASSED]    ║
║  Vulnerabilities: 0                   ║
╚═══════════════════════════════════════╝
```

### Gate 7: Documentation ✅

Check documentation is current:
- [ ] README up to date
- [ ] Docstrings present
- [ ] CHANGELOG updated

```
╔═══════════════════════════════════════╗
║  Gate 7: Documentation [✅ PASSED]    ║
║  All docs current                     ║
╚═══════════════════════════════════════╝
```

### Gate 8: Git Status ✅

```bash
echo "🔍 Checking git status..."
git status --porcelain
```

Expected: All changes committed
```
╔═══════════════════════════════════════╗
║  Gate 8: Git Status    [✅ PASSED]    ║
║  All changes committed                ║
╚═══════════════════════════════════════╝
```

## Output Format

After validation:

```
╔══════════════════════════════════════════════════════════════╗
║  🎯 VALIDATION COMPLETE                                       ║
╠══════════════════════════════════════════════════════════════╣
║  QUALITY GATES                                                ║
║  ├── Gate 1: Linting         [✅]                             ║
║  ├── Gate 2: Type Check      [✅]                             ║
║  ├── Gate 3: Unit Tests      [✅]                             ║
║  ├── Gate 4: Integration     [✅]                             ║
║  ├── Gate 5: Coverage        [✅] 85%                         ║
║  ├── Gate 6: Security        [✅]                             ║
║  ├── Gate 7: Documentation   [✅]                             ║
║  └── Gate 8: Git Status      [✅]                             ║
╠══════════════════════════════════════════════════════════════╣
║  RESULT: ✅ ALL GATES PASSED                                  ║
╠══════════════════════════════════════════════════════════════╣
║  STEP COMPLETED: Validation                                   ║
║  ───────────────────────────────────────────────────────────  ║
║  ➡️  NEXT STEP: Run /project-deploy for deployment prep       ║
║                                                               ║
║  Alternatives:                                                ║
║  • Create PR: gh pr create                                   ║
║  • Tag release: git tag v[version]                           ║
╚══════════════════════════════════════════════════════════════╝
```

## Failure Handling

If any gate fails:

```
╔══════════════════════════════════════════════════════════════╗
║  ❌ VALIDATION FAILED                                         ║
╠══════════════════════════════════════════════════════════════╣
║  QUALITY GATES                                                ║
║  ├── Gate 1: Linting         [✅]                             ║
║  ├── Gate 2: Type Check      [✅]                             ║
║  ├── Gate 3: Unit Tests      [❌] 2 failed                    ║
║  └── (remaining gates skipped)                                ║
╠══════════════════════════════════════════════════════════════╣
║  FAILED GATE: Unit Tests                                      ║
║  ───────────────────────────────────────────────────────────  ║
║  Failures:                                                    ║
║  • test_feature.py::test_edge_case - AssertionError          ║
║  • test_feature.py::test_error - ValueError                  ║
╠══════════════════════════════════════════════════════════════╣
║  ➡️  FIX REQUIRED: Fix failing tests, then run again          ║
╚══════════════════════════════════════════════════════════════╝
```

## Using validation-gates Subagent

For comprehensive validation, delegate to **validation-gates** subagent:
```
Use the validation-gates subagent to run all quality gates and report status.
```
