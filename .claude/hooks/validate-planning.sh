#!/bin/bash
# Hook: Validate planning before implementation
# Event: PreToolUse (matcher: Write|Edit|MultiEdit)
# Reminds about planning before major code changes

set +e

# Check for jq
HAS_JQ=false
if command -v jq &> /dev/null; then
    HAS_JQ=true
fi

# Read JSON input from stdin
INPUT=$(cat)

# Extract info
if [ "$HAS_JQ" = true ]; then
    TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // ""' 2>/dev/null)
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // ""' 2>/dev/null)
else
    # Can't analyze without jq, just allow
    echo '{}'
    exit 0
fi

# Only check for Write/Edit on source files
if [[ "$TOOL_NAME" =~ ^(Write|Edit|MultiEdit)$ ]] && [[ "$FILE_PATH" =~ \.(py|ts|js|tsx|jsx|go|rs)$ ]]; then
    
    # Skip test files
    if [[ "$FILE_PATH" =~ test ]]; then
        echo '{}'
        exit 0
    fi
    
    # Skip if file already exists (modifications are usually fine)
    if [ -f "$FILE_PATH" ]; then
        echo '{}'
        exit 0
    fi
    
    # Check if any PRP exists for this work (recent PRPs)
    if [ -d "docs/planning" ]; then
        PRP_COUNT=$(find docs/planning -name "PRP-*.md" -mmin -60 2>/dev/null | wc -l | tr -d ' ')
        
        if [ "$PRP_COUNT" -eq 0 ]; then
            # Just warn, don't block
            echo "💡 Tip: No recent PRPs found. Consider running /project-plan first for structured implementation." >&2
        fi
    fi
fi

# Always allow the operation
echo '{}'
