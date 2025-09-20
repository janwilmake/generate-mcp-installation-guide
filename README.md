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

- Landing page: https://installthismcp.com
- Direct guide: https://installthismcp.com/Weather%20Server?url=https://api.example.com/mcp

## Development

1. Install dependencies: `npm install`
2. Test locally: `wrangler dev`
3. Deploy: `wrangler publish`

## TODO

- For clients that don't support oauth, there must be a way to say that in the form, and with that, have different instructions that include api key OR disable these clients if the MCP doesn't allow URL or header-based auth
- Keep track of which URLs get most traffic. Add these to sitemap?
- Keep track of which clients get most installation clicks. These should be on top?
- OR: find a way to keep doing MCP Client research every month or so, such that this repo is maintained.
