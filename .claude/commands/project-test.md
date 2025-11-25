---
name: project-test
description: "Execute comprehensive test cycle including unit, integration, and coverage analysis."
tools: Read, Bash(pytest:*), Bash(python:*), Bash(coverage:*)
---

# Execute Test Cycle

Run comprehensive test suite with coverage analysis.

**Test scope:** $ARGUMENTS (defaults to all tests)

## Test Execution

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

### Step 5: Use Tester Subagent for Analysis

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
║  TEST RESULTS                                                 ║
║  ├── Unit Tests:        [passed]/[total] ✅                   ║
║  ├── Integration:       [passed]/[total] ✅                   ║
║  └── Total:             [passed]/[total]                      ║
╠══════════════════════════════════════════════════════════════╣
║  COVERAGE                                                     ║
║  ├── Overall:           [percent]%                            ║
║  ├── Threshold:         [threshold]%                          ║
║  └── Status:            [✅ Met / ⚠️ Below]                   ║
╠══════════════════════════════════════════════════════════════╣
║  UNCOVERED FILES (if any)                                     ║
║  • [file]: [percent]%                                         ║
╠══════════════════════════════════════════════════════════════╣
║  [If all pass]                                                ║
║  ➡️  NEXT STEP: Run /project:validate for all gates           ║
║                                                               ║
║  [If failures]                                                ║
║  ➡️  FIX REQUIRED: See failing tests above                    ║
╚══════════════════════════════════════════════════════════════╝
```

## Test Commands Reference

| Command | Purpose |
|---------|---------|
| `pytest tests/` | Run all tests |
| `pytest tests/ -x` | Stop on first failure |
| `pytest tests/ -v` | Verbose output |
| `pytest tests/ -k "test_name"` | Run specific test |
| `pytest tests/ --cov` | With coverage |
| `pytest tests/ --pdb` | Debug on failure |
