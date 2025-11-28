/**
 * MCP Tools for Project Orchestration (Simplified)
 *
 * Provides 3 essential tools:
 * - get_project_context: Composite view of project state
 * - update_workflow_state: Track workflow progress
 * - index_project: Re-index for search
 *
 * Note: RAG search tools removed - use Claude's built-in Grep/Glob
 * which are more reliable for keyword searches.
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
 * Register all available tools (simplified to 3 essential)
 */
export function registerTools(): Tool[] {
  return [
    {
      name: "get_project_context",
      description:
        "Get comprehensive project context including configuration, current workflow state, PRPs, and ADRs. Use this to understand the project before making changes.",
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
        "Re-index the project for search. Run this after significant changes to the codebase or documentation.",
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

      case "update_workflow_state":
        return await handleUpdateWorkflowState(args, projectPath);

      case "index_project":
        return await handleIndexProject(args, ragEngine);

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
          text: "RAG engine not available. Index functionality requires RAG initialization.",
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
