# MCP Installation Guide

This package and Cloudflare Worker generate comprehensive installation guides for MCP (Model Context Protocol) servers across different clients.

## Package Usage

```js
const {
  generateMCPConfig,
  generateMCPInstallationGuide,
} = require("mcp-installation-guide");

// Get configuration objects
const configs = generateMCPConfig("https://api.example.com/mcp", "My Server");

// Get markdown guide
const markdown = generateMCPInstallationGuide(
  "https://api.example.com/mcp",
  "My Server"
);
```

## Worker Usage

The Cloudflare Worker is hosted at `installthismcp.com` and provides:

1. **Landing page**: Visit the root URL to access a form for entering server details
2. **Guide generation**: Visit `/?url={mcpUrl}&name={serverName}` to generate a styled HTML guide

### Examples

- Landing page: `https://installthismcp.com/`
- Direct guide: `https://installthismcp.com/?url=https://api.example.com/mcp&name=Weather%20Server`

## Supported Clients

- Cursor
- VS Code
- Claude.ai
- ChatGPT.com
- Claude Code (CLI)
- Claude Desktop
- Windsurf
- Cline
- Gemini CLI

## Features

- 🔗 Deep links for one-click installation (where supported)
- 📋 Copy-to-clipboard functionality
- 🎨 Beautiful, responsive styling
- 📱 Mobile-friendly design
- ⚡ Fast Cloudflare Worker deployment

## Development

1. Install dependencies: `npm install`
2. Test locally: `wrangler dev`
3. Deploy: `wrangler publish`
