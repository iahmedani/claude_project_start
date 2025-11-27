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
 */

import { RAGEngine } from "../rag/engine.js";
import { loadConfig } from "../utils/config.js";
import { existsSync } from "fs";
import { resolve } from "path";

async function main() {
  const projectPath = process.argv[2] || process.cwd();
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

  // Initialize RAG engine
  const ragEngine = new RAGEngine({
    projectPath: resolvedPath,
    collectionName: projectName,
    chromaPath: process.env.CHROMA_PATH || `${resolvedPath}/.claude/rag-db`,
  });

  try {
    console.log("⏳ Initializing RAG engine...");
    await ragEngine.initialize();
    console.log("✅ RAG engine initialized\n");

    console.log("📚 Starting indexing...\n");

    const startTime = Date.now();
    const stats = await ragEngine.indexProject();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("\n✨ Indexing complete!\n");
    console.log("📊 Statistics:");
    console.log(`   - Total documents: ${stats.totalDocuments}`);
    console.log(`   - Collections: ${stats.collections.join(", ")}`);
    console.log(`   - Duration: ${duration}s`);
    console.log(`   - Indexed at: ${stats.lastIndexed}`);
    console.log("");
  } catch (error) {
    console.error("❌ Indexing failed:", error);
    process.exit(1);
  }
}

main();
