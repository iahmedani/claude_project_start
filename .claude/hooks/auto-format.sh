#!/bin/bash
# Hook: Auto-format code after edits
# Event: PostToolUse (matcher: Edit|Write|MultiEdit)

set +e

# Check for jq
HAS_JQ=false
if command -v jq &> /dev/null; then
    HAS_JQ=true
fi

# Read JSON input from stdin
INPUT=$(cat)

# Extract file path
if [ "$HAS_JQ" = true ]; then
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // ""' 2>/dev/null)
else
    FILE_PATH=""
fi

# Only format Python files
if [[ "$FILE_PATH" == *.py ]]; then
    # Check if ruff is available
    if command -v ruff &> /dev/null; then
        # Format the file (quiet mode)
        ruff format "$FILE_PATH" --quiet 2>/dev/null || true
        ruff check "$FILE_PATH" --fix --quiet 2>/dev/null || true
    fi
fi

# Only format JavaScript/TypeScript files
if [[ "$FILE_PATH" == *.js ]] || [[ "$FILE_PATH" == *.ts ]] || [[ "$FILE_PATH" == *.jsx ]] || [[ "$FILE_PATH" == *.tsx ]]; then
    # Check if prettier is available
    if command -v prettier &> /dev/null; then
        prettier --write "$FILE_PATH" --loglevel=silent 2>/dev/null || true
    fi
fi

# Always return success
echo '{}'
