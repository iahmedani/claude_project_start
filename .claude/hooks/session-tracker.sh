#!/bin/bash
# Stop hook: Log session completion and update progress
# Runs when the main agent finishes responding

input=$(cat)
timestamp=$(date '+%Y-%m-%d %H:%M:%S')

# Create logs directory if needed
mkdir -p .claude/logs

# Log session activity
echo "[$timestamp] Session checkpoint" >> .claude/logs/session.log

# Count recent changes
if command -v git &> /dev/null && [ -d ".git" ]; then
    modified_count=$(git diff --name-only 2>/dev/null | wc -l | tr -d ' ')
    staged_count=$(git diff --cached --name-only 2>/dev/null | wc -l | tr -d ' ')
    
    if [ "$modified_count" -gt 0 ] || [ "$staged_count" -gt 0 ]; then
        echo "  - Modified files: $modified_count, Staged: $staged_count" >> .claude/logs/session.log
    fi
fi

echo "{}"
