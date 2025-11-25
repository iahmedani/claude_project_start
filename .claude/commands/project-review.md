---
name: project-review
description: "Comprehensive code review using multiple specialized subagents. Reviews code quality, security, and patterns."
tools: Read, Grep, Glob, Bash(git:*), Bash(ruff:*), Bash(pyright:*)
---

# Comprehensive Code Review

Run a thorough code review using specialized subagents.

**Scope to review:** $ARGUMENTS (defaults to recent changes)

## Prerequisites Check

1. Verify uncommitted changes or specify files to review
2. Check workflow state for implementation completion

## Review Process

### Step 1: Identify Review Scope

If no $ARGUMENTS provided:
```bash
# Get recent changed files
git diff --name-only HEAD~5 | grep -E '\.(py|ts|js|tsx|jsx)$'

# Or uncommitted changes
git status --porcelain | awk '{print $2}'
```

### Step 2: Code Quality Review

Use the **reviewer** subagent:
```
Use the reviewer subagent to review:
[list of files or scope]

Focus on:
1. Code structure and organization
2. Naming conventions
3. Function/method design
4. Error handling patterns
5. Documentation quality
6. DRY violations
7. SOLID principles adherence
```

### Step 3: Security Audit

Use the **security-auditor** subagent:
```
Use the security-auditor subagent to audit:
[list of files or scope]

Check for:
1. OWASP Top 10 vulnerabilities
2. Exposed secrets or credentials
3. Input validation
4. SQL injection risks
5. XSS vulnerabilities
6. Authentication/authorization issues
```

### Step 4: Performance Review

Use the **performance-specialist** subagent:
```
Use the performance-specialist subagent to review:
[list of files or scope]

Analyze:
1. Algorithm efficiency
2. Database query optimization
3. Memory usage patterns
4. Caching opportunities
5. Async/await usage
```

### Step 5: Automated Checks

Run automated quality tools:
```bash
# Linting
ruff check [files]

# Type checking
pyright [files]

# Test coverage
pytest --cov --cov-report=term-missing
```

### Step 6: Compile Review Report

Generate review summary in `docs/progress/REVIEW-[date].md`

## Review Report Format

```markdown
# Code Review Report

**Date:** [date]
**Reviewer:** Claude Code (Subagents)
**Scope:** [files/commits reviewed]

## Summary
- 🔴 Critical Issues: [count]
- 🟠 Warnings: [count]
- 🟡 Suggestions: [count]
- ✅ Passing Areas: [count]

## Critical Issues (Must Fix)
[List of blocking issues]

## Warnings (Should Fix)
[List of recommended fixes]

## Suggestions (Could Improve)
[List of optional improvements]

## Security Findings
[Security audit results]

## Performance Notes
[Performance review results]

## Test Coverage
[Coverage statistics]

## Recommendation
[APPROVED / NEEDS WORK / BLOCKED]
```

## Output Format

After review completion:

```
╔══════════════════════════════════════════════════════════════╗
║  📋 CODE REVIEW COMPLETE                                      ║
╠══════════════════════════════════════════════════════════════╣
║  Scope: [files/scope]                                         ║
║  Report: docs/progress/REVIEW-[date].md                      ║
╠══════════════════════════════════════════════════════════════╣
║  FINDINGS                                                     ║
║  ├── 🔴 Critical:    [count]                                  ║
║  ├── 🟠 Warnings:    [count]                                  ║
║  ├── 🟡 Suggestions: [count]                                  ║
║  └── ✅ Passing:     [count]                                  ║
╠══════════════════════════════════════════════════════════════╣
║  VERDICT: [APPROVED ✅ / NEEDS WORK ⚠️ / BLOCKED 🛑]          ║
╠══════════════════════════════════════════════════════════════╣
║  STEP COMPLETED: Code Review                                  ║
║  ───────────────────────────────────────────────────────────  ║
║  [If APPROVED]                                                ║
║  ➡️  NEXT STEP: Run /project:validate for final gates         ║
║                                                               ║
║  [If NEEDS WORK]                                              ║
║  ➡️  NEXT STEP: Fix issues, then /project:review again        ║
╚══════════════════════════════════════════════════════════════╝
```

## Review Checklist

### Code Quality
- [ ] Clear, descriptive names
- [ ] Single responsibility functions
- [ ] Proper error handling
- [ ] Comprehensive docstrings
- [ ] No code duplication
- [ ] Consistent formatting

### Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Proper authentication checks
- [ ] Safe database queries
- [ ] No sensitive data in logs

### Performance
- [ ] Efficient algorithms
- [ ] Appropriate caching
- [ ] No N+1 queries
- [ ] Proper resource cleanup

### Testing
- [ ] Test coverage adequate
- [ ] Edge cases tested
- [ ] Error paths tested
