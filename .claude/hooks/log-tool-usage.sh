#!/usr/bin/env bash
# Hook: Log tool usage for debugging
# Event: PostToolUse (all tools)

set +e
exec 2>/dev/null

# Consume stdin completely
INPUT=""
while IFS= read -r -t 0.1 line 2>/dev/null; do
    INPUT="${INPUT}${line}"
done

# Log if possible
if command -v jq &>/dev/null && [ -n "$INPUT" ]; then
    LOG_FILE=".claude/logs/tool-usage.log"
    mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null || true
    TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // "unknown"' 2>/dev/null || echo "unknown")
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "")
    echo "[$TIMESTAMP] $TOOL_NAME" >> "$LOG_FILE" 2>/dev/null || true
fi

# Return valid JSON
printf '{}\n'
exit 0
