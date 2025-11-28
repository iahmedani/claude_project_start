---
name: project-deploy
description: "Prepare for deployment: generate release notes, update version, create deployment checklist."
tools: Read, Write, Edit, Bash(git:*), Bash(gh:*)
---

# Deployment Preparation

Prepare project for deployment with release notes and checklists.

**Version:** $ARGUMENTS (or auto-detect from tags)

## Prerequisites Check

1. All validation gates passed (`/project-validate`)
2. Code reviewed and approved
3. Clean git state
4. On correct branch (main/master)

## Deployment Process

### Step 1: Verify Ready State
```bash
# Check branch
git branch --show-current

# Check for uncommitted changes
git status --porcelain

# Verify last validation passed
cat docs/progress/VALIDATION-*.md 2>/dev/null | head -20
```

### Step 2: Determine Version
```bash
# Get latest tag
git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0"

# Suggest next version based on changes
```

Version bump rules:
- PATCH (0.0.x): Bug fixes
- MINOR (0.x.0): New features
- MAJOR (x.0.0): Breaking changes

### Step 3: Generate Release Notes

Use **documenter** subagent:
```
Use the documenter subagent to:
1. Analyze commits since last release
2. Categorize changes (features, fixes, etc.)
3. Generate release notes
```

Create `RELEASE-[version].md`:
```markdown
# Release [version]

**Date:** [date]

## 🚀 New Features
- [Feature 1]
- [Feature 2]

## 🐛 Bug Fixes
- [Fix 1]
- [Fix 2]

## 📝 Documentation
- [Doc update 1]

## ⚠️ Breaking Changes
- [Breaking change if any]

## 🔧 Technical Changes
- [Internal change 1]

## Contributors
- [list]
```

### Step 4: Update CHANGELOG
Prepend release notes to CHANGELOG.md.

### Step 5: Update Version
Update version in:
- `pyproject.toml`
- `package.json`
- `__version__` in code

### Step 6: Deployment Checklist

Create `docs/progress/DEPLOY-[version]-CHECKLIST.md`:
```markdown
# Deployment Checklist: [version]

## Pre-Deployment
- [ ] All tests passing
- [ ] Code review approved
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version bumped

## Deployment Steps
- [ ] Create release branch/tag
- [ ] Build artifacts
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Deploy to production

## Post-Deployment
- [ ] Verify production health
- [ ] Monitor for errors
- [ ] Notify stakeholders
- [ ] Update project status
```

### Step 7: Create Tag and Release
```bash
# Tag release
git tag -a v[version] -m "Release [version]"

# Push tag
git push origin v[version]

# Create GitHub release (if gh available)
gh release create v[version] --title "[version]" --notes-file RELEASE-[version].md
```

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║  🚀 DEPLOYMENT PREPARED                                       ║
╠══════════════════════════════════════════════════════════════╣
║  Version: [version]                                           ║
║  Previous: [previous version]                                 ║
╠══════════════════════════════════════════════════════════════╣
║  CHANGES INCLUDED                                             ║
║  ├── Features:      [count]                                   ║
║  ├── Bug Fixes:     [count]                                   ║
║  ├── Commits:       [count]                                   ║
║  └── Contributors:  [count]                                   ║
╠══════════════════════════════════════════════════════════════╣
║  FILES CREATED/UPDATED                                        ║
║  • RELEASE-[version].md                                       ║
║  • CHANGELOG.md                                               ║
║  • DEPLOY-[version]-CHECKLIST.md                             ║
╠══════════════════════════════════════════════════════════════╣
║  ✅ WORKFLOW COMPLETE                                         ║
║  ───────────────────────────────────────────────────────────  ║
║  ➡️  NEXT STEPS:                                              ║
║  1. Review release notes                                      ║
║  2. Follow deployment checklist                               ║
║  3. Push tag: git push origin v[version]                      ║
╚══════════════════════════════════════════════════════════════╝
```
