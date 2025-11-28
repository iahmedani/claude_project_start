---
name: project-plan
description: "Create a comprehensive Product Requirements Prompt (PRP) for a feature. Use this before implementation."
tools: Read, Write, Edit, Grep, Glob, Bash(find:*), Bash(ls:*), Bash(cat:*)
---

# Create Feature Plan (PRP)

Generate a comprehensive Product Requirements Prompt (PRP) for a feature.

**Feature to plan:** $ARGUMENTS

## Prerequisites Check

Before starting:
1. Check if project is initialized (`.claude/workflow/STATE.md` exists)
2. If not initialized, suggest running `/project-init` first
3. Check if `/primer` was run (recommended for context)

## Process

### Step 1: Gather Context
- Read CLAUDE.md for project context
- **CRITICAL: Read project-config.yaml and extract ALL relevant settings:**
  - `stack.frontend.*` - framework, meta_framework, styling, state_management
  - `stack.backend.*` - language, framework
  - `stack.database.*` - primary, orm
  - `testing.frontend.*` - unit, component, e2e frameworks
  - `testing.backend.*` - framework, coverage_threshold
  - `style.*` - linter, formatter, type_checker
  - `versions.*` - node, python, typescript versions
  - `package_managers.*` - npm/yarn/pnpm, pip/uv/poetry
- Check `.claude/workflow/STATE.md` for current phase
- Search codebase for related patterns
- Check `docs/planning/` for related PRPs

**You MUST use the exact tools/frameworks from project-config.yaml in your PRP.**
Do NOT substitute or omit configured values.

### Step 2: Clarify Requirements
Ask the user 2-3 focused questions:
- What is the core functionality needed?
- Are there any specific constraints or requirements?
- Should this integrate with existing features?

### Step 3: Design Architecture
Analyze the codebase to design the approach:
1. Identify existing patterns to follow
2. Design the high-level approach for $ARGUMENTS
3. Note any architectural considerations
4. Document decisions in the PRP

### Step 4: Create PRP Document

Create `docs/planning/PRP-[feature-slug].md` using the template below.

### Step 5: Update Workflow State

After PRP creation:
```bash
# Update STATE.md
sed -i 's/- \[ \] PRP created/- [x] PRP created/' .claude/workflow/STATE.md
```

## PRP Template

```markdown
# PRP: [Feature Name]

**Created:** [date]
**Status:** 🟡 In Progress
**Phase:** Planning

## Overview
[2-3 sentence description]

## Tech Stack (from project-config.yaml)

| Category | Tool | Version |
|----------|------|---------|
| Framework | [from stack.frontend.framework] | [from versions.*] |
| Meta Framework | [from stack.frontend.meta_framework] | |
| Styling | [from stack.frontend.styling] | |
| State | [from stack.frontend.state_management] | |
| Unit Testing | [from testing.frontend.unit] | |
| Component Testing | [from testing.frontend.component] | |
| E2E Testing | [from testing.frontend.e2e] | |
| Linter | [from style.node.linter] | |
| Formatter | [from style.node.formatter] | |
| Type Checker | [from style.node.type_checker] | |
| Package Manager | [from package_managers.node] | |

## Requirements

### Must Have
- [ ] REQ1: [Requirement]
- [ ] REQ2: [Requirement]

### Should Have
- [ ] REQ3: [Requirement]

### Nice to Have
- [ ] REQ4: [Requirement]

## Technical Approach

### Architecture
[High-level design from architect subagent]

### Components
1. **Component 1**: [description]
2. **Component 2**: [description]

### Patterns to Follow
- Pattern 1: See `path/to/example.py`
- Pattern 2: See `path/to/example2.py`

## Implementation Checklist

### Phase 1: Foundation
- [ ] Step 1: [description]
- [ ] Step 2: [description]

### Phase 2: Core Feature
- [ ] Step 1: [description]
- [ ] Step 2: [description]

### Phase 3: Testing Setup (per project-config.yaml)
- [ ] Configure unit testing with [testing.frontend.unit or testing.backend.framework]
- [ ] Configure component testing with [testing.frontend.component]
- [ ] Configure E2E testing with [testing.frontend.e2e]
- [ ] Write unit tests (target: [testing.backend.coverage_threshold]% coverage)
- [ ] Write integration tests
- [ ] Update documentation

## Acceptance Criteria
- [ ] AC1: [Criterion]
- [ ] AC2: [Criterion]
- [ ] AC3: [Criterion]

## Validation Gates
All must pass before completion (use tools from project-config.yaml):
- [ ] Type checking passes (`[style.*.type_checker] --noEmit`)
- [ ] Linting passes (`[style.*.linter]`)
- [ ] Formatting check (`[style.*.formatter] --check`)
- [ ] Unit tests pass (`[testing.*.framework]`)
- [ ] Coverage >= [testing.backend.coverage_threshold]%
- [ ] E2E tests pass (if applicable) (`[testing.frontend.e2e]`)
- [ ] Build succeeds
- [ ] Documentation updated

## Dependencies

**IMPORTANT:** Include all tools from project-config.yaml in dependencies.

### Production Dependencies
```json
{
  // Framework dependencies from stack.*
  // State management from stack.frontend.state_management
}
```

### Dev Dependencies
```json
{
  // Testing: [testing.frontend.unit], [testing.frontend.component], [testing.frontend.e2e]
  // Linting: [style.node.linter]
  // Formatting: [style.node.formatter]
  // Types: typescript, @types/*
}
```

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| [risk] | High/Med/Low | [approach] |

## Estimated Effort
**Size:** [Small/Medium/Large]
**Reasoning:** [why this estimate]
```

## Output Format

After completion:

```
╔══════════════════════════════════════════════════════════════╗
║  ✅ PRP CREATED                                               ║
╠══════════════════════════════════════════════════════════════╣
║  Feature: [Feature Name]                                      ║
║  File: docs/planning/PRP-[slug].md                           ║
╠══════════════════════════════════════════════════════════════╣
║  STEP COMPLETED: Planning                                     ║
║  ───────────────────────────────────────────────────────────  ║
║  ➡️  NEXT STEP: Run /project-implement PRP-[slug]             ║
║                                                               ║
║  Alternatives:                                                ║
║  • /project-tdd PRP-[slug] - Start with tests (recommended)  ║
║  • /project-review PRP-[slug] - Get PRP reviewed first       ║
╚══════════════════════════════════════════════════════════════╝
```

## GitHub Integration (Optional)

If `gh` CLI is available:
```bash
gh issue create --title "[Feature] [Feature Name]" --body "See PRP: docs/planning/PRP-[slug].md"
```
