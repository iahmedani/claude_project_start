#!/bin/bash
# Hook: Auto-format code after edits
# Event: PostToolUse (matcher: Edit|Write|MultiEdit)

# Don't exit on errors
set +e

# Read JSON input (save for potential future use)
INPUT=$(cat 2>/dev/null || echo '{}')

# Extract file path using jq if available
FILE_PATH=""
if command -v jq &> /dev/null; then
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // ""' 2>/dev/null)
fi

# Exit early if no file path or file doesn't exist
if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
    echo '{}'
    exit 0
fi

# Get file extension
EXT="${FILE_PATH##*.}"

# Format based on file type (all commands run silently)
case "$EXT" in
    py)
        command -v ruff &>/dev/null && ruff format "$FILE_PATH" --quiet 2>/dev/null
        ;;
    js|jsx|ts|tsx|mjs|cjs|vue|css|scss|json|yaml|yml|md|html)
        command -v prettier &>/dev/null && prettier --write "$FILE_PATH" --log-level=silent 2>/dev/null
        ;;
    go)
        command -v gofmt &>/dev/null && gofmt -w "$FILE_PATH" 2>/dev/null
        ;;
    rs)
        command -v rustfmt &>/dev/null && rustfmt "$FILE_PATH" 2>/dev/null
        ;;
esac

# Always return valid JSON
echo '{}'
