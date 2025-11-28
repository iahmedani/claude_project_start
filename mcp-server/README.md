# Claude Orchestrator MCP Server

A Model Context Protocol (MCP) server for project orchestration and context management.

## Features

### Project Context Management

- **Configuration access** - Read project-config.yaml
- **Workflow state** - Track current phase and progress
- **PRPs and ADRs** - Access planning and architecture documents

### Workflow Tracking

- **State updates** - Manage workflow phase transitions
- **Indexing** - Re-index project files

## Installation

```bash
cd mcp-server
npm install
npm run build
```

## Configuration

1. Copy the MCP configuration template:

```bash
cp .mcp.json.template .mcp.json
```

2. The setup script automatically configures paths. For manual setup:

```json
{
  "mcpServers": {
    "claude-orchestrator": {
      "command": "node",
      "args": ["./mcp-server/dist/index.js"],
      "env": {
        "PROJECT_PATH": "/path/to/your/project"
      }
    }
  }
}
```

## Available Tools

| Tool                    | Description                              |
| ----------------------- | ---------------------------------------- |
| `get_project_context`   | Get config, workflow state, PRPs, ADRs   |
| `update_workflow_state` | Update workflow phase/task               |
| `index_project`         | Re-index project files                   |

### get_project_context

Get comprehensive project context including configuration, current workflow state, and available PRPs/ADRs.

```typescript
// Input
{
  include_config?: boolean,  // default: true
  include_state?: boolean,   // default: true
  include_prps?: boolean,    // default: true
  include_adrs?: boolean     // default: true
}
```

### update_workflow_state

Update the current workflow state (phase, active task, active PRP).

```typescript
// Input
{
  phase?: "not_initialized" | "initialization" | "discovery" | "planning" |
          "design" | "implementation" | "testing" | "review" |
          "validation" | "deployment" | "complete",
  active_task?: string,
  active_prp?: string,
  complete_step?: string
}
```

### index_project

Re-index the project files for fresh context.

```typescript
// Input
{
  types?: ["code", "docs", "skills"]  // default: all
}
```

## Note on Search

For code search, use Claude's built-in tools which are more reliable:
- **Grep** - Pattern search in files
- **Glob** - Find files by pattern

The RAG-based search tools were removed in favor of these built-in capabilities.

## Architecture

```
mcp-server/
├── src/
│   ├── index.ts           # MCP server entry point
│   ├── tools/
│   │   └── index.ts       # 3 tool definitions and handlers
│   ├── resources/
│   │   └── index.ts       # Resource definitions
│   ├── prompts/
│   │   └── index.ts       # Prompt templates
│   ├── rag/
│   │   └── engine.ts      # File indexing (keyword-based)
│   ├── utils/
│   │   └── config.ts      # Configuration utilities
│   └── scripts/
│       └── index-project.ts  # Indexing script
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Index Project

```bash
npm run index
```

## Environment Variables

| Variable       | Description         | Default           |
| -------------- | ------------------- | ----------------- |
| `PROJECT_PATH` | Path to the project | Current directory |

## Troubleshooting

### MCP server not connecting

1. Ensure the server is built: `npm run build`
2. Check `.mcp.json` has correct paths
3. Verify Node.js version >= 18

### Tools not appearing

1. Verify `.mcp.json` configuration
2. Restart Claude Code after changes

## License

MIT
