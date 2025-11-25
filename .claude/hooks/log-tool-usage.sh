#!/bin/bash
# Hook: Log tool usage for debugging and audit trail
# Event: PostToolUse (all tools)

set +e

LOG_DIR=".claude/logs"
LOG_FILE="$LOG_DIR/tool-usage.log"

# Ensure log directory exists
mkdir -p "$LOG_DIR" 2>/dev/null

# Check for jq (optional - will work without it)
HAS_JQ=false
if command -v jq &> /dev/null; then
    HAS_JQ=true
fi

# Read JSON input from stdin
INPUT=$(cat)

# Get timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

if [ "$HAS_JQ" = true ]; then
    # Extract tool info with jq
    TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // "unknown"' 2>/dev/null)
    TOOL_RESULT=$(echo "$INPUT" | jq -r '.tool_output | type' 2>/dev/null)
else
    # Basic extraction without jq
    TOOL_NAME="unknown"
    TOOL_RESULT="unknown"
fi

# Log the tool usage
echo "[$TIMESTAMP] Tool: $TOOL_NAME | Result: $TOOL_RESULT" >> "$LOG_FILE" 2>/dev/null

# Always return success (don't block)
echo '{}'
