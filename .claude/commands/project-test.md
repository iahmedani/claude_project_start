---
name: project-test
description: "Execute comprehensive test cycle including unit, integration, and coverage analysis."
tools: Read, Bash(pytest:*), Bash(python:*), Bash(coverage:*), Bash(npm:*), Bash(npx:*), Bash(vitest:*), Bash(jest:*), Bash(playwright:*)
---

# Execute Test Cycle

Run comprehensive test suite with coverage analysis.

**Test scope:** $ARGUMENTS (defaults to all tests)

## CRITICAL: Read project-config.yaml First

Determine the tech stack before running tests:
```yaml
stack.type           # fullstack, backend, frontend
stack.backend.*      # language, framework
stack.frontend.*     # framework
testing.backend.*    # pytest, vitest, jest
testing.frontend.*   # vitest, jest, playwright
```

## Backend Test Execution (Python)

### Step 1: Quick Smoke Test
```bash
# Fast sanity check
pytest tests/ -x -q --tb=line
```

If smoke test fails, stop and report.

### Step 2: Unit Tests
```bash
pytest tests/unit/ -v --tb=short
```

### Step 3: Integration Tests
```bash
pytest tests/integration/ -v --tb=short
```

### Step 4: Coverage Analysis
```bash
pytest tests/ --cov --cov-report=term-missing --cov-report=html
```

## Frontend Test Execution (Node.js)

### Step 1: Unit Tests
```bash
# Vitest
npm run test

# Or Jest
npm run test
```

### Step 2: Component Tests
```bash
npm run test:components
```

### Step 3: E2E Tests (if configured)
```bash
# Playwright
npx playwright test

# Or Cypress
npx cypress run
```

### Step 4: Coverage Analysis
```bash
npm run test -- --coverage
```

## Use Tester Subagent for Analysis

If tests fail, use **tester** subagent:
```
Use the tester subagent to:
1. Analyze failing tests
2. Identify root cause
3. Suggest fixes
```

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║  🧪 TEST CYCLE COMPLETE                                       ║
╠══════════════════════════════════════════════════════════════╣
║  BACKEND TESTS                                                ║
║  ├── Unit Tests:        [passed]/[total] ✅                   ║
║  ├── Integration:       [passed]/[total] ✅                   ║
║  └── Coverage:          [percent]%                            ║
╠══════════════════════════════════════════════════════════════╣
║  FRONTEND TESTS                                               ║
║  ├── Unit Tests:        [passed]/[total] ✅                   ║
║  ├── Component:         [passed]/[total] ✅                   ║
║  ├── E2E:               [passed]/[total] ✅                   ║
║  └── Coverage:          [percent]%                            ║
╠══════════════════════════════════════════════════════════════╣
║  COVERAGE                                                     ║
║  ├── Threshold:         [threshold]%                          ║
║  └── Status:            [✅ Met / ⚠️ Below]                   ║
╠══════════════════════════════════════════════════════════════╣
║  [If all pass]                                                ║
║  ➡️  NEXT STEP: Run /project-validate for all gates           ║
║                                                               ║
║  [If failures]                                                ║
║  ➡️  FIX REQUIRED: See failing tests above                    ║
╚══════════════════════════════════════════════════════════════╝
```

## Test Commands Reference

### Python (pytest)
| Command | Purpose |
|---------|---------|
| `pytest tests/` | Run all tests |
| `pytest tests/ -x` | Stop on first failure |
| `pytest tests/ -v` | Verbose output |
| `pytest tests/ -k "test_name"` | Run specific test |
| `pytest tests/ --cov` | With coverage |
| `pytest tests/ --pdb` | Debug on failure |

### Node.js (vitest/jest)
| Command | Purpose |
|---------|---------|
| `npm run test` | Run all tests |
| `npm run test -- --watch` | Watch mode |
| `npm run test -- --coverage` | With coverage |
| `npx vitest run [file]` | Run specific file |
| `npx playwright test` | Run E2E tests |
