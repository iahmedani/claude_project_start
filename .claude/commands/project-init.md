---
name: project-init
description: "Initialize the project structure for Claude Code orchestration. Sets up directories, configuration, and workflow tracking."
tools: Read, Write, Edit, Bash(mkdir:*), Bash(touch:*), Bash(find:*), Bash(ls:*)
---

# Project Initialization Command

Initialize the project structure and configuration for Claude Code orchestration.

## Prerequisites
- None (this is the first step)

## What This Command Does

1. **Create Directory Structure**
2. **Detect Project Configuration**
3. **Initialize Workflow State**
4. **Set Up Progress Tracking**

## Step-by-Step Process

### Step 1: Verify Environment
- Check we're in a project directory (look for git, package files, etc.)
- Check for existing .claude directory
- Read any existing project configuration

### Step 2: Create Directories
Create these directories if they don't exist:
```bash
mkdir -p .claude/agents
mkdir -p .claude/commands
mkdir -p .claude/hooks
mkdir -p .claude/skills
mkdir -p .claude/logs
mkdir -p .claude/workflow
mkdir -p docs/planning
mkdir -p docs/architecture
mkdir -p docs/progress
```

### Step 3: Detect Project Config
If `project-config.yaml` doesn't exist or is a template, detect and create it:

Look for:
- `pyproject.toml` → Python project
- `package.json` → Node.js project
- `go.mod` → Go project
- `Cargo.toml` → Rust project

### Step 4: Initialize Workflow State
Create `.claude/workflow/STATE.md` with initial state.

### Step 5: Create Progress Tracking
Create `docs/progress/PROGRESS.md` with today's date.

### Step 6: Update .gitignore
Add these lines if not present:
```
.claude/logs/
.claude/settings.local.json
CLAUDE.local.md
```

## Output Format

After completion, display:

```
╔══════════════════════════════════════════════════════════════╗
║  ✅ PROJECT INITIALIZED                                       ║
╠══════════════════════════════════════════════════════════════╣
║  Project: [detected name]                                     ║
║  Language: [detected language]                                ║
║  Framework: [detected framework]                              ║
╠══════════════════════════════════════════════════════════════╣
║  STEP COMPLETED: Initialization                               ║
║  ───────────────────────────────────────────────────────────  ║
║  ➡️  NEXT STEP: Run /primer to analyze your codebase          ║
║                                                               ║
║  Alternative: Run /project-plan to start planning a feature   ║
╚══════════════════════════════════════════════════════════════╝
```

## Workflow State Update

After successful completion:
- Mark "Project initialized" as complete in STATE.md
- Set phase to "discovery" if codebase exists, else "planning"
- Log initialization event

## Files Created/Modified

- `.claude/workflow/STATE.md` - Workflow tracking
- `docs/progress/PROGRESS.md` - Progress tracking
- `project-config.yaml` - If not exists
- `.gitignore` - Updated if needed
