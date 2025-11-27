/**
 * MCP Resources for Project Data Access
 *
 * Exposes project data as resources that Claude can read:
 * - Project configuration
 * - Workflow state
 * - PRPs and ADRs
 * - Agent definitions
 * - Skill files
 */

import { Resource } from "@modelcontextprotocol/sdk/types.js";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { glob } from "glob";

/**
 * Register all available resources
 */
export function registerResources(projectPath: string): Resource[] {
  const resources: Resource[] = [
    {
      uri: "project://config",
      name: "Project Configuration",
      description: "Full project configuration from project-config.yaml",
      mimeType: "application/yaml",
    },
    {
      uri: "project://state",
      name: "Workflow State",
      description: "Current workflow phase and progress",
      mimeType: "text/markdown",
    },
    {
      uri: "project://claude-md",
      name: "CLAUDE.md",
      description: "Project instructions and guidelines",
      mimeType: "text/markdown",
    },
  ];

  // Add PRP resources
  const prpsPath = join(projectPath, "docs", "planning");
  if (existsSync(prpsPath)) {
    resources.push({
      uri: "project://prps",
      name: "All PRPs",
      description: "List of all Product Requirements Prompts",
      mimeType: "application/json",
    });
  }

  // Add ADR resources
  const adrsPath = join(projectPath, "docs", "architecture");
  if (existsSync(adrsPath)) {
    resources.push({
      uri: "project://adrs",
      name: "All ADRs",
      description: "List of all Architecture Decision Records",
      mimeType: "application/json",
    });
  }

  // Add agents list
  const agentsPath = join(projectPath, ".claude", "agents");
  if (existsSync(agentsPath)) {
    resources.push({
      uri: "project://agents",
      name: "Available Agents",
      description: "List of all available subagents",
      mimeType: "application/json",
    });
  }

  // Add skills list
  const skillsPath = join(projectPath, ".claude", "skills");
  if (existsSync(skillsPath)) {
    resources.push({
      uri: "project://skills",
      name: "Available Skills",
      description: "List of all available skills",
      mimeType: "application/json",
    });
  }

  // Add commands list
  const commandsPath = join(projectPath, ".claude", "commands");
  if (existsSync(commandsPath)) {
    resources.push({
      uri: "project://commands",
      name: "Available Commands",
      description: "List of all available slash commands",
      mimeType: "application/json",
    });
  }

  return resources;
}

/**
 * Handle resource read requests
 */
export async function handleResourceRead(
  uri: string,
  projectPath: string,
): Promise<{
  contents: Array<{ uri: string; mimeType: string; text: string }>;
}> {
  const parts = uri.split("://");
  const protocol = parts[0];
  const resource = parts[1] || "";

  if (protocol !== "project") {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: `Unknown protocol: ${protocol}`,
        },
      ],
    };
  }

  try {
    switch (resource) {
      case "config":
        return await readProjectConfig(uri, projectPath);

      case "state":
        return await readWorkflowState(uri, projectPath);

      case "claude-md":
        return await readClaudeMd(uri, projectPath);

      case "prps":
        return await readPRPsList(uri, projectPath);

      case "adrs":
        return await readADRsList(uri, projectPath);

      case "agents":
        return await readAgentsList(uri, projectPath);

      case "skills":
        return await readSkillsList(uri, projectPath);

      case "commands":
        return await readCommandsList(uri, projectPath);

      default:
        // Handle dynamic resources like project://prp/PRP-001-feature
        if (resource.startsWith("prp/")) {
          return await readSpecificPRP(uri, projectPath, resource.slice(4));
        }
        if (resource.startsWith("adr/")) {
          return await readSpecificADR(uri, projectPath, resource.slice(4));
        }
        if (resource.startsWith("agent/")) {
          return await readSpecificAgent(uri, projectPath, resource.slice(6));
        }
        if (resource.startsWith("skill/")) {
          return await readSpecificSkill(uri, projectPath, resource.slice(6));
        }

        return {
          contents: [
            {
              uri,
              mimeType: "text/plain",
              text: `Unknown resource: ${resource}`,
            },
          ],
        };
    }
  } catch (error) {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: `Error reading resource: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}

async function readProjectConfig(
  uri: string,
  projectPath: string,
): Promise<{
  contents: Array<{ uri: string; mimeType: string; text: string }>;
}> {
  const configPath = join(projectPath, "project-config.yaml");

  if (!existsSync(configPath)) {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: "project-config.yaml not found",
        },
      ],
    };
  }

  const content = await readFile(configPath, "utf-8");
  return {
    contents: [{ uri, mimeType: "application/yaml", text: content }],
  };
}

async function readWorkflowState(
  uri: string,
  projectPath: string,
): Promise<{
  contents: Array<{ uri: string; mimeType: string; text: string }>;
}> {
  const statePath = join(projectPath, ".claude", "workflow", "STATE.md");

  if (!existsSync(statePath)) {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: "Workflow not initialized. Run /project-init first.",
        },
      ],
    };
  }

  const content = await readFile(statePath, "utf-8");
  return {
    contents: [{ uri, mimeType: "text/markdown", text: content }],
  };
}

async function readClaudeMd(
  uri: string,
  projectPath: string,
): Promise<{
  contents: Array<{ uri: string; mimeType: string; text: string }>;
}> {
  const claudePath = join(projectPath, "CLAUDE.md");

  if (!existsSync(claudePath)) {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: "CLAUDE.md not found",
        },
      ],
    };
  }

  const content = await readFile(claudePath, "utf-8");
  return {
    contents: [{ uri, mimeType: "text/markdown", text: content }],
  };
}

async function readPRPsList(
  uri: string,
  projectPath: string,
): Promise<{
  contents: Array<{ uri: string; mimeType: string; text: string }>;
}> {
  const prpsPath = join(projectPath, "docs", "planning");

  if (!existsSync(prpsPath)) {
    return {
      contents: [{ uri, mimeType: "application/json", text: "[]" }],
    };
  }

  const files = await glob("PRP-*.md", { cwd: prpsPath });
  const prps = files.map((f) => ({
    name: f.replace(".md", ""),
    uri: `project://prp/${f.replace(".md", "")}`,
  }));

  return {
    contents: [
      {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(prps, null, 2),
      },
    ],
  };
}

async function readADRsList(
  uri: string,
  projectPath: string,
): Promise<{
  contents: Array<{ uri: string; mimeType: string; text: string }>;
}> {
  const adrsPath = join(projectPath, "docs", "architecture");

  if (!existsSync(adrsPath)) {
    return {
      contents: [{ uri, mimeType: "application/json", text: "[]" }],
    };
  }

  const files = await glob("ADR-*.md", { cwd: adrsPath });
  const adrs = files.map((f) => ({
    name: f.replace(".md", ""),
    uri: `project://adr/${f.replace(".md", "")}`,
  }));

  return {
    contents: [
      {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(adrs, null, 2),
      },
    ],
  };
}

async function readAgentsList(
  uri: string,
  projectPath: string,
): Promise<{
  contents: Array<{ uri: string; mimeType: string; text: string }>;
}> {
  const agentsPath = join(projectPath, ".claude", "agents");

  if (!existsSync(agentsPath)) {
    return {
      contents: [{ uri, mimeType: "application/json", text: "[]" }],
    };
  }

  const files = await glob("*.md", { cwd: agentsPath });
  const agents = files.map((f) => ({
    name: f.replace(".md", ""),
    uri: `project://agent/${f.replace(".md", "")}`,
  }));

  return {
    contents: [
      {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(agents, null, 2),
      },
    ],
  };
}

async function readSkillsList(
  uri: string,
  projectPath: string,
): Promise<{
  contents: Array<{ uri: string; mimeType: string; text: string }>;
}> {
  const skillsPath = join(projectPath, ".claude", "skills");

  if (!existsSync(skillsPath)) {
    return {
      contents: [{ uri, mimeType: "application/json", text: "[]" }],
    };
  }

  const files = await glob("*.md", { cwd: skillsPath });
  const skills = files.map((f) => ({
    name: f.replace(".md", ""),
    uri: `project://skill/${f.replace(".md", "")}`,
  }));

  return {
    contents: [
      {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(skills, null, 2),
      },
    ],
  };
}

async function readCommandsList(
  uri: string,
  projectPath: string,
): Promise<{
  contents: Array<{ uri: string; mimeType: string; text: string }>;
}> {
  const commandsPath = join(projectPath, ".claude", "commands");

  if (!existsSync(commandsPath)) {
    return {
      contents: [{ uri, mimeType: "application/json", text: "[]" }],
    };
  }

  const files = await glob("*.md", { cwd: commandsPath });
  const commands = files.map((f) => ({
    name: f.replace(".md", ""),
    slash: `/${f.replace(".md", "")}`,
  }));

  return {
    contents: [
      {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(commands, null, 2),
      },
    ],
  };
}

async function readSpecificPRP(
  uri: string,
  projectPath: string,
  prpName: string,
): Promise<{
  contents: Array<{ uri: string; mimeType: string; text: string }>;
}> {
  const prpPath = join(projectPath, "docs", "planning", `${prpName}.md`);

  if (!existsSync(prpPath)) {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: `PRP not found: ${prpName}`,
        },
      ],
    };
  }

  const content = await readFile(prpPath, "utf-8");
  return {
    contents: [{ uri, mimeType: "text/markdown", text: content }],
  };
}

async function readSpecificADR(
  uri: string,
  projectPath: string,
  adrName: string,
): Promise<{
  contents: Array<{ uri: string; mimeType: string; text: string }>;
}> {
  const adrPath = join(projectPath, "docs", "architecture", `${adrName}.md`);

  if (!existsSync(adrPath)) {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: `ADR not found: ${adrName}`,
        },
      ],
    };
  }

  const content = await readFile(adrPath, "utf-8");
  return {
    contents: [{ uri, mimeType: "text/markdown", text: content }],
  };
}

async function readSpecificAgent(
  uri: string,
  projectPath: string,
  agentName: string,
): Promise<{
  contents: Array<{ uri: string; mimeType: string; text: string }>;
}> {
  const agentPath = join(projectPath, ".claude", "agents", `${agentName}.md`);

  if (!existsSync(agentPath)) {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: `Agent not found: ${agentName}`,
        },
      ],
    };
  }

  const content = await readFile(agentPath, "utf-8");
  return {
    contents: [{ uri, mimeType: "text/markdown", text: content }],
  };
}

async function readSpecificSkill(
  uri: string,
  projectPath: string,
  skillName: string,
): Promise<{
  contents: Array<{ uri: string; mimeType: string; text: string }>;
}> {
  const skillPath = join(projectPath, ".claude", "skills", `${skillName}.md`);

  if (!existsSync(skillPath)) {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: `Skill not found: ${skillName}`,
        },
      ],
    };
  }

  const content = await readFile(skillPath, "utf-8");
  return {
    contents: [{ uri, mimeType: "text/markdown", text: content }],
  };
}
