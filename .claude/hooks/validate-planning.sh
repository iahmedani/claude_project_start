#!/usr/bin/env bash
# Hook: Validate planning before implementation
# Event: PreToolUse (matcher: Write|Edit|MultiEdit)

set +e
exec 2>/dev/null

# Consume stdin completely
INPUT=""
while IFS= read -r -t 0.1 line 2>/dev/null; do
    INPUT="${INPUT}${line}"
done

# Check for planning if jq available
if command -v jq &>/dev/null && [ -n "$INPUT" ]; then
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // ""' 2>/dev/null || true)

    # Warn for new source files
    if [ -n "$FILE_PATH" ] && [[ "$FILE_PATH" =~ \.(py|ts|js|tsx|jsx|go|rs)$ ]] && [[ ! "$FILE_PATH" =~ test ]] && [ ! -f "$FILE_PATH" ]; then
        if [ -d "docs/planning" ]; then
            PRP_COUNT=$(find docs/planning -name "PRP-*.md" -mmin -60 2>/dev/null | wc -l | tr -d ' ' || echo "0")
            if [ "$PRP_COUNT" = "0" ]; then
                echo "Tip: Consider running /project-plan first for structured implementation." >&2
            fi
        fi
    fi
fi

# Return valid JSON (allow operation)
printf '{}\n'
exit 0
