#!/usr/bin/env bash
# Hook: Block dangerous bash commands
# Event: PreToolUse (matcher: Bash)

set +e
exec 2>/dev/null

# Consume stdin completely
INPUT=""
while IFS= read -r -t 0.1 line 2>/dev/null; do
    INPUT="${INPUT}${line}"
done

# Check command if jq available
if command -v jq &>/dev/null && [ -n "$INPUT" ]; then
    COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""' 2>/dev/null || true)

    if [ -n "$COMMAND" ]; then
        # Block dangerous patterns
        case "$COMMAND" in
            *"rm -rf /"*|*"rm -rf /*"*|*"rm -rf ~"*|*":(){ :|:& };:"*|*"mkfs"*|*"dd if=/dev"*|*"> /dev/sda"*|*"chmod -R 777 /"*)
                printf '{"action": "block", "message": "BLOCKED: Dangerous command"}\n'
                exit 0
                ;;
        esac

        # Block secrets access
        if [[ "$COMMAND" =~ (cat|less|more|head|tail).*\.(env|pem|key|secret) ]] && [[ ! "$COMMAND" =~ \.example ]]; then
            printf '{"action": "block", "message": "BLOCKED: Sensitive file access"}\n'
            exit 0
        fi
    fi
fi

# Allow command
printf '{}\n'
exit 0
