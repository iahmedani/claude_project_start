---
name: project-tdd
description: "Test-Driven Development workflow. Write tests first, then implement code to pass them."
tools: Read, Write, Edit, Grep, Glob, Bash(pytest:*), Bash(python:*), Bash(ruff:*), Bash(pyright:*), Bash(npm:*), Bash(npx:*), Bash(node:*), Bash(vitest:*), Bash(playwright:*), Bash(tsc:*), Bash(eslint:*), Bash(prettier:*)
---

# Test-Driven Development (TDD) Workflow

Follow strict TDD cycle: Red → Green → Refactor

**Feature/Component:** $ARGUMENTS

## Prerequisites Check

1. Check for existing PRP in `docs/planning/`
2. If no PRP exists, suggest creating one first
3. **Read project-config.yaml to determine tech stack**

## CRITICAL: Determine Stack First

```yaml
# From project-config.yaml:
stack.type           # fullstack, backend, frontend, api
stack.backend.*      # language, framework
stack.frontend.*     # framework, meta_framework
testing.backend.*    # pytest, vitest, jest
testing.frontend.*   # vitest, jest, testing-library, playwright
```

**This determines which TDD workflow to follow:**
- `fullstack` → Backend TDD + Frontend TDD
- `backend` or `api` → Backend TDD only
- `frontend` → Frontend TDD only

---

## Backend TDD Cycle (Python/Node.js)

### 🔴 RED Phase: Write Failing Backend Tests

#### Step 1: Analyze Requirements
From PRP, identify for backend:
- API endpoints and their contracts
- Services and business logic
- Data models and validation
- Error conditions

#### Step 2: Create Backend Test Files
```bash
# Python
mkdir -p tests && touch tests/test_[feature].py

# Node.js
mkdir -p tests && touch tests/[feature].test.ts
```

#### Step 3: Write Backend Tests
Use the **tester** subagent:
```
Use the tester subagent to:
1. Create comprehensive API/service tests for [feature]
2. Use testing framework from project-config.yaml (pytest/vitest/jest)
3. Include tests for:
   - API endpoint responses
   - Service business logic
   - Data validation
   - Error handling
   - Edge cases
DO NOT implement any actual code yet.
```

**Python (pytest) example:**
```python
import pytest
from httpx import AsyncClient

class TestFeatureAPI:
    async def test_create_returns_201(self, client: AsyncClient):
        response = await client.post("/api/v1/items", json={"name": "test"})
        assert response.status_code == 201

    async def test_create_validates_input(self, client: AsyncClient):
        response = await client.post("/api/v1/items", json={})
        assert response.status_code == 422
```

**Node.js (vitest) example:**
```typescript
import { describe, it, expect } from 'vitest'

describe('FeatureService', () => {
  it('should create item successfully', async () => {
    const result = await service.create({ name: 'test' })
    expect(result.id).toBeDefined()
  })
})
```

#### Step 4: Run Backend Tests - Verify Failure
```bash
# Python
pytest tests/test_[feature].py -v --tb=short

# Node.js
npm run test -- tests/[feature].test.ts
```

Expected: All tests FAIL (no implementation yet)

### 🟢 GREEN Phase: Implement Backend

#### Step 5: Implement Minimum Backend Code
Use the **developer** subagent:
```
Use the developer subagent to:
1. Implement MINIMUM code to make backend tests pass
2. Create models, services, routes as needed
3. Follow patterns from project-config.yaml
4. Do NOT over-engineer
```

#### Step 6: Run Backend Tests Until Green
```bash
# Python
pytest tests/test_[feature].py -v

# Node.js
npm run test
```

---

## Frontend TDD Cycle (React/Vue/etc.)

### 🔴 RED Phase: Write Failing Frontend Tests

#### Step 1: Analyze Requirements
From PRP, identify for frontend:
- Components needed
- User interactions
- State management
- API integrations

#### Step 2: Create Frontend Test Files
```bash
# Component tests
touch src/components/[Component].test.tsx

# Hook tests
touch src/hooks/use[Feature].test.ts

# Store tests
touch src/stores/[feature]-store.test.ts
```

#### Step 3: Write Frontend Tests
Use the **tester** subagent:
```
Use the tester subagent to:
1. Create component tests using testing-library
2. Create hook tests using @testing-library/react-hooks or renderHook
3. Create store tests
4. Use testing framework from project-config.yaml (vitest/jest)
DO NOT implement any components yet.
```

**React component test example (vitest + testing-library):**
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TodoItem } from './TodoItem'

describe('TodoItem', () => {
  it('renders todo title', () => {
    render(<TodoItem todo={{ id: '1', title: 'Test' }} />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('calls onComplete when checkbox clicked', () => {
    const onComplete = vi.fn()
    render(<TodoItem todo={{ id: '1', title: 'Test' }} onComplete={onComplete} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onComplete).toHaveBeenCalledWith('1')
  })
})
```

#### Step 4: Run Frontend Tests - Verify Failure
```bash
npm run test
```

Expected: All tests FAIL

### 🟢 GREEN Phase: Implement Frontend

#### Step 5: Implement Minimum Frontend Code
Use the **frontend-developer** subagent:
```
Use the frontend-developer subagent to:
1. Implement MINIMUM code to make frontend tests pass
2. Create components with proper types
3. Implement hooks and stores
4. Do NOT add extra features
```

#### Step 6: Run Frontend Tests Until Green
```bash
npm run test
```

---

## 🔵 REFACTOR Phase (Both Backend & Frontend)

#### Step 7: Code Review
Use the **reviewer** subagent:
```
Use the reviewer subagent to:
1. Identify code smells in both backend and frontend
2. Suggest DRY improvements
3. Check naming conventions
4. Verify patterns consistency
```

#### Step 8: Apply Improvements
- Improve variable/function names
- Extract common logic
- Improve documentation
- **NO NEW FUNCTIONALITY**

#### Step 9: Verify All Tests Still Pass
```bash
# Backend (Python)
pytest tests/ -v

# Frontend
npm run test

# E2E (if applicable)
npx playwright test
```

CRITICAL: Refactoring must not break any tests.

---

## Full Quality Check

```bash
# Backend (Python)
ruff check .
ruff format --check .
pyright
pytest tests/ -v --cov

# Frontend
npm run lint
npm run type-check
npm run test
npm run build
```

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║  ✅ TDD CYCLE COMPLETE                                        ║
╠══════════════════════════════════════════════════════════════╣
║  Feature: [Feature Name]                                      ║
╠══════════════════════════════════════════════════════════════╣
║  BACKEND TDD                                                  ║
║  ├── 🔴 Tests Written:     [count]                            ║
║  ├── 🟢 Tests Passing:     [count]/[count]                    ║
║  └── 📊 Coverage:          [percent]%                         ║
╠══════════════════════════════════════════════════════════════╣
║  FRONTEND TDD                                                 ║
║  ├── 🔴 Tests Written:     [count]                            ║
║  ├── 🟢 Tests Passing:     [count]/[count]                    ║
║  └── 📊 Coverage:          [percent]%                         ║
╠══════════════════════════════════════════════════════════════╣
║  🔵 Refactors Applied:     [count]                            ║
╠══════════════════════════════════════════════════════════════╣
║  ➡️  NEXT: /project-review or /project-validate               ║
╚══════════════════════════════════════════════════════════════╝
```

## TDD Best Practices

1. **Small Steps**: Each test should test ONE thing
2. **Fast Tests**: Keep tests fast for rapid feedback
3. **Independent Tests**: Tests should not depend on each other
4. **Clear Names**: Test names should describe the scenario
5. **Arrange-Act-Assert**: Follow AAA pattern consistently
6. **Backend First**: For fullstack, start with API/backend tests
7. **Mock APIs**: Frontend tests should mock API calls
8. **Test Behavior**: Test what component does, not implementation
