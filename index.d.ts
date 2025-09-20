export interface MCPConfig {
  client: string;
  deepLink?: string;
  instructions: string;
  configJson?: Record<string, any>;
  remoteCommand?: string;
}

export function generateMCPConfig(
  mcpUrl: string,
  serverName: string
): MCPConfig[];
export function generateMCPInstallationGuide(
  mcpUrl: string,
  serverName: string
): string;
