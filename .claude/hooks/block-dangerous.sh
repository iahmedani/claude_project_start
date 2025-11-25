#!/bin/bash
# Hook: Block dangerous bash commands
# Event: PreToolUse (matcher: Bash)
# Prevents execution of potentially destructive commands

# Don't exit on error - we need to always return JSON
set +e

# Check for jq
if ! command -v jq &> /dev/null; then
    # jq not available, allow command but warn
    echo '{}' 
    exit 0
fi

# Read JSON input from stdin
INPUT=$(cat)

# Extract command
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""' 2>/dev/null)

if [ -z "$COMMAND" ]; then
    echo '{}'
    exit 0
fi

# Define dangerous patterns
DANGEROUS_PATTERNS=(
    "rm -rf /"
    "rm -rf /*"
    "rm -rf ~"
    "rm -rf \$HOME"
    ":(){ :|:& };:"  # Fork bomb
    "mkfs"
    "dd if=/dev"
    "> /dev/sda"
    "chmod -R 777 /"
    "chown -R"
)

# Check for dangerous patterns
for pattern in "${DANGEROUS_PATTERNS[@]}"; do
    if [[ "$COMMAND" == *"$pattern"* ]]; then
        echo "{\"action\": \"block\", \"message\": \"🛑 BLOCKED: Dangerous command detected: $pattern\"}"
        exit 0
    fi
done

# Block commands that might expose secrets
if [[ "$COMMAND" =~ (cat|less|more|head|tail).*\.(env|pem|key|secret) ]]; then
    # Allow if it's .env.example
    if [[ ! "$COMMAND" =~ \.example ]]; then
        echo "{\"action\": \"block\", \"message\": \"🛑 BLOCKED: Attempted access to sensitive file. Use environment variables instead.\"}"
        exit 0
    fi
fi

# Block recursive delete without confirmation pattern
if [[ "$COMMAND" =~ rm.*-r.*\* ]] && [[ ! "$COMMAND" =~ (node_modules|__pycache__|\.pytest_cache|\.git/|dist/|build/) ]]; then
    echo "{\"action\": \"block\", \"message\": \"⚠️ BLOCKED: Recursive delete with wildcard. Be more specific about what to delete.\"}"
    exit 0
fi

# Return empty JSON (allow command)
echo '{}'
