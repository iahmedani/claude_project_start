/**
 * MCP Tools for Project Orchestration
 *
 * Provides tools that Claude can call for:
 * - Project context retrieval
 * - RAG-powered search
 * - Workflow state management
 * - Pattern and decision recall
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { RAGEngine } from "../rag/engine.js";
import {
  type ProjectConfig,
  loadWorkflowState,
  listPRPs,
  listADRs,
} from "../utils/config.js";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";

/**
 * Register all available tools
 */
export function registerTools(): Tool[] {
  return [
    {
      name: "get_project_context",
      description:
        "Get comprehensive project context including configuration, current workflow state, and recent activity. Use this to understand the project before making changes.",
      inputSchema: {
        type: "object" as const,
        properties: {
          include_config: {
            type: "boolean",
            description: "Include full project configuration",
            default: true,
          },
          include_state: {
            type: "boolean",
            description: "Include workflow state",
            default: true,
          },
          include_prps: {
            type: "boolean",
            description: "List available PRPs",
            default: true,
          },
          include_adrs: {
            type: "boolean",
            description: "List available ADRs",
            default: true,
          },
        },
        required: [],
      },
    },
    {
      name: "search_codebase",
      description:
        "Semantic search across the project codebase. Returns relevant code snippets based on natural language queries. Much more efficient than grep for understanding code.",
      inputSchema: {
        type: "object" as const,
        properties: {
          query: {
            type: "string",
            description:
              "Natural language search query (e.g., 'authentication logic', 'database connection handling')",
          },
          limit: {
            type: "number",
            description: "Maximum number of results",
            default: 10,
          },
        },
        required: ["query"],
      },
    },
    {
      name: "search_documentation",
      description:
        "Search project documentation including PRPs, ADRs, and guides. Use this to find past decisions, requirements, and design rationale.",
      inputSchema: {
        type: "object" as const,
        properties: {
          query: {
            type: "string",
            description: "What you're looking for in the documentation",
          },
          doc_type: {
            type: "string",
            enum: ["all", "prp", "adr", "guide"],
            description: "Type of documentation to search",
            default: "all",
          },
          limit: {
            type: "number",
            description: "Maximum number of results",
            default: 5,
          },
        },
        required: ["query"],
      },
    },
    {
      name: "get_relevant_skill",
      description:
        "Retrieve relevant sections from skill files based on the task at hand. Returns only the most relevant parts to minimize context usage.",
      inputSchema: {
        type: "object" as const,
        properties: {
          query: {
            type: "string",
            description:
              "What you need guidance on (e.g., 'React hooks best practices', 'testing async functions')",
          },
          skill_name: {
            type: "string",
            description:
              "Optional specific skill to search (e.g., 'react-development', 'testing-tdd')",
          },
          limit: {
            type: "number",
            description: "Maximum number of sections to return",
            default: 3,
          },
        },
        required: ["query"],
      },
    },
    {
      name: "recall_decision",
      description:
        "Recall past architectural decisions or implementation patterns from ADRs and PRPs. Use when you need to understand why something was done a certain way.",
      inputSchema: {
        type: "object" as const,
        properties: {
          topic: {
            type: "string",
            description:
              "The topic or decision you want to recall (e.g., 'authentication method', 'database choice')",
          },
          limit: {
            type: "number",
            description: "Maximum number of decisions to return",
            default: 3,
          },
        },
        required: ["topic"],
      },
    },
    {
      name: "update_workflow_state",
      description:
        "Update the current workflow state (phase, active task, active PRP). Use after completing tasks or transitioning between phases.",
      inputSchema: {
        type: "object" as const,
        properties: {
          phase: {
            type: "string",
            enum: [
              "not_initialized",
              "initialization",
              "discovery",
              "planning",
              "design",
              "implementation",
              "testing",
              "review",
              "validation",
              "deployment",
              "complete",
            ],
            description: "New workflow phase",
          },
          active_task: {
            type: "string",
            description: "Current active task description",
          },
          active_prp: {
            type: "string",
            description: "Currently active PRP file name",
          },
          complete_step: {
            type: "string",
            description: "Mark a specific checklist step as complete",
          },
        },
        required: [],
      },
    },
    {
      name: "index_project",
      description:
        "Re-index the project for RAG search. Run this after significant changes to the codebase or documentation.",
      inputSchema: {
        type: "object" as const,
        properties: {
          types: {
            type: "array",
            items: { type: "string", enum: ["code", "docs", "skills"] },
            description: "What to index",
            default: ["code", "docs", "skills"],
          },
        },
        required: [],
      },
    },
    {
      name: "get_rag_stats",
      description:
        "Get statistics about the RAG index including document counts and collections.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
  ];
}

/**
 * Handle tool calls
 */
export async function handleToolCall(
  params: { name: string; arguments?: Record<string, unknown> },
  ragEngine: RAGEngine | null,
  projectConfig: ProjectConfig | null,
  projectPath: string,
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  const args = params.arguments || {};

  try {
    switch (params.name) {
      case "get_project_context":
        return await handleGetProjectContext(args, projectConfig, projectPath);

      case "search_codebase":
        return await handleSearchCodebase(args, ragEngine);

      case "search_documentation":
        return await handleSearchDocumentation(args, ragEngine);

      case "get_relevant_skill":
        return await handleGetRelevantSkill(args, ragEngine);

      case "recall_decision":
        return await handleRecallDecision(args, ragEngine);

      case "update_workflow_state":
        return await handleUpdateWorkflowState(args, projectPath);

      case "index_project":
        return await handleIndexProject(args, ragEngine);

      case "get_rag_stats":
        return await handleGetRagStats(ragEngine);

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${params.name}` }],
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error executing ${params.name}: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}

async function handleGetProjectContext(
  args: Record<string, unknown>,
  projectConfig: ProjectConfig | null,
  projectPath: string,
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  const includeConfig = args.include_config !== false;
  const includeState = args.include_state !== false;
  const includePrps = args.include_prps !== false;
  const includeAdrs = args.include_adrs !== false;

  const context: Record<string, unknown> = {};

  if (includeConfig && projectConfig) {
    context.config = projectConfig;
  }

  if (includeState) {
    const state = await loadWorkflowState(projectPath);
    context.workflow_state = state;
  }

  if (includePrps) {
    const prps = await listPRPs(projectPath);
    context.available_prps = prps;
  }

  if (includeAdrs) {
    const adrs = await listADRs(projectPath);
    context.available_adrs = adrs;
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(context, null, 2),
      },
    ],
  };
}

async function handleSearchCodebase(
  args: Record<string, unknown>,
  ragEngine: RAGEngine | null,
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  if (!ragEngine) {
    return {
      content: [
        {
          type: "text",
          text: "RAG engine not available. Run 'index_project' first or check ChromaDB connection.",
        },
      ],
    };
  }

  const query = args.query as string;
  const limit = (args.limit as number) || 10;

  const results = await ragEngine.searchCode(query, limit);

  if (results.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: `No code results found for: "${query}". Try a different query or run 'index_project' to refresh the index.`,
        },
      ],
    };
  }

  const formatted = results.map((r, i) => {
    const meta = r.metadata as {
      path?: string;
      start_line?: number;
      end_line?: number;
    };
    return `## Result ${i + 1}: ${meta.path || "unknown"} (lines ${meta.start_line}-${meta.end_line})
\`\`\`
${r.content}
\`\`\`
`;
  });

  return {
    content: [{ type: "text", text: formatted.join("\n---\n") }],
  };
}

async function handleSearchDocumentation(
  args: Record<string, unknown>,
  ragEngine: RAGEngine | null,
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  if (!ragEngine) {
    return {
      content: [{ type: "text", text: "RAG engine not available." }],
    };
  }

  const query = args.query as string;
  const limit = (args.limit as number) || 5;
  const docType = (args.doc_type as string) || "all";

  let results = await ragEngine.searchDocs(query, limit);

  // Filter by doc type if specified
  if (docType !== "all") {
    results = results.filter((r) => r.metadata.type === docType);
  }

  if (results.length === 0) {
    return {
      content: [
        { type: "text", text: `No documentation found for: "${query}"` },
      ],
    };
  }

  const formatted = results.map((r, i) => {
    const meta = r.metadata as {
      path?: string;
      section?: string;
      type?: string;
    };
    return `## Result ${i + 1}: ${meta.path} - ${meta.section || ""}
Type: ${meta.type}

${r.content}
`;
  });

  return {
    content: [{ type: "text", text: formatted.join("\n---\n") }],
  };
}

async function handleGetRelevantSkill(
  args: Record<string, unknown>,
  ragEngine: RAGEngine | null,
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  if (!ragEngine) {
    return {
      content: [{ type: "text", text: "RAG engine not available." }],
    };
  }

  const query = args.query as string;
  const skillName = args.skill_name as string | undefined;
  const limit = (args.limit as number) || 3;

  let results = await ragEngine.searchSkills(query, limit);

  // Filter by skill name if specified
  if (skillName) {
    results = results.filter((r) => {
      const name = r.metadata.skill_name as string;
      return name && name.includes(skillName);
    });
  }

  if (results.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: `No relevant skill sections found for: "${query}"`,
        },
      ],
    };
  }

  const formatted = results.map((r, i) => {
    const meta = r.metadata as { skill_name?: string; section?: string };
    return `## ${meta.skill_name || "Skill"} - ${meta.section || "Section"}

${r.content}
`;
  });

  return {
    content: [{ type: "text", text: formatted.join("\n---\n") }],
  };
}

async function handleRecallDecision(
  args: Record<string, unknown>,
  ragEngine: RAGEngine | null,
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  if (!ragEngine) {
    return {
      content: [{ type: "text", text: "RAG engine not available." }],
    };
  }

  const topic = args.topic as string;
  const limit = (args.limit as number) || 3;

  // Search specifically for ADRs and PRPs
  const results = await ragEngine.searchDocs(topic, limit * 2);
  const filtered = results
    .filter((r) => {
      const type = r.metadata.type as string;
      return type === "adr" || type === "prp";
    })
    .slice(0, limit);

  if (filtered.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: `No past decisions found for: "${topic}". Check if ADRs/PRPs exist.`,
        },
      ],
    };
  }

  const formatted = filtered.map((r, i) => {
    const meta = r.metadata as {
      path?: string;
      type?: string;
      section?: string;
    };
    return `## Decision ${i + 1}: ${meta.path} (${meta.type?.toUpperCase()})
Section: ${meta.section || "N/A"}

${r.content}
`;
  });

  return {
    content: [{ type: "text", text: formatted.join("\n---\n") }],
  };
}

async function handleUpdateWorkflowState(
  args: Record<string, unknown>,
  projectPath: string,
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  const statePath = join(projectPath, ".claude", "workflow", "STATE.md");

  if (!existsSync(statePath)) {
    return {
      content: [
        {
          type: "text",
          text: "STATE.md not found. Run /project-init first.",
        },
      ],
    };
  }

  const content = await readFile(statePath, "utf-8");
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!yamlMatch?.[1]) {
    return {
      content: [
        { type: "text", text: "Could not parse STATE.md frontmatter." },
      ],
    };
  }

  const state = yaml.load(yamlMatch[1]) as Record<string, unknown>;

  // Update fields if provided
  if (args.phase) state.phase = args.phase;
  if (args.active_task !== undefined) state.active_task = args.active_task;
  if (args.active_prp !== undefined) state.active_prp = args.active_prp;
  state.last_updated = new Date().toISOString();

  // Rebuild content
  const newYaml = yaml.dump(state);
  const newContent = content.replace(
    /^---\n[\s\S]*?\n---/,
    `---\n${newYaml}---`,
  );

  await writeFile(statePath, newContent, "utf-8");

  return {
    content: [
      {
        type: "text",
        text: `Workflow state updated:\n${JSON.stringify(state, null, 2)}`,
      },
    ],
  };
}

async function handleIndexProject(
  args: Record<string, unknown>,
  ragEngine: RAGEngine | null,
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  if (!ragEngine) {
    return {
      content: [
        {
          type: "text",
          text: "RAG engine not available. Check ChromaDB connection.",
        },
      ],
    };
  }

  const stats = await ragEngine.indexProject();

  return {
    content: [
      {
        type: "text",
        text: `Project indexed successfully:
- Total documents: ${stats.totalDocuments}
- Collections: ${stats.collections.join(", ")}
- Indexed at: ${stats.lastIndexed}`,
      },
    ],
  };
}

async function handleGetRagStats(
  ragEngine: RAGEngine | null,
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  if (!ragEngine) {
    return {
      content: [
        {
          type: "text",
          text: "RAG engine not available. Check ChromaDB connection.",
        },
      ],
    };
  }

  const stats = await ragEngine.getStats();

  return {
    content: [
      {
        type: "text",
        text: `RAG Index Statistics:
- Total documents: ${stats.totalDocuments}
- Collections: ${stats.collections.join(", ") || "none"}
- Last indexed: ${stats.lastIndexed || "unknown"}`,
      },
    ],
  };
}
