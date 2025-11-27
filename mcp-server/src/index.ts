#!/usr/bin/env node
/**
 * Claude Orchestrator MCP Server
 *
 * A Model Context Protocol server with RAG capabilities for
 * intelligent project orchestration and context management.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { registerTools, handleToolCall } from "./tools/index.js";
import { registerResources, handleResourceRead } from "./resources/index.js";
import { registerPrompts, handlePromptGet } from "./prompts/index.js";
import { RAGEngine } from "./rag/engine.js";
import { loadConfig, type ProjectConfig } from "./utils/config.js";

// Global instances
let ragEngine: RAGEngine | null = null;
let projectConfig: ProjectConfig | null = null;

async function main() {
  const server = new Server(
    {
      name: "claude-orchestrator",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    },
  );

  // Initialize configuration
  const projectPath = process.env.PROJECT_PATH || process.cwd();
  projectConfig = await loadConfig(projectPath);

  // Initialize RAG engine
  ragEngine = new RAGEngine({
    projectPath,
    collectionName: projectConfig?.project?.name || "default-project",
    chromaPath: process.env.CHROMA_PATH || `${projectPath}/.claude/rag-db`,
  });

  // Try to initialize RAG (non-blocking if ChromaDB not available)
  try {
    await ragEngine.initialize();
    console.error("[MCP] RAG engine initialized successfully");
  } catch (error) {
    console.error(
      "[MCP] RAG engine initialization failed (continuing without RAG):",
      error,
    );
    ragEngine = null;
  }

  // Register tool handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: registerTools(),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return handleToolCall(
      request.params,
      ragEngine,
      projectConfig,
      projectPath,
    );
  });

  // Register resource handlers
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: registerResources(projectPath),
  }));

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    return handleResourceRead(request.params.uri, projectPath);
  });

  // Register prompt handlers
  server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: registerPrompts(),
  }));

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    return handlePromptGet(request.params.name, request.params.arguments);
  });

  // Error handling
  server.onerror = (error) => {
    console.error("[MCP Error]", error);
  };

  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.error("[MCP] Shutting down...");
    await server.close();
    process.exit(0);
  });

  // Start server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[MCP] Claude Orchestrator MCP Server running on stdio");
}

main().catch((error) => {
  console.error("[MCP] Fatal error:", error);
  process.exit(1);
});
