#!/bin/bash
# Hook: Log tool usage for debugging
# Event: PostToolUse (all tools)

# Don't exit on errors
set +e

# Read input
INPUT=$(cat 2>/dev/null || echo '{}')

# Log only if jq is available
if command -v jq &> /dev/null; then
    LOG_FILE=".claude/logs/tool-usage.log"
    mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null

    TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // "unknown"' 2>/dev/null)
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

    echo "[$TIMESTAMP] $TOOL_NAME" >> "$LOG_FILE" 2>/dev/null
fi

# Always return valid JSON
echo '{}'
