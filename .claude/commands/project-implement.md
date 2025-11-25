---
name: project-implement
description: "Implement a feature from an existing PRP. Follows test-driven approach with quality gates."
tools: Read, Write, Edit, MultiEdit, Grep, Glob, Bash(git:*), Bash(pytest:*), Bash(python:*), Bash(ruff:*), Bash(pyright:*)
---

# Execute Implementation from PRP

Implement a feature following a Product Requirements Prompt.

**PRP to execute:** $ARGUMENTS

## Prerequisites Check

### Required
1. ✅ PRP file exists in `docs/planning/`
2. ✅ Project initialized (check `.claude/workflow/STATE.md`)

### Recommended
3. 🔶 `/primer` has been run (codebase analysis)
4. 🔶 Architecture reviewed (architect subagent)

If no $ARGUMENTS provided, list available PRPs:
```bash
ls -la docs/planning/PRP-*.md 2>/dev/null || echo "No PRPs found. Run /project:plan first."
```

## Implementation Workflow

### Phase 1: Load and Validate PRP

1. Read the specified PRP file
2. Display requirements summary
3. Confirm implementation scope with user

### Phase 2: Test-Driven Development (TDD)

#### Step 2.1: Create Test Scaffolding
Use the **tester** subagent:
```
Use the tester subagent to:
1. Create test files based on acceptance criteria in [PRP]
2. Write failing tests for each requirement
3. Set up any required fixtures
```

#### Step 2.2: Verify Tests Fail
```bash
pytest tests/test_[feature].py -v --tb=short
```
Expected: All tests should fail (no implementation yet)

### Phase 3: Implementation

#### Step 3.1: Implement Core Functionality
Use the **developer** subagent for each component:
```
Use the developer subagent to:
1. Implement [Component] following pattern in [path/to/example.py]
2. Add type hints for all functions
3. Include docstrings
```

#### Step 3.2: Run Tests After Each Component
```bash
pytest tests/test_[feature].py -v
```

#### Step 3.3: Iterate Until Tests Pass
Repeat implementation → test cycle until all tests pass.

### Phase 4: Quality Verification

#### Step 4.1: Lint Check
```bash
ruff check [files]
ruff format [files]
```

#### Step 4.2: Type Check
```bash
pyright [files]
```

#### Step 4.3: Full Test Suite
```bash
pytest tests/ -v --cov
```

### Phase 5: Code Review

Use the **reviewer** subagent:
```
Use the reviewer subagent to review:
1. Code quality and patterns
2. Test coverage completeness
3. Documentation quality
```

Address any critical issues found.

### Phase 6: Validation Gates

Use the **validation-gates** subagent:
```
Use the validation-gates subagent to verify all quality gates pass.
```

All gates must be ✅:
- [ ] All tests passing
- [ ] Linting clean
- [ ] Type checking clean
- [ ] Coverage threshold met
- [ ] No security issues

### Phase 7: Documentation

Use the **documenter** subagent:
```
Use the documenter subagent to:
1. Update README if needed
2. Add/update module docstrings
3. Update CHANGELOG
```

### Phase 8: Commit and Update

1. **Stage Changes**
```bash
git add [files]
```

2. **Create Commit**
```bash
git commit -m "feat: [description based on PRP]

- Implements [Feature Name]
- Closes #[issue if linked]

See: docs/planning/PRP-[slug].md"
```

3. **Update PRP Status**
Change PRP status to ✅ Completed

4. **Update Workflow State**
Mark implementation steps as complete in STATE.md

## Output Format

After completion:

```
╔══════════════════════════════════════════════════════════════╗
║  ✅ IMPLEMENTATION COMPLETE                                   ║
╠══════════════════════════════════════════════════════════════╣
║  Feature: [Feature Name]                                      ║
║  PRP: docs/planning/PRP-[slug].md                            ║
╠══════════════════════════════════════════════════════════════╣
║  SUMMARY                                                      ║
║  ├── Files Created:  [count]                                  ║
║  ├── Files Modified: [count]                                  ║
║  ├── Tests:          [count] passing                          ║
║  └── Coverage:       [percent]%                               ║
╠══════════════════════════════════════════════════════════════╣
║  COMMIT: [hash] - feat: [description]                        ║
╠══════════════════════════════════════════════════════════════╣
║  STEP COMPLETED: Implementation                               ║
║  ───────────────────────────────────────────────────────────  ║
║  ➡️  NEXT STEP: Run /project:review for final review          ║
║                                                               ║
║  Alternatives:                                                ║
║  • /project:validate - Run all validation gates              ║
║  • /project:deploy - Prepare for deployment                  ║
╚══════════════════════════════════════════════════════════════╝
```

## Error Handling

If implementation fails at any step:
1. Report which step failed
2. Show error details
3. Suggest remediation
4. Offer to retry or rollback

```
╔══════════════════════════════════════════════════════════════╗
║  ⚠️  IMPLEMENTATION BLOCKED                                   ║
╠══════════════════════════════════════════════════════════════╣
║  Failed at: [step name]                                       ║
║  Error: [error message]                                       ║
╠══════════════════════════════════════════════════════════════╣
║  SUGGESTED ACTIONS:                                           ║
║  1. [Fix suggestion]                                          ║
║  2. [Alternative approach]                                    ║
╚══════════════════════════════════════════════════════════════╝
```
