#!/bin/bash
# Quick update script - copies only hooks and STATE.md to target project
# Usage: ./update-hooks.sh /path/to/target-project

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-.}"

if [[ "$TARGET_DIR" != /* ]]; then
    TARGET_DIR="$(pwd)/$TARGET_DIR"
fi

echo "Updating hooks in: $TARGET_DIR"

# Copy hooks
if [ -d "$TARGET_DIR/.claude/hooks" ]; then
    cp "$SCRIPT_DIR/.claude/hooks/"*.sh "$TARGET_DIR/.claude/hooks/"
    chmod +x "$TARGET_DIR/.claude/hooks/"*.sh
    echo "✅ Hooks updated (6 files)"
else
    echo "❌ No .claude/hooks directory in target"
    exit 1
fi

# Copy STATE.md template
if [ -d "$TARGET_DIR/.claude/workflow" ]; then
    cp "$SCRIPT_DIR/.claude/workflow/STATE.md" "$TARGET_DIR/.claude/workflow/"
    echo "✅ STATE.md updated"
fi

# Copy updated project-plan command
if [ -d "$TARGET_DIR/.claude/commands" ]; then
    cp "$SCRIPT_DIR/.claude/commands/project-plan.md" "$TARGET_DIR/.claude/commands/"
    echo "✅ project-plan.md updated"
fi

echo ""
echo "Done! Hook errors should now be fixed."
