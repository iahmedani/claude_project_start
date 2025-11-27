#!/bin/bash
# Stop hook: Log session completion
# Runs when the main agent finishes responding

# Don't exit on errors
set +e

# Read input (consume stdin)
INPUT=$(cat 2>/dev/null || echo '{}')

# Create logs directory
mkdir -p .claude/logs 2>/dev/null

# Log session activity
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
echo "[$TIMESTAMP] Session checkpoint" >> .claude/logs/session.log 2>/dev/null

# Count git changes if available
if command -v git &>/dev/null && [ -d ".git" ]; then
    MODIFIED=$(git diff --name-only 2>/dev/null | wc -l | tr -d ' ')
    STAGED=$(git diff --cached --name-only 2>/dev/null | wc -l | tr -d ' ')

    if [ "$MODIFIED" -gt 0 ] || [ "$STAGED" -gt 0 ]; then
        echo "  - Modified: $MODIFIED, Staged: $STAGED" >> .claude/logs/session.log 2>/dev/null
    fi
fi

# Always return valid JSON
echo '{}'
