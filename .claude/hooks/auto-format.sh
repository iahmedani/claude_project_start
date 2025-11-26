#!/bin/bash
# Hook: Auto-format code after edits
# Event: PostToolUse (matcher: Edit|Write|MultiEdit)
# Supports: Python, JavaScript, TypeScript, Go, Rust, CSS, JSON, YAML, Markdown

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

# Exit if no file path
if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
    echo '{}'
    exit 0
fi

# Get file extension
EXT="${FILE_PATH##*.}"

case "$EXT" in
    # Python files
    py)
        if command -v ruff &> /dev/null; then
            ruff format "$FILE_PATH" --quiet 2>/dev/null || true
            ruff check "$FILE_PATH" --fix --quiet 2>/dev/null || true
        elif command -v black &> /dev/null; then
            black "$FILE_PATH" --quiet 2>/dev/null || true
        fi
        ;;

    # JavaScript/TypeScript files
    js|jsx|ts|tsx|mjs|cjs)
        if command -v prettier &> /dev/null; then
            prettier --write "$FILE_PATH" --log-level=silent 2>/dev/null || true
        elif command -v npx &> /dev/null; then
            npx prettier --write "$FILE_PATH" --log-level=silent 2>/dev/null || true
        fi
        ;;

    # Vue files
    vue)
        if command -v prettier &> /dev/null; then
            prettier --write "$FILE_PATH" --log-level=silent 2>/dev/null || true
        fi
        ;;

    # Go files
    go)
        if command -v gofmt &> /dev/null; then
            gofmt -w "$FILE_PATH" 2>/dev/null || true
        fi
        if command -v goimports &> /dev/null; then
            goimports -w "$FILE_PATH" 2>/dev/null || true
        fi
        ;;

    # Rust files
    rs)
        if command -v rustfmt &> /dev/null; then
            rustfmt "$FILE_PATH" 2>/dev/null || true
        fi
        ;;

    # CSS/SCSS/Less files
    css|scss|less)
        if command -v prettier &> /dev/null; then
            prettier --write "$FILE_PATH" --log-level=silent 2>/dev/null || true
        fi
        ;;

    # JSON files
    json)
        if command -v prettier &> /dev/null; then
            prettier --write "$FILE_PATH" --log-level=silent 2>/dev/null || true
        elif command -v jq &> /dev/null; then
            # Format with jq (backup original first)
            TMP_FILE=$(mktemp)
            if jq '.' "$FILE_PATH" > "$TMP_FILE" 2>/dev/null; then
                mv "$TMP_FILE" "$FILE_PATH"
            else
                rm -f "$TMP_FILE"
            fi
        fi
        ;;

    # YAML files
    yaml|yml)
        if command -v prettier &> /dev/null; then
            prettier --write "$FILE_PATH" --log-level=silent 2>/dev/null || true
        fi
        ;;

    # Markdown files
    md)
        if command -v prettier &> /dev/null; then
            prettier --write "$FILE_PATH" --log-level=silent --prose-wrap=preserve 2>/dev/null || true
        fi
        ;;

    # HTML files
    html|htm)
        if command -v prettier &> /dev/null; then
            prettier --write "$FILE_PATH" --log-level=silent 2>/dev/null || true
        fi
        ;;

    # SQL files
    sql)
        if command -v sql-formatter &> /dev/null; then
            sql-formatter "$FILE_PATH" -o "$FILE_PATH" 2>/dev/null || true
        fi
        ;;
esac

# Always return success
echo '{}'
