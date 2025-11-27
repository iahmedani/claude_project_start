#!/bin/bash
# Workflow State Manager v2.0
# Manages workflow state for Claude Project Orchestrator
# Usage: state-manager.sh <command> [args]

set -e

# Paths
STATE_FILE=".claude/workflow/STATE.md"
LOG_FILE=".claude/logs/workflow.log"
HISTORY_FILE=".claude/logs/workflow-history.log"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Phase definitions in order
PHASES=("not_initialized" "initialization" "discovery" "planning" "design" "implementation" "testing" "review" "validation" "deployment" "complete")

# Ensure directories exist
ensure_dirs() {
    mkdir -p "$(dirname "$STATE_FILE")"
    mkdir -p "$(dirname "$LOG_FILE")"
}

# Log event
log_event() {
    local event="$1"
    local details="${2:-}"
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    ensure_dirs
    echo "[$timestamp] $event${details:+ - $details}" >> "$LOG_FILE"
    
    # Also update STATE.md history section
    if [ -f "$STATE_FILE" ]; then
        local short_ts=$(date +"%Y-%m-%d %H:%M")
        # Add to recent activity table (keep last 10)
        sed -i.bak "/^| - | Workflow initialized/d" "$STATE_FILE" 2>/dev/null || true
        sed -i.bak "s/| Timestamp | Event | Details |/| Timestamp | Event | Details |\n|-----------|-------|---------|\n| $short_ts | $event | ${details:-'-'} |/" "$STATE_FILE" 2>/dev/null || true
        rm -f "${STATE_FILE}.bak"
    fi
}

# Get current phase
get_phase() {
    ensure_dirs
    if [ ! -f "$STATE_FILE" ]; then
        echo "not_initialized"
        return
    fi
    grep "^phase:" "$STATE_FILE" 2>/dev/null | head -1 | cut -d: -f2 | tr -d ' ' || echo "not_initialized"
}

# Set phase
set_phase() {
    local new_phase="$1"
    ensure_dirs
    
    if [ ! -f "$STATE_FILE" ]; then
        echo "Error: STATE.md not found. Run /project-init first." >&2
        return 1
    fi
    
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    local old_phase=$(get_phase)
    
    # Update phase
    sed -i.bak "s/^phase:.*/phase: $new_phase/" "$STATE_FILE"
    sed -i.bak "s/^last_updated:.*/last_updated: $timestamp/" "$STATE_FILE"
    rm -f "${STATE_FILE}.bak"
    
    # Update visual progress
    update_progress_visual
    
    log_event "Phase changed" "$old_phase → $new_phase"
    echo -e "${GREEN}✓ Phase updated: $old_phase → $new_phase${NC}"
}

# Mark step complete
mark_complete() {
    local step="$1"
    ensure_dirs
    
    if [ ! -f "$STATE_FILE" ]; then
        echo "Error: STATE.md not found." >&2
        return 1
    fi
    
    # Convert [ ] to [x] for the specific step
    if grep -q "\[ \] $step" "$STATE_FILE"; then
        sed -i.bak "s/- \[ \] $step/- [x] $step/" "$STATE_FILE"
        rm -f "${STATE_FILE}.bak"
        log_event "Step completed" "$step"
        echo -e "${GREEN}✓ Completed: $step${NC}"
        
        # Update visual progress and next action
        update_progress_visual
        update_next_action
    else
        echo -e "${YELLOW}Step already complete or not found: $step${NC}"
    fi
}

# Check if step is complete
is_complete() {
    local step="$1"
    if [ -f "$STATE_FILE" ] && grep -q "\[x\] $step" "$STATE_FILE" 2>/dev/null; then
        echo "yes"
        return 0
    else
        echo "no"
        return 1
    fi
}

# Set active task
set_task() {
    local task="$1"
    local prp="${2:-null}"
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    
    sed -i.bak "s/^active_task:.*/active_task: $task/" "$STATE_FILE"
    sed -i.bak "s/^active_prp:.*/active_prp: $prp/" "$STATE_FILE"
    sed -i.bak "s/^current_task:.*/current_task: $task/" "$STATE_FILE"
    sed -i.bak "s/^prp_file:.*/prp_file: $prp/" "$STATE_FILE"
    sed -i.bak "s/^started_at:.*/started_at: $timestamp/" "$STATE_FILE"
    rm -f "${STATE_FILE}.bak"
    
    log_event "Task started" "$task"
}

# Clear active task
clear_task() {
    sed -i.bak "s/^active_task:.*/active_task: null/" "$STATE_FILE"
    sed -i.bak "s/^current_task:.*/current_task: null/" "$STATE_FILE"
    sed -i.bak "s/^started_at:.*/started_at: null/" "$STATE_FILE"
    sed -i.bak "s/^current_step:.*/current_step: null/" "$STATE_FILE"
    rm -f "${STATE_FILE}.bak"
    
    log_event "Task cleared"
}

# Update visual progress indicator
update_progress_visual() {
    local phase=$(get_phase)
    local visual=""
    
    # Map phases to visual indicators
    case "$phase" in
        "not_initialized") visual="[⬜] Init → [⬜] Discover → [⬜] Plan → [⬜] Design →\n│  [⬜] Implement → [⬜] Test → [⬜] Review → [⬜] Validate → [⬜] Deploy" ;;
        "initialization")  visual="[🔄] Init → [⬜] Discover → [⬜] Plan → [⬜] Design →\n│  [⬜] Implement → [⬜] Test → [⬜] Review → [⬜] Validate → [⬜] Deploy" ;;
        "discovery")       visual="[✅] Init → [🔄] Discover → [⬜] Plan → [⬜] Design →\n│  [⬜] Implement → [⬜] Test → [⬜] Review → [⬜] Validate → [⬜] Deploy" ;;
        "planning")        visual="[✅] Init → [✅] Discover → [🔄] Plan → [⬜] Design →\n│  [⬜] Implement → [⬜] Test → [⬜] Review → [⬜] Validate → [⬜] Deploy" ;;
        "design")          visual="[✅] Init → [✅] Discover → [✅] Plan → [🔄] Design →\n│  [⬜] Implement → [⬜] Test → [⬜] Review → [⬜] Validate → [⬜] Deploy" ;;
        "implementation")  visual="[✅] Init → [✅] Discover → [✅] Plan → [✅] Design →\n│  [🔄] Implement → [⬜] Test → [⬜] Review → [⬜] Validate → [⬜] Deploy" ;;
        "testing")         visual="[✅] Init → [✅] Discover → [✅] Plan → [✅] Design →\n│  [✅] Implement → [🔄] Test → [⬜] Review → [⬜] Validate → [⬜] Deploy" ;;
        "review")          visual="[✅] Init → [✅] Discover → [✅] Plan → [✅] Design →\n│  [✅] Implement → [✅] Test → [🔄] Review → [⬜] Validate → [⬜] Deploy" ;;
        "validation")      visual="[✅] Init → [✅] Discover → [✅] Plan → [✅] Design →\n│  [✅] Implement → [✅] Test → [✅] Review → [🔄] Validate → [⬜] Deploy" ;;
        "deployment")      visual="[✅] Init → [✅] Discover → [✅] Plan → [✅] Design →\n│  [✅] Implement → [✅] Test → [✅] Review → [✅] Validate → [🔄] Deploy" ;;
        "complete")        visual="[✅] Init → [✅] Discover → [✅] Plan → [✅] Design →\n│  [✅] Implement → [✅] Test → [✅] Review → [✅] Validate → [✅] Deploy" ;;
    esac
    
    # Update the visual in STATE.md (complex sed, may need Python for reliability)
    # For now, just log it
    true
}

# Get next recommended action based on state
get_next_action() {
    local phase=$(get_phase)
    local next=""
    
    case "$phase" in
        "not_initialized")
            next="/project-init - Initialize project structure"
            ;;
        "initialization")
            if ! is_complete "Project initialized" > /dev/null 2>&1; then
                next="/project-init - Complete initialization"
            elif ! is_complete "Configuration reviewed" > /dev/null 2>&1; then
                next="Review project-config.yaml and customize for your project"
            else
                next="/primer - Analyze your codebase"
            fi
            ;;
        "discovery")
            if ! is_complete "Codebase analyzed" > /dev/null 2>&1; then
                next="/primer - Analyze codebase"
            else
                next="/project-plan [feature] - Plan your first feature"
            fi
            ;;
        "planning")
            if ! is_complete "PRP created" > /dev/null 2>&1; then
                next="/project-plan [feature] - Create a PRP"
            else
                next="/project-implement [PRP-name] - Start implementation"
            fi
            ;;
        "design")
            next="/project-implement [PRP] - Begin implementation"
            ;;
        "implementation")
            if ! is_complete "Tests written first" > /dev/null 2>&1; then
                next="/project-tdd [feature] - Write tests first"
            elif ! is_complete "Code implemented" > /dev/null 2>&1; then
                next="/project-implement - Continue implementation"
            else
                next="/project-test - Run all tests"
            fi
            ;;
        "testing")
            next="/project-review - Get code reviewed"
            ;;
        "review")
            if ! is_complete "Code reviewed" > /dev/null 2>&1; then
                next="/project-review - Complete code review"
            else
                next="/project-validate - Run validation gates"
            fi
            ;;
        "validation")
            next="/project-deploy - Prepare deployment"
            ;;
        "deployment")
            next="Complete deployment checklist and release"
            ;;
        "complete")
            next="/project-plan [next-feature] - Plan next feature"
            ;;
        *)
            next="/project-status - Check current state"
            ;;
    esac
    
    echo "$next"
}

# Update next action in STATE.md
update_next_action() {
    local next=$(get_next_action)
    
    # Update the next action section
    sed -i.bak "s|⏭️  NEXT:.*|⏭️  NEXT: $next|" "$STATE_FILE" 2>/dev/null || true
    rm -f "${STATE_FILE}.bak"
}

# Show comprehensive status
show_status() {
    ensure_dirs
    
    local phase=$(get_phase)
    local next=$(get_next_action)
    
    # Count completed steps
    local total_steps=0
    local completed_steps=0
    if [ -f "$STATE_FILE" ]; then
        total_steps=$(grep -c "\- \[" "$STATE_FILE" 2>/dev/null || echo "0")
        completed_steps=$(grep -c "\- \[x\]" "$STATE_FILE" 2>/dev/null || echo "0")
    fi
    
    echo ""
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}                    ${CYAN}WORKFLOW STATUS${NC}                                ${BLUE}║${NC}"
    echo -e "${BLUE}╠══════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${BLUE}║${NC}  Current Phase:  ${GREEN}$phase${NC}"
    echo -e "${BLUE}║${NC}  Progress:       ${YELLOW}$completed_steps / $total_steps steps${NC}"
    echo -e "${BLUE}╠══════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${BLUE}║${NC}  ${CYAN}WORKFLOW FLOW${NC}"
    echo -e "${BLUE}║${NC}"
    
    # Visual flow
    case "$phase" in
        "not_initialized") echo -e "${BLUE}║${NC}  ${RED}[⬜]${NC} Init → [⬜] Discover → [⬜] Plan → [⬜] Implement → [⬜] Deploy" ;;
        "initialization")  echo -e "${BLUE}║${NC}  ${YELLOW}[🔄]${NC} Init → [⬜] Discover → [⬜] Plan → [⬜] Implement → [⬜] Deploy" ;;
        "discovery")       echo -e "${BLUE}║${NC}  ${GREEN}[✅]${NC} Init → ${YELLOW}[🔄]${NC} Discover → [⬜] Plan → [⬜] Implement → [⬜] Deploy" ;;
        "planning")        echo -e "${BLUE}║${NC}  ${GREEN}[✅]${NC} Init → ${GREEN}[✅]${NC} Discover → ${YELLOW}[🔄]${NC} Plan → [⬜] Implement → [⬜] Deploy" ;;
        "implementation")  echo -e "${BLUE}║${NC}  ${GREEN}[✅]${NC} Init → ${GREEN}[✅]${NC} Discover → ${GREEN}[✅]${NC} Plan → ${YELLOW}[🔄]${NC} Implement → [⬜] Deploy" ;;
        "review")          echo -e "${BLUE}║${NC}  ${GREEN}[✅]${NC} Init → ${GREEN}[✅]${NC} Discover → ${GREEN}[✅]${NC} Plan → ${GREEN}[✅]${NC} Implement → ${YELLOW}[🔄]${NC} Review" ;;
        "validation")      echo -e "${BLUE}║${NC}  ${GREEN}[✅]${NC} Init → ${GREEN}[✅]${NC} Discover → ${GREEN}[✅]${NC} Plan → ${GREEN}[✅]${NC} Implement → ${YELLOW}[🔄]${NC} Validate" ;;
        "deployment")      echo -e "${BLUE}║${NC}  ${GREEN}[✅]${NC} Init → ${GREEN}[✅]${NC} Discover → ${GREEN}[✅]${NC} Plan → ${GREEN}[✅]${NC} Implement → ${YELLOW}[🔄]${NC} Deploy" ;;
        "complete")        echo -e "${BLUE}║${NC}  ${GREEN}[✅]${NC} Init → ${GREEN}[✅]${NC} Discover → ${GREEN}[✅]${NC} Plan → ${GREEN}[✅]${NC} Implement → ${GREEN}[✅]${NC} Deploy" ;;
        *)                 echo -e "${BLUE}║${NC}  [?] Unknown state" ;;
    esac
    
    echo -e "${BLUE}║${NC}"
    echo -e "${BLUE}╠══════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${BLUE}║${NC}  ${CYAN}➡️  NEXT RECOMMENDED ACTION${NC}"
    echo -e "${BLUE}║${NC}  ${YELLOW}$next${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Initialize state file
init_state() {
    ensure_dirs
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    
    cat > "$STATE_FILE" << 'EOF'
# Workflow State

> **This file tracks the current state of your project workflow.**
> Updated automatically by commands and hooks.

## Current Phase

```yaml
phase: initialization
started: TIMESTAMP_PLACEHOLDER
last_updated: TIMESTAMP_PLACEHOLDER
active_task: null
active_prp: null
```

## Step Completion Checklist

### Phase 1: Initialization
- [x] Project initialized (`/project-init`)
- [ ] Configuration reviewed (`project-config.yaml`)
- [ ] CLAUDE.md customized

### Phase 2: Discovery
- [ ] Codebase analyzed (`/primer`)
- [ ] Architecture understood
- [ ] Patterns documented

### Phase 3: Planning
- [ ] Requirements gathered
- [ ] PRP created (`/project-plan`)
- [ ] Architecture reviewed

### Phase 4: Implementation
- [ ] Tests written first (TDD)
- [ ] Code implemented (`/project-implement`)
- [ ] All tests passing

### Phase 5: Review & Validation
- [ ] Code reviewed (`/project-review`)
- [ ] All quality gates pass (`/project-validate`)
- [ ] Documentation updated

### Phase 6: Deployment
- [ ] Release notes prepared
- [ ] Deployed (`/project-deploy`)

## Recent Activity

| Timestamp | Event | Details |
|-----------|-------|---------|
| TIMESTAMP_PLACEHOLDER | Project initialized | Ready for development |

## Next Recommended Action

```
⏭️  NEXT: Run /primer to analyze your codebase
```

---
*State file for Claude Project Orchestrator*
EOF

    sed -i.bak "s/TIMESTAMP_PLACEHOLDER/$timestamp/g" "$STATE_FILE"
    rm -f "${STATE_FILE}.bak"
    
    log_event "State initialized"
    echo -e "${GREEN}✓ Workflow state initialized${NC}"
}

# Main command handler
case "${1:-status}" in
    init)
        init_state
        ;;
    get-phase)
        get_phase
        ;;
    set-phase)
        set_phase "$2"
        ;;
    complete)
        mark_complete "$2"
        ;;
    is-complete)
        is_complete "$2"
        ;;
    set-task)
        set_task "$2" "$3"
        ;;
    clear-task)
        clear_task
        ;;
    next)
        get_next_action
        ;;
    update-next)
        update_next_action
        ;;
    status)
        show_status
        ;;
    log)
        log_event "$2" "$3"
        ;;
    *)
        echo "Claude Project Orchestrator - State Manager"
        echo ""
        echo "Usage: $0 <command> [args]"
        echo ""
        echo "Commands:"
        echo "  init              Initialize state file"
        echo "  status            Show workflow status"
        echo "  get-phase         Get current phase"
        echo "  set-phase <phase> Set workflow phase"
        echo "  complete <step>   Mark a step as complete"
        echo "  is-complete <step> Check if step is complete"
        echo "  set-task <name> [prp] Set active task"
        echo "  clear-task        Clear active task"
        echo "  next              Get next recommended action"
        echo "  update-next       Update next action in STATE.md"
        echo "  log <event> [details] Log a workflow event"
        exit 1
        ;;
esac
