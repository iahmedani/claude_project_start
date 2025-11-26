---
name: project-tdd
description: "Test-Driven Development workflow. Write tests first, then implement code to pass them."
tools: Read, Write, Edit, Grep, Glob, Bash(pytest:*), Bash(python:*), Bash(ruff:*)
---

# Test-Driven Development (TDD) Workflow

Follow strict TDD cycle: Red → Green → Refactor

**Feature/Component:** $ARGUMENTS

## Prerequisites Check

1. Check for existing PRP in `docs/planning/`
2. If no PRP exists, suggest creating one first
3. Verify test framework is configured (pytest)

## TDD Cycle

### 🔴 RED Phase: Write Failing Tests

#### Step 1: Analyze Requirements
From PRP or $ARGUMENTS, identify:
- Input/output specifications
- Edge cases to handle
- Error conditions

#### Step 2: Create Test File
```bash
# Create test file if not exists
touch tests/test_[feature].py
```

#### Step 3: Write Test Cases
Use the **tester** subagent:
```
Use the tester subagent to:
1. Create comprehensive test cases for [feature]
2. Include happy path tests
3. Include edge case tests
4. Include error handling tests
DO NOT implement any actual code yet.
```

Test structure:
```python
import pytest

class TestFeatureName:
    """Tests for [feature]."""
    
    def test_happy_path_scenario(self):
        """Test normal expected behavior."""
        # Arrange
        # Act
        # Assert
        pass
    
    def test_edge_case_scenario(self):
        """Test boundary conditions."""
        pass
    
    def test_error_handling(self):
        """Test error conditions."""
        pass
```

#### Step 4: Run Tests - Verify They Fail
```bash
pytest tests/test_[feature].py -v --tb=short
```

Expected output: All tests should FAIL (no implementation yet)

```
╔══════════════════════════════════════════════════════════════╗
║  🔴 RED PHASE COMPLETE                                        ║
╠══════════════════════════════════════════════════════════════╣
║  Tests written: [count]                                       ║
║  All failing: ✅ (expected)                                   ║
╠══════════════════════════════════════════════════════════════╣
║  ➡️  Proceeding to GREEN phase...                             ║
╚══════════════════════════════════════════════════════════════╝
```

### 🟢 GREEN Phase: Make Tests Pass

#### Step 5: Implement Minimum Code
Use the **developer** subagent:
```
Use the developer subagent to:
1. Implement the MINIMUM code to make tests pass
2. Do NOT over-engineer
3. Follow existing patterns from the codebase
```

Key principle: Write just enough code to pass the tests.

#### Step 6: Run Tests - Verify They Pass
```bash
pytest tests/test_[feature].py -v
```

Iterate until all tests pass:
- If test fails → fix implementation
- Run tests again
- Repeat until green

```
╔══════════════════════════════════════════════════════════════╗
║  🟢 GREEN PHASE COMPLETE                                      ║
╠══════════════════════════════════════════════════════════════╣
║  Tests passing: [count]/[count]                               ║
║  Coverage: [percent]%                                         ║
╠══════════════════════════════════════════════════════════════╣
║  ➡️  Proceeding to REFACTOR phase...                          ║
╚══════════════════════════════════════════════════════════════╝
```

### 🔵 REFACTOR Phase: Improve Code Quality

#### Step 7: Code Review
Use the **reviewer** subagent:
```
Use the reviewer subagent to:
1. Identify code smells
2. Suggest improvements
3. Check for DRY violations
4. Verify naming conventions
```

#### Step 8: Apply Improvements
- Improve variable/function names
- Extract common logic
- Improve documentation
- NO NEW FUNCTIONALITY

#### Step 9: Verify Tests Still Pass
```bash
pytest tests/test_[feature].py -v
```

CRITICAL: Refactoring must not break tests.

#### Step 10: Run Full Quality Check
```bash
ruff check [files]
pyright [files]
pytest tests/ -v --cov
```

## Output Format

After TDD cycle completion:

```
╔══════════════════════════════════════════════════════════════╗
║  ✅ TDD CYCLE COMPLETE                                        ║
╠══════════════════════════════════════════════════════════════╣
║  Feature: [Feature Name]                                      ║
╠══════════════════════════════════════════════════════════════╣
║  TDD METRICS                                                  ║
║  ├── 🔴 Tests Written:     [count]                            ║
║  ├── 🟢 Tests Passing:     [count]/[count]                    ║
║  ├── 🔵 Refactors Applied: [count]                            ║
║  └── 📊 Coverage:          [percent]%                         ║
╠══════════════════════════════════════════════════════════════╣
║  FILES                                                        ║
║  ├── Test File:  tests/test_[feature].py                     ║
║  └── Source:     src/[feature].py                            ║
╠══════════════════════════════════════════════════════════════╣
║  STEP COMPLETED: TDD Implementation                           ║
║  ───────────────────────────────────────────────────────────  ║
║  ➡️  NEXT STEP: Run /project-review for code review           ║
║                                                               ║
║  Alternatives:                                                ║
║  • /project-validate - Run all quality gates                 ║
║  • /project-tdd [another-feature] - Continue TDD             ║
╚══════════════════════════════════════════════════════════════╝
```

## Best Practices

1. **Small Steps**: Each test should test ONE thing
2. **Fast Tests**: Keep tests fast for rapid feedback
3. **Independent Tests**: Tests should not depend on each other
4. **Clear Names**: Test names should describe the scenario
5. **Arrange-Act-Assert**: Follow AAA pattern consistently
