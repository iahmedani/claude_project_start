# Git Workflow Skill

> **Related**: `ci-cd` (Git in pipelines), `docker-kubernetes` (GitOps)

## Commit Message Convention

Use Conventional Commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code change, no feature/fix
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add JWT token refresh endpoint

Implements automatic token refresh when access token expires.

Closes #123
```

```bash
fix(api): handle null response in user fetch

The API was crashing when user data was missing.
Added null check and default values.

Fixes #456
```

## Branch Strategy

### GitHub Flow (Recommended)

```
main (protected) ←── PR ←── feature/your-feature
     ↓                           ↑
  deploy                   development
```

### Branch Types

| Prefix       | Purpose          | Example                    |
| ------------ | ---------------- | -------------------------- |
| `feature/*`  | New features     | `feature/user-auth`        |
| `fix/*`      | Bug fixes        | `fix/login-error`          |
| `docs/*`     | Documentation    | `docs/api-readme`          |
| `refactor/*` | Code refactoring | `refactor/extract-service` |
| `test/*`     | Test additions   | `test/user-validation`     |
| `hotfix/*`   | Critical fixes   | `hotfix/security-patch`    |
| `release/*`  | Release prep     | `release/v1.2.0`           |

### Branch Naming

```bash
feature/ABC-123-short-description
fix/ABC-456-fix-login-issue
hotfix/critical-security-fix
release/v1.2.0
```

### Daily Workflow

```bash
# 1. Start from updated main
git checkout main && git pull origin main

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Make changes + tests
# ... work ...

# 4. Push and create PR
git push -u origin feature/new-feature
gh pr create --title "feat: Add feature" --body "..."

# 5. After review → Merge to main
```

## Common Git Operations

### Starting New Work

```bash
# Update main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/new-feature

# Work on feature...
git add -p  # Interactive staging
git commit -m "feat: add new feature"
```

### Keeping Up to Date

```bash
# Rebase on main (preferred for feature branches)
git fetch origin
git rebase origin/main

# Or merge if you prefer
git merge origin/main
```

### Creating a PR

```bash
# Push branch
git push -u origin feature/new-feature

# Create PR with gh CLI
gh pr create --title "feat: Add new feature" \
  --body "Description of changes" \
  --base main
```

### Squash Commits Before PR

```bash
# Interactive rebase last N commits
git rebase -i HEAD~3

# Mark commits as 'squash' or 'fixup'
# Edit commit message
```

## Git Worktrees for Parallel Work

```bash
# Create worktree for parallel development
git worktree add ../project-feature-a feature-a
cd ../project-feature-a

# Work independently, then clean up
git worktree remove ../project-feature-a
```

## Recovery Commands

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo staged changes
git restore --staged .

# Discard all local changes
git restore .

# Find lost commits
git reflog
git cherry-pick <commit-hash>
```

## Best Practices

1. **Commit early, commit often** - Small, atomic commits
2. **Write meaningful messages** - Future you will thank you
3. **Review before committing** - Use `git diff --staged`
4. **Never force push to shared branches**
5. **Keep main/develop always deployable**
