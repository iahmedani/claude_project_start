---
phase: not_initialized
started: null
last_updated: null
active_task: null
active_prp: null
---

# Workflow State

> **This file tracks the current state of your project workflow.**
> Updated automatically by commands and hooks. Do not edit manually unless you know what you're doing.

## Flow Progress

```
┌─────────────────────────────────────────────────────────────────────────┐
│  WORKFLOW PROGRESS                                                       │
├─────────────────────────────────────────────────────────────────────────┤
│  [⬜] Init → [⬜] Discover → [⬜] Plan → [⬜] Design →                    │
│  [⬜] Implement → [⬜] Test → [⬜] Review → [⬜] Validate → [⬜] Deploy    │
└─────────────────────────────────────────────────────────────────────────┘
```

## Step Completion Checklist

### Phase 1: Initialization

- [ ] Project initialized (`/project-init`)
- [ ] Configuration reviewed (`project-config.yaml`)
- [ ] CLAUDE.md customized

### Phase 2: Discovery

- [ ] Codebase analyzed (`/primer`)
- [ ] Architecture understood
- [ ] Patterns documented

### Phase 3: Planning

- [ ] Requirements gathered
- [ ] PRP created (`/project-plan`)
- [ ] Architecture reviewed

### Phase 4: Design

- [ ] ADRs created for decisions
- [ ] Interfaces defined
- [ ] Patterns selected

### Phase 5: Implementation

- [ ] Tests written first (TDD)
- [ ] Code implemented (`/project-implement`)
- [ ] All tests passing

### Phase 6: Testing

- [ ] Unit tests complete
- [ ] Integration tests complete
- [ ] Coverage threshold met

### Phase 7: Review & Validation

- [ ] All quality gates pass (`/project-validate`)
- [ ] No linting errors
- [ ] Type checking passes

### Phase 8: Completion

- [ ] Code committed
- [ ] PR created (if applicable)
- [ ] Ready for deployment

## Active Work

```yaml
current_task: null
prp_file: null
started_at: null
current_step: null
blockers: []
```

## Recent Activity

<!-- Recent workflow events logged automatically -->

| Timestamp | Event                | Details       |
| --------- | -------------------- | ------------- |
| -         | Workflow initialized | Initial state |

## Next Recommended Action

```
⏭️  NEXT: Run /project-init to initialize project structure
```

---

_State file for Claude Project Orchestrator - Auto-managed_
