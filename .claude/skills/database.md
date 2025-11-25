# Database & Data Layer Skill

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
