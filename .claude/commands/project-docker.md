---
name: project-docker
description: "Manage Docker containers and services for development. Build, run, and orchestrate containers."
tools: Read, Write, Edit, Bash(docker:*), Bash(docker-compose:*), Bash(docker compose:*), Bash(ls:*), Bash(cat:*)
---

# Docker Management Command

Manage Docker containers and services for this project.

**Action:** $ARGUMENTS

## Available Actions

| Action | Description |
|--------|-------------|
| `up` | Start all services |
| `down` | Stop all services |
| `build` | Build/rebuild images |
| `logs` | View service logs |
| `status` | Show container status |
| `shell <service>` | Open shell in container |
| `reset` | Reset all containers and volumes |
| `init` | Initialize Docker configuration |

## Action: `up` - Start Services

### Start Development Environment
```bash
# Check for docker-compose file
if [ -f "docker-compose.yml" ]; then
  docker-compose up -d
elif [ -f "docker-compose.yaml" ]; then
  docker compose up -d
else
  echo "No docker-compose file found"
  exit 1
fi
```

### Wait for Services
```bash
# Wait for database to be ready
echo "Waiting for services to be healthy..."
sleep 5

# Check health
docker-compose ps
```

## Action: `down` - Stop Services

```bash
docker-compose down
```

### With Volume Cleanup
```bash
docker-compose down -v  # Also removes volumes
```

## Action: `build` - Build Images

### Build All Services
```bash
docker-compose build --no-cache
```

### Build Specific Service
```bash
docker-compose build <service-name>
```

### Build for Production
```bash
docker build -t myapp:latest --target production .
```

## Action: `logs` - View Logs

### All Services
```bash
docker-compose logs -f
```

### Specific Service
```bash
docker-compose logs -f <service-name>
```

### Last N Lines
```bash
docker-compose logs --tail=100 <service-name>
```

## Action: `status` - Container Status

```bash
echo "=== Container Status ==="
docker-compose ps

echo ""
echo "=== Resource Usage ==="
docker stats --no-stream

echo ""
echo "=== Networks ==="
docker network ls | grep -E "(NETWORK|$(basename $(pwd)))"

echo ""
echo "=== Volumes ==="
docker volume ls | grep -E "(VOLUME|$(basename $(pwd)))"
```

## Action: `shell` - Container Shell

### Open Shell
```bash
# Interactive shell
docker-compose exec <service-name> sh

# Or bash if available
docker-compose exec <service-name> bash
```

### Run One-off Command
```bash
docker-compose exec <service-name> <command>
```

## Action: `reset` - Full Reset

```bash
echo "⚠️  This will remove all containers, volumes, and networks for this project"
read -p "Continue? (y/N): " confirm

if [ "$confirm" = "y" ]; then
  docker-compose down -v --remove-orphans
  docker system prune -f
  echo "✓ Reset complete"
fi
```

## Action: `init` - Initialize Docker Configuration

### Create docker-compose.yml
If no docker-compose file exists, create one based on detected project type:

#### Node.js Full-Stack Template
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/app_dev
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    command: npm run dev

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  mailhog:
    image: mailhog/mailhog
    ports:
      - "1025:1025"
      - "8025:8025"

volumes:
  postgres_data:
  redis_data:
```

#### Python Full-Stack Template
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    environment:
      - PYTHONDONTWRITEBYTECODE=1
      - PYTHONUNBUFFERED=1
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/app_dev
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  celery:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/app_dev
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    command: celery -A app.celery worker --loglevel=info

volumes:
  postgres_data:
  redis_data:
```

### Create Dockerfile.dev
```dockerfile
# Dockerfile.dev (Node.js)
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### Create .dockerignore
```
node_modules
.git
.env
.env.local
*.log
coverage
.nyc_output
dist
build
.next
```

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║  🐳 DOCKER COMMAND EXECUTED                                  ║
╠══════════════════════════════════════════════════════════════╣
║  Action: [up/down/build/logs/status/shell/reset/init]        ║
╠══════════════════════════════════════════════════════════════╣
║  SERVICES                                                    ║
║  ├── app:      ✅ Running (0.0.0.0:3000)                     ║
║  ├── db:       ✅ Running (0.0.0.0:5432) - healthy           ║
║  ├── redis:    ✅ Running (0.0.0.0:6379)                     ║
║  └── mailhog:  ✅ Running (0.0.0.0:8025)                     ║
╠══════════════════════════════════════════════════════════════╣
║  USEFUL COMMANDS                                             ║
║  • View logs:    docker-compose logs -f app                  ║
║  • Shell:        docker-compose exec app sh                  ║
║  • Stop:         docker-compose down                         ║
╚══════════════════════════════════════════════════════════════╝
```

## Common Issues

### Port Already in Use
```bash
# Find what's using the port
lsof -i :3000

# Or use a different port in docker-compose
ports:
  - "3001:3000"
```

### Container Won't Start
```bash
# Check logs
docker-compose logs <service>

# Check container status
docker-compose ps -a

# Rebuild
docker-compose build --no-cache <service>
```

### Database Connection Issues
```bash
# Verify database is ready
docker-compose exec db pg_isready -U postgres

# Check network
docker network inspect $(docker-compose config --services | head -1)_default
```
