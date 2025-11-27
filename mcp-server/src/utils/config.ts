/**
 * Configuration utilities for loading and managing project config
 */

import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";

export interface ProjectConfig {
  project: {
    name: string;
    description: string;
    version: string;
    repository?: string;
  };
  stack: {
    type: string;
    backend?: {
      language: string;
      framework: string;
      orm?: string;
    };
    frontend?: {
      framework: string;
      styling: string;
      state_management?: string;
    };
    database?: {
      primary: string;
      cache?: string;
    };
    api?: {
      style: string;
      documentation?: string;
    };
  };
  testing?: {
    framework: string;
    coverage_threshold: number;
    categories: string[];
  };
  quality_gates?: {
    required: string[];
    recommended: string[];
  };
  structure?: {
    directories: Record<string, string>;
    key_files: Record<string, string>;
  };
}

export interface WorkflowState {
  phase: string;
  started: string | null;
  last_updated: string | null;
  active_task: string | null;
  active_prp: string | null;
}

/**
 * Load project configuration from project-config.yaml
 */
export async function loadConfig(
  projectPath: string,
): Promise<ProjectConfig | null> {
  const configPath = join(projectPath, "project-config.yaml");

  if (!existsSync(configPath)) {
    console.error(`[Config] No project-config.yaml found at ${configPath}`);
    return null;
  }

  try {
    const content = await readFile(configPath, "utf-8");
    const config = yaml.load(content) as ProjectConfig;
    return config;
  } catch (error) {
    console.error(`[Config] Failed to load config:`, error);
    return null;
  }
}

/**
 * Load workflow state from STATE.md
 */
export async function loadWorkflowState(
  projectPath: string,
): Promise<WorkflowState | null> {
  const statePath = join(projectPath, ".claude", "workflow", "STATE.md");

  if (!existsSync(statePath)) {
    return {
      phase: "not_initialized",
      started: null,
      last_updated: null,
      active_task: null,
      active_prp: null,
    };
  }

  try {
    const content = await readFile(statePath, "utf-8");

    // Parse YAML frontmatter from STATE.md
    const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (yamlMatch?.[1]) {
      return yaml.load(yamlMatch[1]) as WorkflowState;
    }

    return null;
  } catch (error) {
    console.error(`[Config] Failed to load workflow state:`, error);
    return null;
  }
}

/**
 * Get list of PRPs from docs/planning
 */
export async function listPRPs(projectPath: string): Promise<string[]> {
  const planningPath = join(projectPath, "docs", "planning");

  if (!existsSync(planningPath)) {
    return [];
  }

  const { glob } = await import("glob");
  const files = await glob("*.md", { cwd: planningPath });
  return files.filter((f) => f.startsWith("PRP-"));
}

/**
 * Get list of ADRs from docs/architecture
 */
export async function listADRs(projectPath: string): Promise<string[]> {
  const archPath = join(projectPath, "docs", "architecture");

  if (!existsSync(archPath)) {
    return [];
  }

  const { glob } = await import("glob");
  const files = await glob("*.md", { cwd: archPath });
  return files.filter((f) => f.startsWith("ADR-"));
}
