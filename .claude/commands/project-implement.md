---
name: project-implement
description: "Implement a feature from an existing PRP. Follows test-driven approach with quality gates."
tools: Read, Write, Edit, MultiEdit, Grep, Glob, Bash(git:*), Bash(pytest:*), Bash(python:*), Bash(ruff:*), Bash(pyright:*), Bash(npm:*), Bash(npx:*), Bash(node:*), Bash(vitest:*), Bash(playwright:*), Bash(tsc:*), Bash(eslint:*), Bash(prettier:*)
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
ls -la docs/planning/PRP-*.md 2>/dev/null || echo "No PRPs found. Run /project-plan first."
```

## CRITICAL: Read project-config.yaml First

**Before implementing, determine the tech stack:**
```yaml
# Check these sections:
stack.backend.language    # python, typescript, go, etc.
stack.backend.framework   # fastapi, express, nestjs, etc.
stack.frontend.framework  # react, vue, svelte, etc.
stack.frontend.meta_framework  # nextjs, nuxt, etc.
testing.backend.framework # pytest, vitest, jest
testing.frontend.unit     # vitest, jest
testing.frontend.e2e      # playwright, cypress
```

## Implementation Workflow

### Phase 1: Load and Validate PRP

1. Read the specified PRP file
2. Read `project-config.yaml` to understand tech stack
3. Display requirements summary
4. Confirm implementation scope with user

### Phase 2: Backend Implementation (if applicable)

**Skip if project has no backend (frontend-only)**

#### Step 2.1: Create Backend Tests
Use the **tester** subagent:
```
Use the tester subagent to:
1. Create test files for backend based on PRP acceptance criteria
2. Use the testing framework from project-config.yaml (pytest/vitest/jest)
3. Write failing tests for each API endpoint/service
4. Set up any required fixtures
```

#### Step 2.2: Run Backend Tests - Verify Failure
```bash
# For Python
pytest tests/ -v --tb=short

# For Node.js
npm run test
```

#### Step 2.3: Implement Backend
Use the **developer** subagent:
```
Use the developer subagent to:
1. Implement API routes/endpoints per PRP
2. Implement services/business logic
3. Implement data models and repositories
4. Follow patterns from project-config.yaml
```

#### Step 2.4: Run Backend Tests - Verify Pass
```bash
# For Python
pytest tests/ -v --cov

# For Node.js
npm run test -- --coverage
```

### Phase 3: Frontend Implementation (if applicable)

**Skip if project has no frontend (API-only)**

#### Step 3.1: Create Frontend Tests
Use the **tester** subagent:
```
Use the tester subagent to:
1. Create component tests using testing framework from project-config.yaml
2. Write unit tests for hooks/stores
3. Write component tests for UI components
4. Set up test utilities and mocks
```

#### Step 3.2: Run Frontend Tests - Verify Failure
```bash
# Vitest
npm run test

# Or Jest
npm run test
```

#### Step 3.3: Implement Frontend
Use the **frontend-developer** subagent:
```
Use the frontend-developer subagent to:
1. Create UI components per PRP specifications
2. Implement state management (stores/hooks)
3. Create pages/routes
4. Implement API client/data fetching
5. Apply styling per design requirements
```

#### Step 3.4: Run Frontend Tests - Verify Pass
```bash
npm run test
```

### Phase 4: Integration Testing

#### Step 4.1: E2E Tests (if configured in project-config.yaml)
```bash
# Playwright
npx playwright test

# Or Cypress
npx cypress run
```

### Phase 5: Quality Verification

#### Backend Quality (Python)
```bash
ruff check .
ruff format --check .
pyright
pytest --cov --cov-fail-under=80
```

#### Backend Quality (Node.js)
```bash
npm run lint
npm run type-check
npm run test -- --coverage
```

#### Frontend Quality
```bash
npm run lint
npm run type-check  # tsc --noEmit
npm run test
npm run build
```

### Phase 6: Code Review

Use the **reviewer** subagent:
```
Use the reviewer subagent to review:
1. Backend code quality and patterns
2. Frontend code quality and patterns
3. Test coverage completeness
4. API contract correctness
5. Documentation quality
```

### Phase 7: Validation Gates

Use the **validation-gates** subagent:
```
Use the validation-gates subagent to verify all quality gates pass
for BOTH backend and frontend as specified in project-config.yaml.
```

All gates must be ✅:

**Backend:**
- [ ] All backend tests passing
- [ ] Linting clean (ruff/eslint)
- [ ] Type checking clean (pyright/tsc)
- [ ] Coverage threshold met

**Frontend:**
- [ ] All frontend tests passing
- [ ] Linting clean (eslint)
- [ ] Type checking clean (tsc)
- [ ] Build succeeds
- [ ] E2E tests passing (if configured)

### Phase 8: Documentation & Commit

1. **Update Documentation**
   - README if needed
   - API documentation
   - CHANGELOG

2. **Stage and Commit**
```bash
git add .
git commit -m "feat: [Feature Name]

Implements [description from PRP]
- Backend: [summary]
- Frontend: [summary]

See: docs/planning/PRP-[slug].md"
```

3. **Update PRP Status** to ✅ Completed

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║  ✅ IMPLEMENTATION COMPLETE                                   ║
╠══════════════════════════════════════════════════════════════╣
║  Feature: [Feature Name]                                      ║
║  PRP: docs/planning/PRP-[slug].md                            ║
╠══════════════════════════════════════════════════════════════╣
║  BACKEND                                                      ║
║  ├── Files Created:  [count]                                  ║
║  ├── Tests:          [count] passing                          ║
║  └── Coverage:       [percent]%                               ║
╠══════════════════════════════════════════════════════════════╣
║  FRONTEND                                                     ║
║  ├── Components:     [count]                                  ║
║  ├── Tests:          [count] passing                          ║
║  └── Build:          ✅ Success                                ║
╠══════════════════════════════════════════════════════════════╣
║  ➡️  NEXT: /project-validate or /project-review               ║
╚══════════════════════════════════════════════════════════════╝
```
