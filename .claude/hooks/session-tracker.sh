#!/usr/bin/env bash
# Hook: Track session activity
# Event: Stop

set +e
exec 2>/dev/null

# Consume stdin completely
INPUT=""
while IFS= read -r -t 0.1 line 2>/dev/null; do
    INPUT="${INPUT}${line}"
done

# Log session end
mkdir -p .claude/logs 2>/dev/null || true

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "unknown")
echo "[$TIMESTAMP] Session checkpoint" >> .claude/logs/session.log 2>/dev/null || true

# Count git changes if available
if command -v git &>/dev/null && [ -d ".git" ]; then
    MODIFIED=$(git diff --name-only 2>/dev/null | wc -l | tr -d ' ' || echo "0")
    STAGED=$(git diff --cached --name-only 2>/dev/null | wc -l | tr -d ' ' || echo "0")
    if [ "$MODIFIED" != "0" ] || [ "$STAGED" != "0" ]; then
        echo "  - Modified: $MODIFIED, Staged: $STAGED" >> .claude/logs/session.log 2>/dev/null || true
    fi
fi

# Return valid JSON
printf '{}\n'
exit 0
