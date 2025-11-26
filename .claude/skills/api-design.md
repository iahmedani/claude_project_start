# API Design Skill

> **Related**: `database` (data layer), `graphql-api` (GraphQL alternative), `python-development` (FastAPI)

Best practices for designing and implementing RESTful APIs.

## REST Conventions

### URL Structure

```
GET    /users           # List users
POST   /users           # Create user
GET    /users/{id}      # Get single user
PUT    /users/{id}      # Update user (full)
PATCH  /users/{id}      # Update user (partial)
DELETE /users/{id}      # Delete user

# Nested resources
GET    /users/{id}/orders
POST   /users/{id}/orders

# Query parameters for filtering/pagination
GET    /users?status=active&page=1&limit=20&sort=-created_at
```

### HTTP Status Codes

```
200 OK           - Successful GET/PUT/PATCH
201 Created      - Successful POST
204 No Content   - Successful DELETE
400 Bad Request  - Invalid input
401 Unauthorized - Not authenticated
403 Forbidden    - Not authorized
404 Not Found    - Resource doesn't exist
409 Conflict     - Resource conflict
422 Unprocessable - Validation error
500 Server Error - Internal error
```

### Response Format

```json
{
  "data": {
    "id": 1,
    "type": "user",
    "attributes": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Pagination Response

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

## FastAPI Implementation

### Router Structure

```python
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Annotated

router = APIRouter(prefix="/users", tags=["users"])

@router.get("", response_model=UserListResponse)
async def list_users(
    page: Annotated[int, Query(ge=1)] = 1,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    status: Optional[str] = None,
    db: Database = Depends(get_db)
) -> UserListResponse:
    """List all users with pagination."""
    users = await db.get_users(page=page, limit=limit, status=status)
    return UserListResponse(data=users, pagination=...)

@router.post("", response_model=UserResponse, status_code=201)
async def create_user(
    user_in: UserCreate,
    db: Database = Depends(get_db)
) -> UserResponse:
    """Create a new user."""
    user = await db.create_user(user_in)
    return UserResponse(data=user)

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: Database = Depends(get_db)
) -> UserResponse:
    """Get a specific user."""
    user = await db.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(data=user)
```

### Request/Response Models

```python
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}
```

## Security

### Authentication Header

```
Authorization: Bearer <token>
```

### Rate Limiting Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

### CORS Configuration

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yoursite.com"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
```
