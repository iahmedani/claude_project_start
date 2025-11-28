# Database & Data Layer Skill

> **Related**: `api-design` (REST endpoints), `testing-tdd` (database testing)

## Naming Conventions

### Entity-Specific Primary Keys

Use entity-specific primary keys for clarity:

```sql
-- Primary keys: {entity}_id
sessions.session_id UUID PRIMARY KEY
leads.lead_id UUID PRIMARY KEY
users.user_id UUID PRIMARY KEY

-- Foreign keys: {referenced_entity}_id
session_id REFERENCES sessions(session_id)
user_id REFERENCES users(user_id)
```

### Field Naming Standards

| Type             | Pattern             | Examples                                 |
| ---------------- | ------------------- | ---------------------------------------- |
| **Primary Keys** | `{entity}_id`       | `user_id`, `order_id`                    |
| **Foreign Keys** | `{referenced}_id`   | `user_id`, `session_id`                  |
| **Timestamps**   | `{action}_at`       | `created_at`, `updated_at`, `expires_at` |
| **Booleans**     | `is_{state}`        | `is_active`, `is_verified`               |
| **Counts**       | `{entity}_count`    | `message_count`, `order_count`           |
| **Durations**    | `{property}_{unit}` | `duration_seconds`, `timeout_minutes`    |

### Table Naming

```sql
-- Use plural snake_case
users, orders, order_items, user_sessions

-- Junction tables: {table1}_{table2}
user_roles, product_categories
```

## ORM Patterns (SQLAlchemy 2.0)

### Model Definition

```python
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from datetime import datetime


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    # Relationships
    posts: Mapped[list["Post"]] = relationship(back_populates="author")

    def __repr__(self) -> str:
        return f"User(id={self.id}, email={self.email!r})"
```

### Repository Pattern

```python
from typing import Protocol, TypeVar, Generic
from sqlalchemy.orm import Session

T = TypeVar("T")


class Repository(Protocol[T]):
    """Generic repository interface."""

    def get(self, id: int) -> T | None: ...
    def get_all(self) -> list[T]: ...
    def create(self, entity: T) -> T: ...
    def update(self, entity: T) -> T: ...
    def delete(self, id: int) -> bool: ...


class UserRepository:
    """User repository implementation."""

    def __init__(self, session: Session):
        self.session = session

    def get(self, user_id: int) -> User | None:
        return self.session.get(User, user_id)

    def get_by_email(self, email: str) -> User | None:
        return self.session.query(User).filter(User.email == email).first()

    def create(self, user: User) -> User:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user
```

## Migration Best Practices

### Alembic Commands

```bash
# Create migration
alembic revision --autogenerate -m "Add users table"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Show current revision
alembic current
```

### Migration Template

```python
"""Add users table

Revision ID: abc123
"""
from alembic import op
import sqlalchemy as sa


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_index('ix_users_email', 'users', ['email'])


def downgrade() -> None:
    op.drop_index('ix_users_email')
    op.drop_table('users')
```

## Query Optimization

1. **Use eager loading** for known relationships
2. **Paginate** large result sets
3. **Index** frequently queried columns
4. **Avoid N+1** with `joinedload` or `selectinload`

```python
# Bad: N+1 query
users = session.query(User).all()
for user in users:
    print(user.posts)  # Separate query each time

# Good: Eager load
users = session.query(User).options(selectinload(User.posts)).all()
```

## Testing Database Code

```python
@pytest.fixture
def db_session():
    """Create test database session."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)

    with Session(engine) as session:
        yield session

    Base.metadata.drop_all(engine)
```
