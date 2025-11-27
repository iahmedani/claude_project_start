/**
 * RAG Engine - Core retrieval-augmented generation system
 *
 * Provides semantic search over:
 * - Project codebase
 * - Documentation (PRPs, ADRs)
 * - Skills and knowledge base
 * - Past decisions and patterns
 *
 * Uses a simple file-based storage with TF-IDF-like keyword matching
 * that works without external dependencies or servers.
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join, relative, extname, dirname } from "path";
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
  metadata: Record<string, unknown>;
  tokens: string[];
}

interface StoredIndex {
  version: number;
  lastIndexed: string;
  documents: {
    code: DocumentChunk[];
    docs: DocumentChunk[];
    skills: DocumentChunk[];
  };
}

export class RAGEngine {
  private config: RAGConfig;
  private initialized = false;
  private indexPath: string;
  private index: StoredIndex = {
    version: 1,
    lastIndexed: "",
    documents: {
      code: [],
      docs: [],
      skills: [],
    },
  };

  constructor(config: RAGConfig) {
    this.config = config;
    this.indexPath = join(config.chromaPath, "index.json");
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Ensure the storage directory exists
    const dir = dirname(this.indexPath);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    // Load existing index if available
    if (existsSync(this.indexPath)) {
      try {
        const data = await readFile(this.indexPath, "utf-8");
        this.index = JSON.parse(data);
      } catch {
        // Start fresh if index is corrupted
        this.index = {
          version: 1,
          lastIndexed: "",
          documents: { code: [], docs: [], skills: [] },
        };
      }
    }

    this.initialized = true;
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error("RAG engine not initialized. Call initialize() first.");
    }
  }

  private async saveIndex(): Promise<void> {
    await writeFile(this.indexPath, JSON.stringify(this.index, null, 2));
  }

  /**
   * Tokenize text for search matching
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2);
  }

  /**
   * Calculate relevance score between query and document
   * Uses TF-IDF-like scoring
   */
  private calculateScore(queryTokens: string[], docTokens: string[]): number {
    if (docTokens.length === 0) return Infinity;

    const docTokenSet = new Set(docTokens);
    let matches = 0;
    let weightedMatches = 0;

    for (const queryToken of queryTokens) {
      if (docTokenSet.has(queryToken)) {
        matches++;
        // Weight by inverse document frequency (rare tokens score higher)
        const tf = docTokens.filter((t) => t === queryToken).length;
        weightedMatches += tf / docTokens.length;
      }
    }

    if (matches === 0) return Infinity;

    // Lower score is better (like distance)
    // Combine coverage (what % of query matched) with TF-IDF
    const coverage = matches / queryTokens.length;
    return 1 - coverage * 0.7 - weightedMatches * 0.3;
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
    const queryTokens = this.tokenize(query);

    if (queryTokens.length === 0) {
      return [];
    }

    const results: SearchResult[] = [];

    for (const type of types) {
      const docs = this.index.documents[type] || [];
      for (const doc of docs) {
        const score = this.calculateScore(queryTokens, doc.tokens);
        if (score < 1) {
          // Only include if there's at least some match
          results.push({
            id: doc.id,
            content: doc.content,
            metadata: { type, ...doc.metadata },
            distance: score,
          });
        }
      }
    }

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

    // Reset index
    this.index.documents = { code: [], docs: [], skills: [] };
    this.index.lastIndexed = new Date().toISOString();

    const stats: IndexStats = {
      totalDocuments: 0,
      collections: [],
      lastIndexed: this.index.lastIndexed,
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

    // Persist the index
    await this.saveIndex();

    return stats;
  }

  /**
   * Index source code files
   */
  private async indexCodebase(): Promise<number> {
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
      this.index.documents.code.push(...fileChunks);
    }

    return this.index.documents.code.length;
  }

  /**
   * Index documentation files (PRPs, ADRs, etc.)
   */
  private async indexDocumentation(): Promise<number> {
    const docsPath = join(this.config.projectPath, "docs");
    const claudeMdPath = join(this.config.projectPath, "CLAUDE.md");

    // Index CLAUDE.md
    if (existsSync(claudeMdPath)) {
      const content = await readFile(claudeMdPath, "utf-8");
      const chunks = this.chunkMarkdown(content, "CLAUDE.md", "guide");
      this.index.documents.docs.push(...chunks);
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
        const chunks = this.chunkMarkdown(content, file, type);
        this.index.documents.docs.push(...chunks);
      }
    }

    return this.index.documents.docs.length;
  }

  /**
   * Index skill files
   */
  private async indexSkills(): Promise<number> {
    const skillsPath = join(this.config.projectPath, ".claude", "skills");

    if (!existsSync(skillsPath)) return 0;

    const files = await glob("*.md", { cwd: skillsPath });

    for (const file of files) {
      const fullPath = join(skillsPath, file);
      const content = await readFile(fullPath, "utf-8");

      // Parse frontmatter
      const { data: frontmatter, content: body } = matter(content);

      const chunks = this.chunkMarkdown(body, file, "skill", {
        skill_name: frontmatter.name || file.replace(".md", ""),
        skill_description: frontmatter.description || "",
      });
      this.index.documents.skills.push(...chunks);
    }

    return this.index.documents.skills.length;
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
        tokens: this.tokenize(chunkContent),
        metadata: {
          source: "codebase",
          type: "code",
          path: filePath,
          extension: ext,
          start_line: i + 1,
          end_line: Math.min(i + chunkSize, lines.length),
          chunk_index: chunkIndex,
          total_chunks: totalChunks,
        },
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
          const fullContent = `${currentHeader}\n${currentContent}`.trim();
          chunks.push({
            id: `doc_${filePath}_chunk_${chunkIndex}`,
            content: fullContent,
            tokens: this.tokenize(fullContent),
            metadata: {
              source: "documentation",
              type: docType,
              path: filePath,
              section: currentHeader.replace(/^#+\s*/, ""),
              chunk_index: chunkIndex,
              total_chunks: 0, // Will be updated
              ...extraMetadata,
            },
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
      const fullContent = `${currentHeader}\n${currentContent}`.trim();
      chunks.push({
        id: `doc_${filePath}_chunk_${chunkIndex}`,
        content: fullContent,
        tokens: this.tokenize(fullContent),
        metadata: {
          source: "documentation",
          type: docType,
          path: filePath,
          section: currentHeader.replace(/^#+\s*/, ""),
          chunk_index: chunkIndex,
          total_chunks: 0,
          ...extraMetadata,
        },
      });
    }

    // Update total chunks
    const total = chunks.length;
    chunks.forEach((chunk) => {
      chunk.metadata.total_chunks = total;
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

    if (this.index.documents.code.length > 0) {
      collections.push("code");
      totalDocuments += this.index.documents.code.length;
    }

    if (this.index.documents.docs.length > 0) {
      collections.push("docs");
      totalDocuments += this.index.documents.docs.length;
    }

    if (this.index.documents.skills.length > 0) {
      collections.push("skills");
      totalDocuments += this.index.documents.skills.length;
    }

    return {
      totalDocuments,
      collections,
      lastIndexed: this.index.lastIndexed || null,
    };
  }
}
