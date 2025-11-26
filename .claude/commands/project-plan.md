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
- Read project-config.yaml for tech stack
- Check `.claude/workflow/STATE.md` for current phase
- Search codebase for related patterns
- Check `docs/planning/` for related PRPs

### Step 2: Clarify Requirements
Ask the user 2-3 focused questions:
- What is the core functionality needed?
- Are there any specific constraints or requirements?
- Should this integrate with existing features?

### Step 3: Use Architect Subagent
Delegate to the **architect** subagent:
```
Use the architect subagent to:
1. Design the high-level approach for $ARGUMENTS
2. Identify existing patterns to follow
3. Note any architectural considerations or ADRs needed
```

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

### Phase 3: Polish & Testing
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Update documentation

## Acceptance Criteria
- [ ] AC1: [Criterion]
- [ ] AC2: [Criterion]
- [ ] AC3: [Criterion]

## Validation Gates
All must pass before completion:
- [ ] Type checking passes
- [ ] Linting passes
- [ ] All tests pass
- [ ] Coverage >= threshold
- [ ] Documentation updated

## Dependencies
- [List any dependencies]

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
