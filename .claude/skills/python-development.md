# Python Development Skill

This skill provides Claude with best practices for Python development.

## Coding Standards

### File Structure
```
project/
├── src/
│   └── package_name/
│       ├── __init__.py
│       ├── main.py
│       ├── models/
│       ├── services/
│       ├── utils/
│       └── api/
├── tests/
│   ├── conftest.py
│   ├── test_main.py
│   └── ...
├── pyproject.toml
├── README.md
└── .gitignore
```

### Type Hints (Always Use)
```python
from typing import Optional, Any
from collections.abc import Sequence

def process_items(
    items: Sequence[dict[str, Any]],
    limit: Optional[int] = None
) -> list[dict[str, Any]]:
    """Process items with optional limit."""
    pass
```

### Pydantic Models
```python
from pydantic import BaseModel, Field

class User(BaseModel):
    id: int
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    
    model_config = {"frozen": True}
```

### Error Handling
```python
class ServiceError(Exception):
    """Base exception for service errors."""
    pass

class NotFoundError(ServiceError):
    """Resource not found."""
    pass

def get_user(user_id: int) -> User:
    user = db.get(user_id)
    if not user:
        raise NotFoundError(f"User {user_id} not found")
    return user
```

### Logging
```python
import logging

logger = logging.getLogger(__name__)

def process_data(data: dict) -> dict:
    logger.info("Processing data", extra={"data_id": data.get("id")})
    try:
        result = transform(data)
        logger.debug("Transform successful")
        return result
    except ValueError as e:
        logger.error("Transform failed", exc_info=True)
        raise
```

## Testing Patterns

### Fixtures
```python
import pytest

@pytest.fixture
def sample_user() -> User:
    return User(id=1, name="Test", email="test@example.com")

@pytest.fixture
def mock_db(mocker):
    return mocker.patch("module.db")
```

### Parametrized Tests
```python
@pytest.mark.parametrize("input_val,expected", [
    ("hello", "HELLO"),
    ("world", "WORLD"),
    ("", ""),
])
def test_uppercase(input_val: str, expected: str):
    assert input_val.upper() == expected
```

## Tools Configuration

### pyproject.toml
```toml
[tool.ruff]
line-length = 88
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "W", "UP"]

[tool.pyright]
pythonVersion = "3.11"
typeCheckingMode = "strict"

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-v --tb=short"
```
