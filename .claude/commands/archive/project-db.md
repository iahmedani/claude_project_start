---
name: project-db
description: "Database management command. Handle migrations, seeding, backups, and database operations."
tools: Read, Write, Edit, Bash(npx:*), Bash(npm:*), Bash(python:*), Bash(alembic:*), Bash(psql:*), Bash(docker:*), Bash(docker-compose:*)
---

# Database Management Command

Manage database operations including migrations, seeding, and backups.

**Action:** $ARGUMENTS

## Available Actions

| Action | Description |
|--------|-------------|
| `migrate` | Run pending migrations |
| `migrate:create <name>` | Create a new migration |
| `migrate:rollback` | Rollback last migration |
| `migrate:status` | Show migration status |
| `seed` | Run database seeders |
| `reset` | Reset database (drop & recreate) |
| `backup` | Create database backup |
| `restore <file>` | Restore from backup |
| `studio` | Open database GUI |
| `console` | Open database console |

## Action: `migrate` - Run Migrations

### Prisma (Node.js)
```bash
npx prisma migrate dev
```

### Drizzle (Node.js)
```bash
npx drizzle-kit push:pg
# or
npm run db:push
```

### TypeORM (Node.js)
```bash
npm run migration:run
# or
npx typeorm migration:run -d ./src/data-source.ts
```

### Alembic (Python)
```bash
alembic upgrade head
```

### Django (Python)
```bash
python manage.py migrate
```

### SQLAlchemy + Flask-Migrate
```bash
flask db upgrade
```

## Action: `migrate:create` - Create Migration

### Prisma
```bash
npx prisma migrate dev --name <migration-name>
```

### Drizzle
```bash
npx drizzle-kit generate:pg --name <migration-name>
```

### TypeORM
```bash
npx typeorm migration:create ./src/migrations/<MigrationName>
# or auto-generate from entities
npx typeorm migration:generate ./src/migrations/<MigrationName> -d ./src/data-source.ts
```

### Alembic
```bash
alembic revision --autogenerate -m "<migration description>"
```

### Django
```bash
python manage.py makemigrations --name <migration_name>
```

## Action: `migrate:rollback` - Rollback Migration

### Prisma
```bash
# Reset to specific migration
npx prisma migrate reset
```

### TypeORM
```bash
npx typeorm migration:revert -d ./src/data-source.ts
```

### Alembic
```bash
# Rollback one
alembic downgrade -1

# Rollback to specific revision
alembic downgrade <revision_id>
```

### Django
```bash
python manage.py migrate <app_name> <migration_name>
```

## Action: `migrate:status` - Migration Status

### Prisma
```bash
npx prisma migrate status
```

### Alembic
```bash
alembic current
alembic history --verbose
```

### TypeORM
```bash
npx typeorm migration:show -d ./src/data-source.ts
```

### Django
```bash
python manage.py showmigrations
```

## Action: `seed` - Seed Database

### Prisma
```bash
npx prisma db seed
```

### Custom Seed Script
```bash
npm run seed
# or
npm run db:seed
```

### Python
```bash
python manage.py loaddata fixtures/initial_data.json
# or
python scripts/seed.py
```

## Action: `reset` - Reset Database

### Prisma
```bash
npx prisma migrate reset
```

### Docker PostgreSQL
```bash
# Stop and remove database container
docker-compose stop db
docker-compose rm -f db
docker volume rm $(docker volume ls -q | grep postgres)

# Recreate
docker-compose up -d db
sleep 5

# Run migrations
npx prisma migrate dev
```

### Direct PostgreSQL
```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS app_dev;"
psql -U postgres -c "CREATE DATABASE app_dev;"

# Run migrations
npx prisma migrate dev
```

## Action: `backup` - Create Backup

### PostgreSQL (Docker)
```bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backups/backup_${TIMESTAMP}.sql"

mkdir -p backups

docker-compose exec -T db pg_dump -U postgres app_dev > "$BACKUP_FILE"

echo "Backup created: $BACKUP_FILE"
```

### PostgreSQL (Direct)
```bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backups/backup_${TIMESTAMP}.sql"

mkdir -p backups

pg_dump "$DATABASE_URL" > "$BACKUP_FILE"

# Compressed backup
pg_dump "$DATABASE_URL" | gzip > "${BACKUP_FILE}.gz"
```

## Action: `restore` - Restore Backup

### PostgreSQL (Docker)
```bash
# Restore from SQL file
docker-compose exec -T db psql -U postgres app_dev < backups/<backup_file>.sql

# From compressed file
gunzip -c backups/<backup_file>.sql.gz | docker-compose exec -T db psql -U postgres app_dev
```

### PostgreSQL (Direct)
```bash
psql "$DATABASE_URL" < backups/<backup_file>.sql
```

## Action: `studio` - Database GUI

### Prisma Studio
```bash
npx prisma studio
# Opens at http://localhost:5555
```

### Drizzle Studio
```bash
npx drizzle-kit studio
```

### pgAdmin (Docker)
```bash
# Add to docker-compose.yml
docker-compose up -d pgadmin
# Access at http://localhost:5050
```

## Action: `console` - Database Console

### PostgreSQL (Docker)
```bash
docker-compose exec db psql -U postgres app_dev
```

### PostgreSQL (Direct)
```bash
psql "$DATABASE_URL"
```

### MySQL
```bash
docker-compose exec db mysql -u root -p app_dev
```

## Schema Management

### Generate Prisma Client
```bash
npx prisma generate
```

### Push Schema Changes (Dev only)
```bash
npx prisma db push
```

### View Database Schema
```bash
# Prisma - generates schema diagram
npx prisma-erd-generator

# PostgreSQL
docker-compose exec db psql -U postgres -c "\dt" app_dev
docker-compose exec db psql -U postgres -c "\d+ users" app_dev
```

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║  🗄️  DATABASE COMMAND EXECUTED                               ║
╠══════════════════════════════════════════════════════════════╣
║  Action: [migrate/seed/backup/reset/etc.]                    ║
║  Database: app_dev                                           ║
╠══════════════════════════════════════════════════════════════╣
║  RESULT                                                      ║
║  ✓ 3 migrations applied                                      ║
║  ✓ Database schema updated                                   ║
║  ✓ Prisma Client generated                                   ║
╠══════════════════════════════════════════════════════════════╣
║  CURRENT STATUS                                              ║
║  ├── Tables: 12                                              ║
║  ├── Last Migration: 20240115_add_users                      ║
║  └── Pending: 0                                              ║
╠══════════════════════════════════════════════════════════════╣
║  NEXT STEPS                                                  ║
║  • Run `npm run seed` to populate test data                  ║
║  • Run `npx prisma studio` to view data                      ║
╚══════════════════════════════════════════════════════════════╝
```

## Common Schemas

### User Table
```prisma
// schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

enum Role {
  USER
  ADMIN
}
```

### Python SQLAlchemy
```python
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

class Role(enum.Enum):
    USER = "user"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(100))
    password = Column(String(255), nullable=False)
    role = Column(Enum(Role), default=Role.USER)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    posts = relationship("Post", back_populates="author")
```
