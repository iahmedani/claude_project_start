---
name: primer
description: "Comprehensive codebase analysis to prime Claude for effective work. Run this first when joining a new project."
tools: Read, Grep, Glob, Bash(find:*), Bash(ls:*), Bash(cat:*), Bash(head:*), Bash(wc:*)
---

# Codebase Primer - Deep Analysis

Perform comprehensive codebase analysis to prime Claude for effective work.

## Purpose

Before implementing features or fixing bugs, use this command to:
- Understand project structure and patterns
- Identify coding conventions
- Map key components and their relationships
- Discover existing utilities and helpers

## Process

### Step 1: Project Structure Analysis
```bash
# Get directory structure (excluding common noise)
find . -type d \
  -not -path "./.*" \
  -not -path "./node_modules/*" \
  -not -path "./.venv/*" \
  -not -path "./__pycache__/*" \
  -not -path "./dist/*" \
  -not -path "./build/*" \
  | head -50

# Count files by extension
find . -type f -not -path "./.*" -not -path "./node_modules/*" -not -path "./.venv/*" \
  | sed 's/.*\.//' | sort | uniq -c | sort -rn | head -10
```

### Step 2: Configuration Detection
Check for and read:
- `pyproject.toml` / `setup.py` / `setup.cfg`
- `package.json` / `tsconfig.json`
- `requirements.txt` / `Pipfile`
- `.env.example`
- Docker files

### Step 3: Entry Points Identification
```bash
# Python entry points
grep -r "if __name__" --include="*.py" -l 2>/dev/null | head -10
grep -r "def main" --include="*.py" -l 2>/dev/null | head -10

# JavaScript/TypeScript entry points
grep -r "export default" --include="*.ts" --include="*.tsx" -l 2>/dev/null | head -10
```

### Step 4: Pattern Discovery
Analyze for common patterns:
```bash
# API endpoints / routes
grep -rn "route\|@app\.\|@router" --include="*.py" | head -20

# Database models
grep -rn "class.*Model\|Base\)" --include="*.py" | head -20

# Service classes
grep -rn "class.*Service" --include="*.py" | head -20
```

### Step 5: Dependency Mapping
```bash
# Python imports (most common)
grep -rh "^from\|^import" --include="*.py" | sort | uniq -c | sort -rn | head -20
```

### Step 6: Test Structure
```bash
# Find test files
find . -name "test_*.py" -o -name "*_test.py" | head -20

# Check for fixtures
grep -rn "@pytest.fixture" --include="*.py" | head -10
```

### Step 7: Generate Primer Report

Create `docs/architecture/CODEBASE_PRIMER.md`:

```markdown
# Codebase Primer: [Project Name]

**Generated:** [date]
**Analyzer:** Claude Code

## Project Overview
[Brief description based on README/docs]

## Technology Stack
| Component | Technology |
|-----------|------------|
| Language | [detected] |
| Framework | [detected] |
| Database | [if detected] |
| Testing | [framework] |

## Directory Structure
```
[tree output]
```

## Key Components

### Entry Points
- `[file]` - [purpose]
- `[file]` - [purpose]

### Core Modules
| Module | Purpose | Key Files |
|--------|---------|-----------|
| services/ | Business logic | example_service.py |
| models/ | Data models | user.py, order.py |
| api/ | REST endpoints | routes.py |

### Configuration
- Environment: `.env` / `config.py`
- Settings: [detected files]

## Coding Patterns

### Naming Conventions
- Files: [snake_case/kebab-case/etc]
- Classes: [PascalCase]
- Functions: [snake_case]
- Constants: [UPPER_SNAKE_CASE]

### Common Patterns
1. **[Pattern Name]**
   - Example: `[path/to/example.py]`
   - Usage: [description]

2. **[Pattern Name]**
   - Example: `[path/to/example.py]`
   - Usage: [description]

### Error Handling
[Describe how errors are handled]

### Logging
[Describe logging approach]

## Testing Approach
- Framework: [pytest/jest/etc]
- Location: `tests/`
- Fixtures: [location]
- Coverage target: [percent]%

## Key Files Reference

| Purpose | File | Notes |
|---------|------|-------|
| Main entry | src/main.py | Application bootstrap |
| Config | src/config.py | Settings management |
| Database | src/db.py | Connection management |

## Development Commands
```bash
# Install dependencies
[command]

# Run development server
[command]

# Run tests
[command]

# Lint code
[command]

# Type check
[command]
```

## Notes for Development
- [Important note 1]
- [Important note 2]
- [Important note 3]
```

### Step 8: Update Workflow State

Mark "Codebase analyzed" as complete in STATE.md.

## Output Format

After analysis:

```
╔══════════════════════════════════════════════════════════════╗
║  🔬 CODEBASE ANALYSIS COMPLETE                                ║
╠══════════════════════════════════════════════════════════════╣
║  Project: [name]                                              ║
║  Report: docs/architecture/CODEBASE_PRIMER.md                ║
╠══════════════════════════════════════════════════════════════╣
║  SUMMARY                                                      ║
║  ├── Language:      [language]                                ║
║  ├── Framework:     [framework]                               ║
║  ├── Source Files:  [count]                                   ║
║  ├── Test Files:    [count]                                   ║
║  └── Key Patterns:  [count] identified                        ║
╠══════════════════════════════════════════════════════════════╣
║  KEY INSIGHTS                                                 ║
║  • [insight 1]                                                ║
║  • [insight 2]                                                ║
║  • [insight 3]                                                ║
╠══════════════════════════════════════════════════════════════╣
║  STEP COMPLETED: Codebase Discovery                           ║
║  ───────────────────────────────────────────────────────────  ║
║  ➡️  NEXT STEP: Run /project-plan to plan your feature         ║
║                                                               ║
║  Alternatives:                                                ║
║  • /project-status - View project dashboard                  ║
║  • /project-implement [PRP] - Start implementing a PRP       ║
╚══════════════════════════════════════════════════════════════╝
```
