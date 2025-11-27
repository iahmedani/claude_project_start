#!/usr/bin/env bash
# Hook: Auto-format code after edits
# Event: PostToolUse (matcher: Edit|Write|MultiEdit)

set +e
exec 2>/dev/null

# Consume stdin completely (required by hook protocol)
INPUT=""
while IFS= read -r -t 0.1 line 2>/dev/null; do
    INPUT="${INPUT}${line}"
done

# Try to get file path
FILE_PATH=""
if command -v jq &>/dev/null && [ -n "$INPUT" ]; then
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // ""' 2>/dev/null || true)
fi

# Format if file exists
if [ -n "$FILE_PATH" ] && [ -f "$FILE_PATH" ]; then
    EXT="${FILE_PATH##*.}"
    case "$EXT" in
        py) command -v ruff &>/dev/null && ruff format "$FILE_PATH" --quiet 2>/dev/null || true ;;
        js|jsx|ts|tsx|mjs|cjs|vue|css|scss|json|yaml|yml|md|html)
            command -v prettier &>/dev/null && prettier --write "$FILE_PATH" --log-level=silent 2>/dev/null || true ;;
        go) command -v gofmt &>/dev/null && gofmt -w "$FILE_PATH" 2>/dev/null || true ;;
        rs) command -v rustfmt &>/dev/null && rustfmt "$FILE_PATH" 2>/dev/null || true ;;
    esac
fi

# Return valid JSON
printf '{}\n'
exit 0
