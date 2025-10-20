/**
 *
 * @param {string} mcpUrl
 * @param {string} serverName
 * @returns
 */

function generateMCPConfig(mcpUrl, serverName) {
  const configs = [
    {
      client: "Cursor",
      iconUrl: "https://www.google.com/s2/favicons?domain=cursor.com&sz=32",
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
      iconUrl:
        "https://www.google.com/s2/favicons?domain=code.visualstudio.com&sz=32",
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
      client: "Claude Desktop / Claude.ai",
      iconUrl: "https://www.google.com/s2/favicons?domain=claude.ai&sz=32",
      instructions: `Go to Settings → Connectors → Add Custom Connector and fill in:
- **Name**: ${serverName}
- **URL**: ${mcpUrl}

Please note that if you are part of an organisation, you may not have access to custom connectors at this point. Ask your org administator.`,
    },

    {
      client: "Claude Code",
      iconUrl: "https://www.google.com/s2/favicons?domain=claude.ai&sz=32",
      remoteCommand: `claude mcp add --transport http "${serverName
        .replaceAll(" ", "-")
        .replaceAll(".", "_")}" ${mcpUrl}`,
      instructions: "Run the command in your terminal",
    },

    {
      client: "Windsurf",
      iconUrl: "https://www.google.com/s2/favicons?domain=codeium.com&sz=32",
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
      iconUrl: "https://www.google.com/s2/favicons?domain=github.com&sz=32",
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
      iconUrl:
        "https://www.google.com/s2/favicons?domain=gemini.google.com&sz=32",
      instructions: "Add to `~/.gemini/settings.json`",
      configJson: {
        mcpServers: {
          [serverName]: { httpUrl: mcpUrl },
        },
      },
    },
    {
      client: "ChatGPT",
      iconUrl: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=32",
      instructions: `First, go to 'Settings -> Connectors -> Advanced Settings' and turn on 'Developer Mode'.

Then, in connector settings click 'create'.
      
Fill in:

- **Name**: ${serverName}
- **URL**: ${mcpUrl}
- **Authentication**: OAuth

In a new chat ensure developer mode is turned on with the connector(s) selected.

Please note that <a href="https://platform.openai.com/docs/guides/developer-mode" target="_blank">Developer Mode</a> must be enabled and this feature may not be available for everyone..`,
    },
    // {
    //   client: "Context Area",
    //   instructions: "Click to install",
    //   iconUrl:
    //     "https://www.google.com/s2/favicons?domain=contextarea.com&sz=32",
    //   deepLink: `https://contextarea.com/?mcp=${encodeURIComponent(mcpUrl)}`,
    // },
  ];

  return configs;
}

function generateMCPInstallationGuide(mcpUrl, serverName) {
  const configs = generateMCPConfig(mcpUrl, serverName);

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

module.exports = {
  generateMCPConfig,
  generateMCPInstallationGuide,
};
