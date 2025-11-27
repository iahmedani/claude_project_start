#!/bin/bash
# Hook: Block dangerous bash commands
# Event: PreToolUse (matcher: Bash)

# Don't exit on errors
set +e

# Read input
INPUT=$(cat 2>/dev/null || echo '{}')

# Need jq to analyze commands
if ! command -v jq &>/dev/null; then
    echo '{}'
    exit 0
fi

# Extract command
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""' 2>/dev/null)

if [ -z "$COMMAND" ]; then
    echo '{}'
    exit 0
fi

# Block dangerous patterns
DANGEROUS=(
    "rm -rf /"
    "rm -rf /*"
    "rm -rf ~"
    ":(){ :|:& };:"
    "mkfs"
    "dd if=/dev"
    "> /dev/sda"
    "chmod -R 777 /"
)

for pattern in "${DANGEROUS[@]}"; do
    if [[ "$COMMAND" == *"$pattern"* ]]; then
        echo '{"action": "block", "message": "🛑 BLOCKED: Dangerous command"}'
        exit 0
    fi
done

# Block access to secrets (except examples)
if [[ "$COMMAND" =~ (cat|less|more|head|tail).*\.(env|pem|key|secret) ]] && [[ ! "$COMMAND" =~ \.example ]]; then
    echo '{"action": "block", "message": "🛑 BLOCKED: Sensitive file access"}'
    exit 0
fi

# Allow command
echo '{}'
