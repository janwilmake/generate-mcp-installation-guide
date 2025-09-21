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

## FAQ

**Does this support local MCPs?**

No, this is currently out of scope for us. installthismcp.com only supports remote MCPs. However, please reach out if you want to contribute and maintain this part.

**Does this support MCPs requiring API keys?**

No, also this is out of scope, and we are working towards a world where every client offers one-click installation without complex configuration instructions. Currently only public MCPs (without auth) or MCPs with OAuth (according to the [MCP protocol spec](https://modelcontextprotocol.io/specification/draft/basic/authorization)) are supported.

**Can you add LLM client XYZ?**

We favor clients with wide adoption, but less popular clients are also welcome if they have one-click-install deeplink support and support oauth. To add a client, please open a PR.

## TODO

- For clients that don't support oauth, there must be a way to say that in the form, and with that, have different instructions that include api key OR disable these clients if the MCP doesn't allow URL or header-based auth
- Keep track of which URLs get most traffic. This is potentially a nice way to start a registry.
- Find a way to keep doing MCP Client research every month or so, such that this repo is maintained.
- Use agents to find good ideas to get this thing actually used, and execute on it (with more agents)
