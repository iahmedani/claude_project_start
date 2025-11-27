# Claude Orchestrator MCP Server

A Model Context Protocol (MCP) server with RAG (Retrieval-Augmented Generation) capabilities for intelligent project orchestration and context management.

## Features

### RAG-Powered Search

- **Semantic code search** - Find code by intent, not just keywords
- **Documentation search** - Search PRPs, ADRs, and guides
- **Skills retrieval** - Get relevant skill sections on demand
- **Decision recall** - Find past architectural decisions

### Project Context

- **Configuration access** - Read project-config.yaml
- **Workflow state** - Track current phase and progress
- **Resource listing** - Browse PRPs, ADRs, agents, skills

### Workflow Management

- **State updates** - Manage workflow phase transitions
- **Indexing** - Re-index project for fresh search results

### Reusable Prompts

- **create-prp** - Generate Product Requirements Prompts
- **code-review** - Comprehensive code review
- **tdd-cycle** - Test-Driven Development workflow
- **create-adr** - Architecture Decision Records
- **refactor-safely** - Safe refactoring guide
- **debug-issue** - Systematic debugging
- **implement-feature** - Full implementation workflow
- **security-audit** - Security-focused audit

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

2. Update the configuration with your project path:

```json
{
  "mcpServers": {
    "claude-orchestrator": {
      "command": "node",
      "args": ["./mcp-server/dist/index.js"],
      "env": {
        "PROJECT_PATH": "/path/to/your/project",
        "CHROMA_PATH": "/path/to/your/project/.claude/rag-db"
      }
    }
  }
}
```

## Usage

### Initial Indexing

Before using RAG search, index your project:

```bash
npm run index
# or
npm run index /path/to/project
```

### Available Tools

| Tool                    | Description                        |
| ----------------------- | ---------------------------------- |
| `get_project_context`   | Get comprehensive project context  |
| `search_codebase`       | Semantic search across source code |
| `search_documentation`  | Search PRPs, ADRs, and guides      |
| `get_relevant_skill`    | Retrieve relevant skill sections   |
| `recall_decision`       | Find past architectural decisions  |
| `update_workflow_state` | Update workflow phase/task         |
| `index_project`         | Re-index project for RAG           |
| `get_rag_stats`         | Get indexing statistics            |

### Available Resources

| URI                      | Description                  |
| ------------------------ | ---------------------------- |
| `project://config`       | Project configuration (YAML) |
| `project://state`        | Workflow state               |
| `project://claude-md`    | CLAUDE.md instructions       |
| `project://prps`         | List of PRPs                 |
| `project://adrs`         | List of ADRs                 |
| `project://agents`       | Available agents             |
| `project://skills`       | Available skills             |
| `project://commands`     | Slash commands               |
| `project://prp/{name}`   | Specific PRP content         |
| `project://adr/{name}`   | Specific ADR content         |
| `project://agent/{name}` | Specific agent definition    |
| `project://skill/{name}` | Specific skill content       |

### Available Prompts

| Prompt              | Arguments                              |
| ------------------- | -------------------------------------- |
| `create-prp`        | feature_name, description, tech_stack? |
| `code-review`       | files, focus?                          |
| `tdd-cycle`         | feature, test_framework?               |
| `create-adr`        | title, context, options?               |
| `refactor-safely`   | target, goal                           |
| `debug-issue`       | symptom, expected, context?            |
| `implement-feature` | prp_name                               |
| `security-audit`    | scope, checklist?                      |

## Architecture

```
mcp-server/
├── src/
│   ├── index.ts           # MCP server entry point
│   ├── tools/
│   │   └── index.ts       # Tool definitions and handlers
│   ├── resources/
│   │   └── index.ts       # Resource definitions and handlers
│   ├── prompts/
│   │   └── index.ts       # Prompt templates
│   ├── rag/
│   │   └── engine.ts      # RAG engine with ChromaDB
│   ├── utils/
│   │   └── config.ts      # Configuration utilities
│   └── scripts/
│       └── index-project.ts  # Indexing script
├── package.json
├── tsconfig.json
└── README.md
```

## RAG Engine

The RAG engine uses ChromaDB for vector storage with three collections:

1. **Code Collection** - Source code chunks (~100 lines with overlap)
2. **Docs Collection** - Documentation sections (split by headers)
3. **Skills Collection** - Skill sections (split by headers)

### Supported File Types

**Code:**

- TypeScript (.ts, .tsx)
- JavaScript (.js, .jsx)
- Python (.py, .pyi)
- Go (.go)
- Rust (.rs)
- Java (.java, .kt)
- Ruby (.rb)
- PHP (.php)
- C# (.cs)
- Swift (.swift)
- Vue (.vue)
- Svelte (.svelte)

**Documentation:**

- Markdown (.md)
- YAML frontmatter parsed

## Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Test

```bash
npm test
```

### Lint

```bash
npm run lint
```

## Environment Variables

| Variable       | Description              | Default                         |
| -------------- | ------------------------ | ------------------------------- |
| `PROJECT_PATH` | Path to the project      | Current directory               |
| `CHROMA_PATH`  | Path to ChromaDB storage | `{PROJECT_PATH}/.claude/rag-db` |

## Troubleshooting

### RAG not available

If you see "RAG engine not available", ensure:

1. ChromaDB is running or the path is writable
2. Run `npm run index` to index the project

### Search returns no results

1. Check if the project has been indexed
2. Run `index_project` tool to refresh
3. Verify file types are supported

### Connection issues

1. Ensure the MCP server is built (`npm run build`)
2. Check the path in `.mcp.json` is correct
3. Verify Node.js version >= 18

## License

MIT
