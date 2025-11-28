# Testing & TDD Skill

> **Related**: `react-development` (React Testing Library), `api-design` (API testing)

## Philosophy

Test-Driven Development (TDD) is the preferred approach:

1. **Red**: Write a failing test first
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve while keeping tests green

## Python Testing with pytest

### Basic Test Structure

```python
import pytest
from src.module import function_under_test


class TestFunctionUnderTest:
    """Tests for function_under_test."""

    def test_basic_functionality(self):
        """Test the happy path."""
        result = function_under_test(valid_input)
        assert result == expected_output

    def test_edge_case_empty_input(self):
        """Test behavior with empty input."""
        result = function_under_test("")
        assert result is None

    def test_raises_on_invalid_input(self):
        """Test that invalid input raises ValueError."""
        with pytest.raises(ValueError, match="Invalid input"):
            function_under_test(invalid_input)
```

### Fixtures

```python
@pytest.fixture
def sample_data():
    """Provide sample data for tests."""
    return {
        "id": 1,
        "name": "Test",
        "active": True
    }

@pytest.fixture
def mock_database(mocker):
    """Mock database connection."""
    mock_db = mocker.Mock()
    mock_db.query.return_value = []
    return mock_db
```

### Parameterized Tests

```python
@pytest.mark.parametrize("input_val,expected", [
    (1, "one"),
    (2, "two"),
    (3, "three"),
])
def test_number_to_word(input_val, expected):
    assert number_to_word(input_val) == expected
```

## Test Categories

### Unit Tests

- Test individual functions/methods
- Mock external dependencies
- Fast execution (<100ms each)

### Integration Tests

- Test component interactions
- Use real dependencies where practical
- Mark with `@pytest.mark.integration`

### End-to-End Tests

- Test full workflows
- Use test fixtures/containers
- Mark with `@pytest.mark.e2e`

## Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific category
pytest -m "not integration"

# Run single test file
pytest tests/test_specific.py -v

# Run matching tests
pytest -k "test_user"
```

## JavaScript Testing with Vitest

### Basic Test Structure

```typescript
import { describe, it, expect, vi } from "vitest";
import { calculateDiscount } from "./pricing";

describe("calculateDiscount", () => {
  it("should apply percentage discount correctly", () => {
    const result = calculateDiscount(100, 20);
    expect(result).toBe(80);
  });

  it("should throw for invalid discount percentage", () => {
    expect(() => calculateDiscount(100, -10)).toThrow("Invalid discount");
  });
});
```

### Mocking

```typescript
import { vi } from "vitest";

// Mock module
vi.mock("./api", () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: "Test" }),
}));

// Mock function
const mockFn = vi.fn().mockReturnValue("mocked");
```

### React Testing Library

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Test Organization

### File Structure

```
src/
├── services/
│   ├── user.ts
│   └── user.test.ts        # Co-located tests
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx
└── __tests__/              # Integration tests
    └── auth.integration.test.ts
```

## Coverage Requirements

- Minimum: 80% coverage
- Critical paths: 95% coverage
- Exclude: `__init__.py`, migrations, config, `*.d.ts`

## Best Practices

1. **One assertion per test** (when possible)
2. **Descriptive test names** that explain what's being tested
3. **AAA Pattern**: Arrange, Act, Assert
4. **Don't test implementation** - test behavior
5. **Use fixtures** for setup, not copy-paste
6. **Mock external services** - don't hit real APIs
7. **Keep tests fast** - slow tests don't get run
8. **Co-locate tests** - tests live next to the code they test
