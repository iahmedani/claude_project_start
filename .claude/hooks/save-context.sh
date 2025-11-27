#!/usr/bin/env bash
# Hook: Save context snapshot before compaction
# Event: PreCompact

set +e
exec 2>/dev/null

# Consume stdin completely
INPUT=""
while IFS= read -r -t 0.1 line 2>/dev/null; do
    INPUT="${INPUT}${line}"
done

# Create directory
mkdir -p .claude/logs/context-snapshots 2>/dev/null || true

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S" 2>/dev/null || echo "snapshot")

# Get git state if available
BRANCH="unknown"
MODIFIED=""
STAGED=""

if command -v git &>/dev/null && [ -d ".git" ]; then
    BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
    MODIFIED=$(git diff --name-only 2>/dev/null | head -20 || true)
    STAGED=$(git diff --cached --name-only 2>/dev/null | head -20 || true)
fi

# Save snapshot
cat > ".claude/logs/context-snapshots/snapshot-$TIMESTAMP.md" 2>/dev/null << EOF || true
# Context Snapshot - $TIMESTAMP

## Git State
- Branch: $BRANCH
- Modified: $MODIFIED
- Staged: $STAGED

## Notes
Context compacted at this point.
EOF

# Return valid JSON
printf '{}\n'
exit 0
