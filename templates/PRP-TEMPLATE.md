# PRP: [Feature Name]

> Product Requirements Prompt for AI-assisted implementation

## Overview

[2-3 sentence description of the feature]

## Problem Statement

[What problem does this solve? Why is it needed?]

## Requirements

### Functional Requirements

- [ ] **REQ-F1**: [Requirement description]
- [ ] **REQ-F2**: [Requirement description]
- [ ] **REQ-F3**: [Requirement description]

### Non-Functional Requirements

- [ ] **REQ-NF1**: Performance - [specific metric]
- [ ] **REQ-NF2**: Security - [specific requirement]
- [ ] **REQ-NF3**: Usability - [specific requirement]

## Technical Approach

### Architecture Overview

[High-level design description]

```
[ASCII diagram or description of component interaction]
```

### Components to Create/Modify

| Component | Action | Description |
|-----------|--------|-------------|
| `path/to/file.py` | Create | New service for X |
| `path/to/other.py` | Modify | Add Y functionality |

### Patterns to Follow

- **Pattern 1**: See `path/to/example.py` - [description]
- **Pattern 2**: See `path/to/example2.py` - [description]

### Data Model Changes

[If applicable, describe any database/model changes]

## Implementation Plan

### Phase 1: [Foundation] - [Est. Time]

1. [ ] Task 1.1: [Description]
2. [ ] Task 1.2: [Description]

### Phase 2: [Core Feature] - [Est. Time]

1. [ ] Task 2.1: [Description]
2. [ ] Task 2.2: [Description]

### Phase 3: [Testing & Polish] - [Est. Time]

1. [ ] Write unit tests
2. [ ] Write integration tests
3. [ ] Update documentation
4. [ ] Manual testing

## Acceptance Criteria

- [ ] **AC1**: [Specific, testable criterion]
- [ ] **AC2**: [Specific, testable criterion]
- [ ] **AC3**: [Specific, testable criterion]

## Validation Gates

All must pass before completion:

```bash
# Type checking
pyright src/

# Linting
ruff check .

# Tests
pytest tests/ -v

# Coverage (if applicable)
pytest --cov=src --cov-fail-under=80
```

## Dependencies

- [ ] **DEP1**: [Dependency on other work/feature]
- [ ] **DEP2**: [External library requirement]

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| [Risk 1] | High/Med/Low | High/Med/Low | [Mitigation strategy] |

## Out of Scope

- [Explicitly list what is NOT included]

## Estimated Effort

**Size**: [Small / Medium / Large / XLarge]

**Reasoning**: [Brief explanation]

---

*Created: YYYY-MM-DD*
*Last Updated: YYYY-MM-DD*
