#!/usr/bin/env node
/**
 * Project Indexing Script
 *
 * Indexes the project for RAG search. Run this:
 * - After initial setup
 * - After significant codebase changes
 * - When RAG search results seem stale
 *
 * Usage:
 *   npx ts-node scripts/index-project.ts [project-path]
 *   npm run index -- [project-path]
 *   PROJECT_PATH=/path/to/project npm run index
 */

import { RAGEngine } from "../rag/engine.js";
import { loadConfig } from "../utils/config.js";
import { existsSync } from "fs";
import { resolve, dirname, join } from "path";

/**
 * Find the project root by looking for markers
 */
function findProjectRoot(startPath: string): string {
  let current = resolve(startPath);

  // Walk up looking for project markers
  for (let i = 0; i < 5; i++) {
    // Check for project markers
    if (
      existsSync(join(current, "project-config.yaml")) ||
      existsSync(join(current, "CLAUDE.md")) ||
      (existsSync(join(current, ".claude")) && !current.endsWith("mcp-server"))
    ) {
      return current;
    }

    const parent = dirname(current);
    if (parent === current) break; // Reached root
    current = parent;
  }

  return startPath; // Fallback to original
}

async function main() {
  // Priority: 1. CLI arg, 2. PROJECT_PATH env, 3. Find from cwd
  let projectPath =
    process.argv[2] ||
    process.env.PROJECT_PATH ||
    findProjectRoot(process.cwd());

  const resolvedPath = resolve(projectPath);

  console.log(`\n🔍 Indexing project at: ${resolvedPath}\n`);

  // Verify path exists
  if (!existsSync(resolvedPath)) {
    console.error(`❌ Path does not exist: ${resolvedPath}`);
    process.exit(1);
  }

  // Load config
  const config = await loadConfig(resolvedPath);
  const projectName = config?.project?.name || "default-project";

  console.log(`📦 Project: ${projectName}`);

  // Determine chromaPath - use env var or default to project's .claude/rag-db
  const chromaPath =
    process.env.CHROMA_PATH || join(resolvedPath, ".claude", "rag-db");

  // Initialize RAG engine
  const ragEngine = new RAGEngine({
    projectPath: resolvedPath,
    collectionName: projectName,
    chromaPath: chromaPath,
  });

  try {
    console.log("⏳ Initializing RAG engine...");
    await ragEngine.initialize();
    console.log("✅ RAG engine initialized\n");

    console.log("📚 Starting indexing...\n");
    console.log(`   Index location: ${chromaPath}\n`);

    const startTime = Date.now();
    const stats = await ragEngine.indexProject();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("\n✨ Indexing complete!\n");
    console.log("📊 Statistics:");
    console.log(`   - Total documents: ${stats.totalDocuments}`);
    console.log(`   - Collections: ${stats.collections.join(", ") || "none"}`);
    console.log(`   - Duration: ${duration}s`);
    console.log(`   - Indexed at: ${stats.lastIndexed}`);
    console.log("");
  } catch (error) {
    console.error("❌ Indexing failed:", error);
    process.exit(1);
  }
}

main();
