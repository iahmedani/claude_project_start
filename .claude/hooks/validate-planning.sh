#!/bin/bash
# Hook: Validate planning before implementation
# Event: PreToolUse (matcher: Write|Edit|MultiEdit)

# Don't exit on errors
set +e

# Read input
INPUT=$(cat 2>/dev/null || echo '{}')

# Only check if jq is available
if command -v jq &> /dev/null; then
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // ""' 2>/dev/null)

    # Only warn for new source files (not test files)
    if [[ "$FILE_PATH" =~ \.(py|ts|js|tsx|jsx|go|rs)$ ]] && [[ ! "$FILE_PATH" =~ test ]] && [ ! -f "$FILE_PATH" ]; then
        # Check for recent PRPs
        if [ -d "docs/planning" ]; then
            PRP_COUNT=$(find docs/planning -name "PRP-*.md" -mmin -60 2>/dev/null | wc -l | tr -d ' ')
            if [ "$PRP_COUNT" -eq 0 ]; then
                echo "💡 Tip: Consider running /project-plan first for structured implementation." >&2
            fi
        fi
    fi
fi

# Always allow and return valid JSON
echo '{}'
