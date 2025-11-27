/**
 * RAG Engine - Core retrieval-augmented generation system
 *
 * Provides semantic search over:
 * - Project codebase
 * - Documentation (PRPs, ADRs)
 * - Skills and knowledge base
 * - Past decisions and patterns
 */

import { ChromaClient, Collection, Metadata } from "chromadb";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { join, relative, extname } from "path";
import { glob } from "glob";
import matter from "gray-matter";
import ignoreLib from "ignore";

export interface RAGConfig {
  projectPath: string;
  collectionName: string;
  chromaPath: string;
}

export interface SearchResult {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  distance: number;
}

export interface IndexStats {
  totalDocuments: number;
  collections: string[];
  lastIndexed: string | null;
}

interface DocumentChunk {
  id: string;
  content: string;
  metadata: Metadata;
}

export class RAGEngine {
  private client: ChromaClient | null = null;
  private codeCollection: Collection | null = null;
  private docsCollection: Collection | null = null;
  private skillsCollection: Collection | null = null;
  private config: RAGConfig;
  private initialized = false;

  constructor(config: RAGConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    this.client = new ChromaClient({
      path: this.config.chromaPath,
    });

    // Create collections for different content types
    const safeName = this.config.collectionName.replace(/[^a-zA-Z0-9_-]/g, "_");

    this.codeCollection = await this.client.getOrCreateCollection({
      name: `${safeName}_code`,
      metadata: { description: "Project source code" },
    });

    this.docsCollection = await this.client.getOrCreateCollection({
      name: `${safeName}_docs`,
      metadata: { description: "Project documentation (PRPs, ADRs)" },
    });

    this.skillsCollection = await this.client.getOrCreateCollection({
      name: `${safeName}_skills`,
      metadata: { description: "Skills and knowledge base" },
    });

    this.initialized = true;
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error("RAG engine not initialized. Call initialize() first.");
    }
  }

  /**
   * Search across all collections
   */
  async search(
    query: string,
    options: {
      types?: ("code" | "docs" | "skills")[];
      limit?: number;
      filter?: Record<string, unknown>;
    } = {},
  ): Promise<SearchResult[]> {
    this.ensureInitialized();

    const types = options.types || ["code", "docs", "skills"];
    const limit = options.limit || 10;
    const results: SearchResult[] = [];

    const searchCollection = async (
      collection: Collection | null,
      type: string,
    ) => {
      if (!collection || !types.includes(type as "code" | "docs" | "skills"))
        return;

      const queryResult = await collection.query({
        queryTexts: [query],
        nResults: limit,
        where: options.filter as Record<string, string> | undefined,
      });

      if (queryResult.ids[0]) {
        queryResult.ids[0].forEach((id, idx) => {
          results.push({
            id,
            content: queryResult.documents[0]?.[idx] || "",
            metadata: {
              type,
              ...(queryResult.metadatas[0]?.[idx] || {}),
            },
            distance: queryResult.distances?.[0]?.[idx] || 0,
          });
        });
      }
    };

    await Promise.all([
      searchCollection(this.codeCollection, "code"),
      searchCollection(this.docsCollection, "docs"),
      searchCollection(this.skillsCollection, "skills"),
    ]);

    // Sort by distance (lower is better)
    results.sort((a, b) => a.distance - b.distance);
    return results.slice(0, limit);
  }

  /**
   * Search only in code collection
   */
  async searchCode(query: string, limit = 10): Promise<SearchResult[]> {
    return this.search(query, { types: ["code"], limit });
  }

  /**
   * Search only in documentation
   */
  async searchDocs(query: string, limit = 10): Promise<SearchResult[]> {
    return this.search(query, { types: ["docs"], limit });
  }

  /**
   * Search only in skills
   */
  async searchSkills(query: string, limit = 5): Promise<SearchResult[]> {
    return this.search(query, { types: ["skills"], limit });
  }

  /**
   * Index the entire project
   */
  async indexProject(): Promise<IndexStats> {
    this.ensureInitialized();

    const stats: IndexStats = {
      totalDocuments: 0,
      collections: [],
      lastIndexed: new Date().toISOString(),
    };

    // Index codebase
    const codeCount = await this.indexCodebase();
    stats.totalDocuments += codeCount;
    if (codeCount > 0) stats.collections.push("code");

    // Index documentation
    const docsCount = await this.indexDocumentation();
    stats.totalDocuments += docsCount;
    if (docsCount > 0) stats.collections.push("docs");

    // Index skills
    const skillsCount = await this.indexSkills();
    stats.totalDocuments += skillsCount;
    if (skillsCount > 0) stats.collections.push("skills");

    return stats;
  }

  /**
   * Index source code files
   */
  private async indexCodebase(): Promise<number> {
    if (!this.codeCollection) return 0;

    const ig = ignoreLib.default();
    const gitignorePath = join(this.config.projectPath, ".gitignore");

    if (existsSync(gitignorePath)) {
      const gitignore = await readFile(gitignorePath, "utf-8");
      ig.add(gitignore);
    }

    // Default ignores
    ig.add([
      "node_modules",
      ".git",
      "dist",
      "build",
      ".claude/rag-db",
      "*.lock",
      "package-lock.json",
      "*.min.js",
      "*.map",
    ]);

    // Code file extensions to index
    const codeExtensions = [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".py",
      ".pyi",
      ".go",
      ".rs",
      ".java",
      ".kt",
      ".rb",
      ".php",
      ".cs",
      ".swift",
      ".vue",
      ".svelte",
    ];

    const pattern = `**/*{${codeExtensions.join(",")}}`;
    const files = await glob(pattern, {
      cwd: this.config.projectPath,
      ignore: ["node_modules/**", ".git/**", "dist/**", "build/**"],
    });

    const chunks: DocumentChunk[] = [];

    for (const file of files) {
      const relativePath = relative(
        this.config.projectPath,
        join(this.config.projectPath, file),
      );

      if (ig.ignores(relativePath)) continue;

      const fullPath = join(this.config.projectPath, file);
      const content = await readFile(fullPath, "utf-8");

      // Skip large files
      if (content.length > 100000) continue;

      // Chunk the file
      const fileChunks = this.chunkCode(content, file);
      chunks.push(...fileChunks);
    }

    if (chunks.length === 0) return 0;

    // Clear existing and add new
    await this.codeCollection.delete({ where: {} });

    // Batch add (ChromaDB has limits)
    const batchSize = 100;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      await this.codeCollection.add({
        ids: batch.map((c) => c.id),
        documents: batch.map((c) => c.content),
        metadatas: batch.map((c) => c.metadata),
      });
    }

    return chunks.length;
  }

  /**
   * Index documentation files (PRPs, ADRs, etc.)
   */
  private async indexDocumentation(): Promise<number> {
    if (!this.docsCollection) return 0;

    const docsPath = join(this.config.projectPath, "docs");
    const claudeMdPath = join(this.config.projectPath, "CLAUDE.md");

    const chunks: DocumentChunk[] = [];

    // Index CLAUDE.md
    if (existsSync(claudeMdPath)) {
      const content = await readFile(claudeMdPath, "utf-8");
      chunks.push(...this.chunkMarkdown(content, "CLAUDE.md", "guide"));
    }

    // Index docs folder
    if (existsSync(docsPath)) {
      const files = await glob("**/*.md", { cwd: docsPath });

      for (const file of files) {
        const fullPath = join(docsPath, file);
        const content = await readFile(fullPath, "utf-8");
        const type = file.includes("PRP-")
          ? "prp"
          : file.includes("ADR-")
            ? "adr"
            : "doc";
        chunks.push(...this.chunkMarkdown(content, file, type));
      }
    }

    if (chunks.length === 0) return 0;

    await this.docsCollection.delete({ where: {} });

    const batchSize = 100;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      await this.docsCollection.add({
        ids: batch.map((c) => c.id),
        documents: batch.map((c) => c.content),
        metadatas: batch.map((c) => c.metadata),
      });
    }

    return chunks.length;
  }

  /**
   * Index skill files
   */
  private async indexSkills(): Promise<number> {
    if (!this.skillsCollection) return 0;

    const skillsPath = join(this.config.projectPath, ".claude", "skills");

    if (!existsSync(skillsPath)) return 0;

    const files = await glob("*.md", { cwd: skillsPath });
    const chunks: DocumentChunk[] = [];

    for (const file of files) {
      const fullPath = join(skillsPath, file);
      const content = await readFile(fullPath, "utf-8");

      // Parse frontmatter
      const { data: frontmatter, content: body } = matter(content);

      chunks.push(
        ...this.chunkMarkdown(body, file, "skill", {
          skill_name: frontmatter.name || file.replace(".md", ""),
          skill_description: frontmatter.description || "",
        }),
      );
    }

    if (chunks.length === 0) return 0;

    await this.skillsCollection.delete({ where: {} });

    const batchSize = 100;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      await this.skillsCollection.add({
        ids: batch.map((c) => c.id),
        documents: batch.map((c) => c.content),
        metadatas: batch.map((c) => c.metadata),
      });
    }

    return chunks.length;
  }

  /**
   * Chunk code files intelligently
   */
  private chunkCode(content: string, filePath: string): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    const ext = extname(filePath);
    const lines = content.split("\n");

    // Chunk by ~100 lines with overlap
    const chunkSize = 100;
    const overlap = 20;

    for (let i = 0; i < lines.length; i += chunkSize - overlap) {
      const chunkLines = lines.slice(i, i + chunkSize);
      const chunkContent = chunkLines.join("\n");

      if (chunkContent.trim().length === 0) continue;

      const chunkIndex = Math.floor(i / (chunkSize - overlap));
      const totalChunks = Math.ceil(lines.length / (chunkSize - overlap));

      chunks.push({
        id: `code_${filePath}_chunk_${chunkIndex}`,
        content: chunkContent,
        metadata: {
          source: "codebase",
          type: "code",
          path: filePath,
          extension: ext,
          start_line: i + 1,
          end_line: Math.min(i + chunkSize, lines.length),
          chunk_index: chunkIndex,
          total_chunks: totalChunks,
        } as Metadata,
      });
    }

    return chunks;
  }

  /**
   * Chunk markdown files by sections
   */
  private chunkMarkdown(
    content: string,
    filePath: string,
    docType: string,
    extraMetadata: Record<string, string | number | boolean> = {},
  ): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];

    // Split by headers
    const sections = content.split(/^(#{1,3}\s+.+)$/m);

    let currentHeader = "";
    let currentContent = "";
    let chunkIndex = 0;

    for (const section of sections) {
      if (section.match(/^#{1,3}\s+/)) {
        // Save previous section
        if (currentContent.trim()) {
          chunks.push({
            id: `doc_${filePath}_chunk_${chunkIndex}`,
            content: `${currentHeader}\n${currentContent}`.trim(),
            metadata: {
              source: "documentation",
              type: docType,
              path: filePath,
              section: currentHeader.replace(/^#+\s*/, ""),
              chunk_index: chunkIndex,
              total_chunks: 0, // Will be updated
              ...extraMetadata,
            } as Metadata,
          });
          chunkIndex++;
        }
        currentHeader = section;
        currentContent = "";
      } else {
        currentContent += section;
      }
    }

    // Don't forget the last section
    if (currentContent.trim()) {
      chunks.push({
        id: `doc_${filePath}_chunk_${chunkIndex}`,
        content: `${currentHeader}\n${currentContent}`.trim(),
        metadata: {
          source: "documentation",
          type: docType,
          path: filePath,
          section: currentHeader.replace(/^#+\s*/, ""),
          chunk_index: chunkIndex,
          total_chunks: 0,
          ...extraMetadata,
        } as Metadata,
      });
    }

    // Update total chunks
    const total = chunks.length;
    chunks.forEach((chunk) => {
      (
        chunk.metadata as Record<string, string | number | boolean>
      ).total_chunks = total;
    });

    return chunks;
  }

  /**
   * Get index statistics
   */
  async getStats(): Promise<IndexStats> {
    this.ensureInitialized();

    const collections: string[] = [];
    let totalDocuments = 0;

    if (this.codeCollection) {
      const count = await this.codeCollection.count();
      if (count > 0) {
        collections.push("code");
        totalDocuments += count;
      }
    }

    if (this.docsCollection) {
      const count = await this.docsCollection.count();
      if (count > 0) {
        collections.push("docs");
        totalDocuments += count;
      }
    }

    if (this.skillsCollection) {
      const count = await this.skillsCollection.count();
      if (count > 0) {
        collections.push("skills");
        totalDocuments += count;
      }
    }

    return {
      totalDocuments,
      collections,
      lastIndexed: null, // Would need to store this somewhere
    };
  }
}
