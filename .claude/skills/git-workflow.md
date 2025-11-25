# Git Workflow Skill

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

```
main
├── develop (optional)
│   ├── feature/user-authentication
│   ├── feature/payment-integration
│   ├── bugfix/login-error
│   └── hotfix/security-patch
```

### Branch Naming

```bash
feature/ABC-123-short-description
bugfix/ABC-456-fix-issue
hotfix/critical-security-fix
release/v1.2.0
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
