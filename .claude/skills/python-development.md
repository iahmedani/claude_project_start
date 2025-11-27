# Python Development Skill

> **Related**: `api-design` (FastAPI), `database` (SQLAlchemy), `testing-tdd` (pytest), `ci-cd` (Python CI)

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

## UV Package Management

UV is the modern, fast Python package manager. Always prefer UV over pip.

```bash
# Install UV
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create virtual environment
uv venv

# Sync dependencies from pyproject.toml
uv sync

# Add packages (NEVER edit pyproject.toml directly)
uv add requests
uv add --dev pytest ruff mypy

# Remove packages
uv remove requests

# Run commands in environment
uv run python script.py
uv run pytest
uv run ruff check .
```

## Pydantic v2 Patterns

### Models with Validation

```python
from pydantic import BaseModel, Field, field_validator, EmailStr
from decimal import Decimal

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    price: Decimal = Field(..., gt=0, decimal_places=2)
    category: str

    @field_validator('price')
    @classmethod
    def validate_price(cls, v: Decimal) -> Decimal:
        if v > Decimal('1000000'):
            raise ValueError('Price cannot exceed 1,000,000')
        return v

    model_config = {"strict": True}
```

### Settings Management

```python
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "MyApp"
    debug: bool = False
    database_url: str
    api_key: str

    model_config = {"env_file": ".env", "case_sensitive": False}

@lru_cache()
def get_settings() -> Settings:
    return Settings()
```

## Structured Logging

```python
import structlog

logger = structlog.get_logger()

# Log with context
logger.info(
    "payment_processed",
    user_id=user.id,
    amount=amount,
    processing_time_ms=elapsed
)
```

## Tools Configuration

### pyproject.toml

```toml
[project]
name = "myproject"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = []

[project.optional-dependencies]
dev = ["pytest", "ruff", "mypy", "pytest-cov"]

[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "W", "UP", "B", "SIM"]

[tool.pyright]
pythonVersion = "3.11"
typeCheckingMode = "strict"

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-v --tb=short --cov=src"
```

## Development Commands

```bash
# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=src --cov-report=html

# Format code
uv run ruff format .

# Check and fix linting
uv run ruff check --fix .

# Type checking
uv run mypy src/
```
