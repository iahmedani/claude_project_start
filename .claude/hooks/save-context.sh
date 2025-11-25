#!/bin/bash
# PreCompact hook: Save important context before compaction
# Preserves key information when context is about to be compressed

input=$(cat)
timestamp=$(date '+%Y-%m-%d_%H-%M-%S')

# Create context snapshots directory
mkdir -p .claude/logs/context-snapshots

# Get current working state
current_branch=$(git branch --show-current 2>/dev/null || echo "unknown")
modified_files=$(git diff --name-only 2>/dev/null | head -20)
staged_files=$(git diff --cached --name-only 2>/dev/null | head -20)

# Save snapshot
cat > ".claude/logs/context-snapshots/snapshot-$timestamp.md" << EOF
# Context Snapshot - $timestamp

## Git State
- Branch: $current_branch
- Modified files:
$modified_files

- Staged files:
$staged_files

## Recent Progress
Check docs/progress/PROGRESS.md for current task status.

## Notes
Context was compacted at this point. Review this snapshot if you need to recover context.
EOF

echo "{}"
