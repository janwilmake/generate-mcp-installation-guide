function generateMCPInstallationGuide(mcpUrl, serverName) {
  const configs = [
    {
      client: "Cursor",
      deepLink: `https://cursor.com/en/install-mcp?name=${encodeURIComponent(
        serverName
      )}&config=${btoa(JSON.stringify({ url: mcpUrl }))}`,
      instructions:
        "Add to `~/.cursor/mcp.json` or `.cursor/mcp.json` (project-specific)",
      configJson: {
        mcpServers: {
          [serverName]: {
            url: mcpUrl,
          },
        },
      },
    },
    {
      client: "VS Code",
      deepLink: `https://insiders.vscode.dev/redirect/mcp/install?name=${encodeURIComponent(
        serverName
      )}&config=${encodeURIComponent(
        JSON.stringify({ type: "http", url: mcpUrl })
      )}`,
      instructions: "Add to VS Code settings.json",
      configJson: {
        mcp: {
          servers: {
            [serverName]: {
              type: "http",
              url: mcpUrl,
            },
          },
        },
      },
    },
    {
      client: "Claude.ai",
      instructions: `Go to https://claude.ai/settings/connectors and select 'add custom connector'. Fill in:
- **Name**: ${serverName}
- **URL**: ${mcpUrl}`,
    },
    {
      client: "ChatGPT.com",
      instructions: `First, go to 'Settings -> Connectors -> Advanced Settings' and turn on 'Developer Mode'.

Then, in connector settings click 'create'.
      
Fill in:

- **Name**: ${serverName}
- **URL**: ${mcpUrl}
- **Authentication**: OAuth

In a new chat ensure developer mode is turned on with the connector(s) selected.`,
    },

    {
      client: "Claude Code",
      remoteCommand: `claude mcp add --transport http ${serverName} ${mcpUrl}`,
      instructions: "Run the command in your terminal",
    },

    {
      client: "Claude Desktop",
      instructions: `Go to Settings → Connectors → Add Custom Connector and fill in:
- **Name**: ${serverName}
- **URL**: ${mcpUrl}`,
    },

    {
      client: "Windsurf",
      instructions: "Add to your Windsurf MCP configuration",
      configJson: {
        mcpServers: {
          [serverName]: {
            serverUrl: mcpUrl,
          },
        },
      },
    },
    {
      client: "Cline",
      instructions:
        "Go to MCP Servers section → Remote Servers → Edit Configuration",
      configJson: {
        mcpServers: {
          [serverName]: {
            url: mcpUrl,
            type: "streamableHttp",
          },
        },
      },
    },
    {
      client: "Gemini CLI",
      instructions: "Add to `~/.gemini/settings.json`",
      configJson: {
        mcpServers: {
          [serverName]: { httpUrl: mcpUrl },
        },
      },
    },
  ];

  let markdown = `# MCP Server Installation Guide\n\n`;
  markdown += `**Server Name**: \`${serverName}\`  \n`;
  markdown += `**Server URL**: \`${mcpUrl}\`\n\n`;

  configs.forEach((config, index) => {
    markdown += `## ${config.client}\n\n`;

    if (config.deepLink) {
      markdown += `[🔗 Install via deep link](${config.deepLink})\n\n`;
    }

    if (config.remoteCommand) {
      markdown += `**Command:**\n\`\`\`bash\n${config.remoteCommand}\n\`\`\`\n\n`;
    }

    markdown += `**Instructions:** ${config.instructions}\n\n`;

    if (config.configJson) {
      markdown += `**Configuration:**\n\`\`\`json\n${JSON.stringify(
        config.configJson,
        null,
        2
      )}\n\`\`\`\n\n`;
    }

    if (index < configs.length - 1) {
      markdown += `---\n\n`;
    }
  });

  return markdown;
}

// Example usage:
// const guide = generateMCPInstallationGuide(
//   "https://task-mcp.parallel.ai/mcp",
//   "Parallel Task MCP"
// );
// console.log(guide);
