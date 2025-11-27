#!/bin/bash
# PreCompact hook: Save context snapshot before compaction

# Don't exit on errors
set +e

# Read input (consume stdin)
INPUT=$(cat 2>/dev/null || echo '{}')

# Create directory
mkdir -p .claude/logs/context-snapshots 2>/dev/null

TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')

# Get git state if available
BRANCH="unknown"
MODIFIED=""
STAGED=""

if command -v git &>/dev/null && [ -d ".git" ]; then
    BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
    MODIFIED=$(git diff --name-only 2>/dev/null | head -20)
    STAGED=$(git diff --cached --name-only 2>/dev/null | head -20)
fi

# Save snapshot
cat > ".claude/logs/context-snapshots/snapshot-$TIMESTAMP.md" 2>/dev/null << EOF
# Context Snapshot - $TIMESTAMP

## Git State
- Branch: $BRANCH
- Modified: $MODIFIED
- Staged: $STAGED

## Notes
Context compacted at this point.
EOF

# Always return valid JSON
echo '{}'
