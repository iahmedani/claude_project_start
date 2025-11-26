---
name: project-explore
description: "Deep dive exploration into a specific area of the codebase. Use for understanding complex modules or features."
tools: Read, Grep, Glob, Bash(find:*), Bash(cat:*), Bash(head:*)
---

# Deep Dive Exploration

Explore a specific area of the codebase in depth.

**Area to explore:** $ARGUMENTS

## Process

### Step 1: Identify Scope
If $ARGUMENTS is a file path:
- Read the file
- Find related files

If $ARGUMENTS is a concept/feature:
- Search for relevant files
- Map the dependency chain

### Step 2: Map Dependencies

```bash
# Find imports/dependencies
grep -rn "from.*$ARGUMENTS\|import.*$ARGUMENTS" --include="*.py"

# Find usages
grep -rn "$ARGUMENTS" --include="*.py" | grep -v "^#"
```

### Step 3: Use Architect Subagent

Delegate deep analysis to **architect** subagent:
```
Use the architect subagent to:
1. Analyze the architecture of [$ARGUMENTS]
2. Map component relationships
3. Identify patterns used
4. Note any technical debt or concerns
```

### Step 4: Document Findings

Create exploration notes or update existing documentation.

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║  🔍 EXPLORATION COMPLETE                                      ║
╠══════════════════════════════════════════════════════════════╣
║  Area: [explored area]                                        ║
╠══════════════════════════════════════════════════════════════╣
║  KEY FINDINGS                                                 ║
║  ├── Files Analyzed:    [count]                               ║
║  ├── Dependencies:      [list]                                ║
║  ├── Dependents:        [list]                                ║
║  └── Patterns Used:     [list]                                ║
╠══════════════════════════════════════════════════════════════╣
║  INSIGHTS                                                     ║
║  • [insight 1]                                                ║
║  • [insight 2]                                                ║
╠══════════════════════════════════════════════════════════════╣
║  ➡️  SUGGESTED ACTIONS                                        ║
║  • /project-plan [feature] - Plan changes to this area       ║
║  • /project-refactor [area] - Refactor this area             ║
╚══════════════════════════════════════════════════════════════╝
```
