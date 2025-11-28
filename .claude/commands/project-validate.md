---
name: project-validate
description: "Run all quality gates to validate code is ready for merge/deployment. Final checkpoint before release."
tools: Read, Bash(pytest:*), Bash(ruff:*), Bash(pyright:*), Bash(npm:*), Bash(npx:*), Bash(tsc:*), Bash(eslint:*), Bash(vitest:*), Bash(git:*)
---

# Validate Quality Gates

Run all quality gates to ensure code is ready for merge/deployment.

## CRITICAL: Read project-config.yaml First

Determine the tech stack to know which gates to run:
```yaml
stack.type           # fullstack, backend, frontend
stack.backend.*      # language (python/typescript)
stack.frontend.*     # framework
```

## Prerequisites

This is typically run after:
1. Implementation complete (`/project-implement`)
2. Tests passing (`/project-test`)

---

## Backend Validation Gates (Python)

### Gate 1: Linting

```bash
echo "🔍 Running Python linter..."
ruff check . --fix
ruff format .
```

### Gate 2: Type Checking

```bash
echo "🔍 Running Python type checker..."
pyright .
```

### Gate 3: Unit Tests

```bash
echo "🔍 Running Python unit tests..."
pytest tests/unit/ -v --tb=short
```

### Gate 4: Integration Tests

```bash
echo "🔍 Running Python integration tests..."
pytest tests/integration/ -v --tb=short
```

### Gate 5: Test Coverage

```bash
echo "🔍 Checking Python coverage..."
pytest --cov --cov-report=term-missing --cov-fail-under=80
```

---

## Frontend Validation Gates (Node.js)

### Gate 1: Linting

```bash
echo "🔍 Running ESLint..."
npm run lint
```

### Gate 2: Type Checking

```bash
echo "🔍 Running TypeScript type check..."
npx tsc --noEmit
```

### Gate 3: Unit/Component Tests

```bash
echo "🔍 Running frontend tests..."
npm run test
```

### Gate 4: Build

```bash
echo "🔍 Building frontend..."
npm run build
```

### Gate 5: E2E Tests (if configured)

```bash
echo "🔍 Running E2E tests..."
npx playwright test
```

---

## Common Gates (All Projects)

### Gate: Security Check

Use the **reviewer** subagent to check for security issues:
```
Use the reviewer subagent to perform a security check:
1. No secrets/credentials in code
2. No vulnerable patterns (SQL injection, XSS)
3. Dependencies are secure
```

### Gate: Documentation

Check documentation is current:
- [ ] README up to date
- [ ] Docstrings/JSDoc present
- [ ] CHANGELOG updated

### Gate: Git Status

```bash
echo "🔍 Checking git status..."
git status --porcelain
```

Expected: All changes committed

---

## Output Format

After validation:

```
╔══════════════════════════════════════════════════════════════╗
║  🎯 VALIDATION COMPLETE                                       ║
╠══════════════════════════════════════════════════════════════╣
║  BACKEND QUALITY GATES                                        ║
║  ├── Linting (ruff):      [✅]                                ║
║  ├── Type Check (pyright):[✅]                                ║
║  ├── Unit Tests:          [✅]                                ║
║  ├── Integration Tests:   [✅]                                ║
║  └── Coverage:            [✅] 85%                            ║
╠══════════════════════════════════════════════════════════════╣
║  FRONTEND QUALITY GATES                                       ║
║  ├── Linting (eslint):    [✅]                                ║
║  ├── Type Check (tsc):    [✅]                                ║
║  ├── Tests:               [✅]                                ║
║  ├── Build:               [✅]                                ║
║  └── E2E Tests:           [✅]                                ║
╠══════════════════════════════════════════════════════════════╣
║  COMMON GATES                                                 ║
║  ├── Security:            [✅]                                ║
║  ├── Documentation:       [✅]                                ║
║  └── Git Status:          [✅] Clean                          ║
╠══════════════════════════════════════════════════════════════╣
║  RESULT: ✅ ALL GATES PASSED                                  ║
╠══════════════════════════════════════════════════════════════╣
║  ➡️  READY FOR: PR creation or deployment                     ║
║                                                               ║
║  Options:                                                     ║
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
║  ├── Linting:             [✅]                                ║
║  ├── Type Check:          [✅]                                ║
║  ├── Unit Tests:          [❌] 2 failed                       ║
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
