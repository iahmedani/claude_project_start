#!/bin/bash
# Claude Project Orchestrator - Setup Script
# Usage: ./setup.sh [target-directory]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-.}"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    Claude Project Orchestrator - Setup Script                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Resolve target directory
if [[ "$TARGET_DIR" != /* ]]; then
    TARGET_DIR="$(pwd)/$TARGET_DIR"
fi

echo -e "${YELLOW}Target directory:${NC} $TARGET_DIR"
echo ""

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Check if .claude already exists
if [ -d "$TARGET_DIR/.claude" ]; then
    echo -e "${YELLOW}⚠️  .claude directory already exists in target${NC}"
    read -p "Overwrite? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Aborted.${NC}"
        exit 1
    fi
    rm -rf "$TARGET_DIR/.claude"
fi

# Copy .claude directory
echo -e "${GREEN}📁 Copying .claude directory...${NC}"
cp -r "$SCRIPT_DIR/.claude" "$TARGET_DIR/.claude"

# Copy CLAUDE.md
echo -e "${GREEN}📄 Copying CLAUDE.md...${NC}"
cp "$SCRIPT_DIR/CLAUDE.md" "$TARGET_DIR/CLAUDE.md"

# Copy project-config.yaml
echo -e "${GREEN}⚙️  Copying project-config.yaml template...${NC}"
cp "$SCRIPT_DIR/project-config.yaml" "$TARGET_DIR/project-config.yaml"

# Create docs directory structure
echo -e "${GREEN}📂 Creating documentation structure...${NC}"
mkdir -p "$TARGET_DIR/docs/planning"
mkdir -p "$TARGET_DIR/docs/architecture"
mkdir -p "$TARGET_DIR/docs/progress"
mkdir -p "$TARGET_DIR/templates"

# Copy templates
if [ -d "$SCRIPT_DIR/templates" ]; then
    cp -r "$SCRIPT_DIR/templates/"* "$TARGET_DIR/templates/" 2>/dev/null || true
fi

# Create logs directory
mkdir -p "$TARGET_DIR/.claude/logs"

# Make hooks executable
echo -e "${GREEN}🔧 Making hooks executable...${NC}"
chmod +x "$TARGET_DIR/.claude/hooks/"*.sh 2>/dev/null || true

# Create initial progress tracking file
cat > "$TARGET_DIR/docs/progress/PROGRESS.md" << 'EOF'
# Project Progress

## Current Phase
- [ ] Planning
- [ ] Design
- [ ] Implementation
- [ ] Testing
- [ ] Review
- [ ] Deployment

## Active Tasks

| Task | Status | Assignee | Due |
|------|--------|----------|-----|
| - | - | - | - |

## Completed Milestones

- [x] Project initialized

## Blockers & Risks

None identified yet.

## Notes

---
*Last updated: $(date +%Y-%m-%d)*
EOF


# Check for gh CLI
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✓ GitHub CLI detected${NC}"
else
    echo -e "${YELLOW}⚠️  GitHub CLI not found. Install for full GitHub integration.${NC}"
fi

# Check for Python tools
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✓ Python detected${NC}"
    
    # Check for common tools
    for tool in ruff pyright pytest; do
        if command -v $tool &> /dev/null || python3 -m $tool --version &> /dev/null 2>&1; then
            echo -e "${GREEN}  ✓ $tool${NC}"
        else
            echo -e "${YELLOW}  ⚠️  $tool not found - install with: pip install $tool${NC}"
        fi
    done
else
    echo -e "${YELLOW}⚠️  Python not detected${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║    ✅ Setup Complete!                                          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. cd $TARGET_DIR"
echo "2. Edit project-config.yaml with your project details"
echo "3. Customize CLAUDE.md for your project"
echo "4. Run 'claude' to start coding!"
echo ""
echo -e "${BLUE}Available commands:${NC}"
echo "  /project:init     - Initialize project structure"
echo "  /project:plan     - Create a feature plan (PRP)"
echo "  /project:implement - Implement a feature"
echo "  /project:test     - Run TDD workflow"
echo "  /project:review   - Code review"
echo "  /project:status   - Project dashboard"
echo ""
