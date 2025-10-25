# The easiest way to get beautiful MCP Installation Guides for your docs or readme

> Reduce installation friction for your MCP servers

MCPs can be installed in dozens of clients, and usually requires the user to run commands or edit a JSON configuration file somewhere, sometimes also restart the client. When you're building an MCP server, it's a giant overhead having to provide these instructions to your users for every client. That's where install-this-mcp comes in. This library and website generates comprehensive installation guides for MCP (Model Context Protocol) servers across different clients. [Check the latest demo here](https://x.com/janwilmake/status/1982068067229184181)

Changelog:

- [0.0.1](https://x.com/janwilmake/status/1969379701534646419)
- [0.2.0](https://x.com/janwilmake/status/1980196514719813645)
- [0.2.1](https://x.com/janwilmake/status/1982068067229184181)

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
2. **Guide generation**: Visit `/{serverName}?url={mcpUrl}` to generate a styled HTML guide

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

We favor clients with wide adoption, but less popular clients are also welcome if they have one-click-install deeplink support and support oauth. To add a client, please open a PR altering [index.js](index.js).
