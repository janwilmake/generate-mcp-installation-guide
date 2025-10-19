const { generateMCPConfig, generateMCPInstallationGuide } = require("./index");

function generateHTML(mcpUrl, serverName, configs, selectedClient = null) {
  const apexDomain = new URL(mcpUrl).hostname
    .split(".")
    .reverse()
    .slice(0, 2)
    .reverse()
    .join(".");

  // Filter configs if a specific client is selected
  const displayConfigs = selectedClient
    ? configs.filter(
        (config) => config.client.toLowerCase() === selectedClient.toLowerCase()
      )
    : configs;

  const pageTitle = selectedClient
    ? `Install ${serverName} for ${selectedClient}`
    : `Install ${serverName}`;

  const pageDescription = selectedClient
    ? `Install ${serverName} MCP server for ${selectedClient}`
    : `Connect ${serverName} MCP server to any client`;

  const clientIcon = selectedClient
    ? displayConfigs[0]?.iconUrl
    : `https://www.google.com/s2/favicons?domain=${apexDomain}&sz=64`;

  // Generate copyable content for all clients view
  let copyableContent = "";
  if (!selectedClient) {
    const baseUrl = `https://installthismcp.com/${encodeURIComponent(
      serverName
    )}?url=${encodeURIComponent(mcpUrl)}`;
    const fullGuide = generateMCPInstallationGuide(mcpUrl, serverName);

    const permalinkMarkdown = configs
      .map((config) => {
        const clientUrl = `https://installthismcp.com/${encodeURIComponent(
          serverName
        )}/for/${encodeURIComponent(config.client)}?url=${encodeURIComponent(
          mcpUrl
        )}`;
        return `- [${config.client}](${clientUrl})`;
      })
      .join("\n");

    const buttonMarkdown = `[![Install ${serverName}](https://img.shields.io/badge/Install_MCP-${encodeURIComponent(
      serverName
    )}-black?style=for-the-badge)](${baseUrl})`;

    copyableContent = `
        <!-- Copyable Content Section -->
        <div class="mt-12 space-y-6">
            <h3 class="text-xl font-semibold text-black mb-6">Share This Guide</h3>
            
            <div class="space-y-4">
                <!-- Full Guide Markdown -->
                <div class="border border-apple-gray-200 rounded-xl p-4">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-sm font-medium text-apple-gray-700">Full Installation Guide (${
                          fullGuide.split("\n").length
                        } lines)</span>
                        <button onclick="copyToClipboard(document.getElementById('fullGuide').value, this)" 
                                class="flex items-center gap-2 px-3 py-1.5 bg-apple-gray-100 text-apple-gray-700 text-sm rounded-lg hover:bg-apple-gray-200 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            <span>Copy</span>
                        </button>
                    </div>
                    <textarea id="fullGuide" class="w-full h-24 text-xs text-apple-gray-800 bg-apple-gray-50 border border-apple-gray-200 rounded p-3 resize-none font-mono" readonly>${fullGuide}</textarea>
                </div>
                
                <!-- Client Permalinks -->
                <div class="border border-apple-gray-200 rounded-xl p-4">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-sm font-medium text-apple-gray-700">Client Permalinks (${
                          configs.length
                        } lines)</span>
                        <button onclick="copyToClipboard(document.getElementById('permalinks').value, this)" 
                                class="flex items-center gap-2 px-3 py-1.5 bg-apple-gray-100 text-apple-gray-700 text-sm rounded-lg hover:bg-apple-gray-200 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            <span>Copy</span>
                        </button>
                    </div>
                    <textarea id="permalinks" class="w-full h-24 text-xs text-apple-gray-800 bg-apple-gray-50 border border-apple-gray-200 rounded p-3 resize-none font-mono" readonly>${permalinkMarkdown}</textarea>
                </div>
                
                <!-- Button Markdown -->
                <div class="border border-apple-gray-200 rounded-xl p-4">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-sm font-medium text-apple-gray-700">Install Button (1 line)</span>
                        <button onclick="copyToClipboard(document.getElementById('buttonMarkdown').value, this)" 
                                class="flex items-center gap-2 px-3 py-1.5 bg-apple-gray-100 text-apple-gray-700 text-sm rounded-lg hover:bg-apple-gray-200 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            <span>Copy</span>
                        </button>
                    </div>
                    <div class="space-y-2">
                        <textarea id="buttonMarkdown" class="w-full h-12 text-xs text-apple-gray-800 bg-apple-gray-50 border border-apple-gray-200 rounded p-3 resize-none font-mono" readonly>${buttonMarkdown}</textarea>
                        <div class="text-center">
                            <span class="text-xs text-apple-gray-500">Preview:</span><br>
                            <img src="https://img.shields.io/badge/Install_MCP-${encodeURIComponent(
                              serverName
                            )}-black?style=for-the-badge" alt="Install button preview" class="mt-1">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${pageDescription}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${pageDescription}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${clientIcon}">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${pageDescription}">
    <meta name="twitter:image" content="${clientIcon}">
    <link rel="icon" type="image/png" href="${clientIcon}">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              'apple-gray': {
                50: '#f9fafb',
                100: '#f3f4f6',
                200: '#e5e7eb',
                300: '#d1d5db',
                400: '#9ca3af',
                500: '#6b7280',
                600: '#4b5563',
                700: '#374151',
                800: '#1f2937',
                900: '#111827',
              }
            }
          }
        }
      }
    </script>
    <style>
        /* Toast notification styles */
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease-in-out;
        }
        .toast.show {
            transform: translateX(0);
            opacity: 1;
        }
        .toast.error {
            background: #ef4444;
        }
        
        /* Button feedback styles */
        .btn-copied {
            background-color: #10b981 !important;
            color: white !important;
        }
        .btn-copied svg {
            display: none;
        }
        .btn-copied::after {
            content: '✓';
            font-weight: bold;
        }
    </style>
</head>
<body class="bg-white font-sans">
    <!-- GitHub Star Button -->
    <div class="fixed top-4 right-4 z-50">
        <iframe src="https://ghbtns.com/github-btn.html?user=janwilmake&repo=install-this-mcp&type=star&count=true&size=large" 
                frameborder="0" scrolling="0" width="170" height="30" title="GitHub"></iframe>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-8">
        <!-- Header -->
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-black mb-2">${pageTitle}</h1>
            <p class="text-apple-gray-600 text-lg">${pageDescription}</p>
            
            ${
              selectedClient
                ? `
            <!-- Back to All Clients Button -->
            <div class="mt-4">
                <a href="/${encodeURIComponent(
                  serverName
                )}?url=${encodeURIComponent(mcpUrl)}" 
                   class="inline-flex items-center gap-2 px-4 py-2 bg-apple-gray-100 text-apple-gray-700 rounded-lg hover:bg-apple-gray-200 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    View All Clients
                </a>
            </div>
            `
                : ""
            }
            
            <!-- Server Info -->
            <div class="bg-apple-gray-50 rounded-xl p-6 mt-8 border border-apple-gray-200">
                <div class="flex items-center justify-center gap-4 mb-4">
                    <img src="${
                      selectedClient
                        ? displayConfigs[0]?.iconUrl
                        : `https://www.google.com/s2/favicons?domain=${apexDomain}&sz=64`
                    }" 
                         alt="${selectedClient || serverName}" 
                         class="w-16 h-16 rounded-xl border border-apple-gray-200"
                         onerror="this.style.display='none'">
                    <div>
                        <h2 class="text-2xl font-semibold text-black">${serverName}</h2>
                        <code class="text-sm text-apple-gray-600 bg-apple-gray-200 px-2 py-1 rounded">${mcpUrl}</code>
                    </div>
                </div>
            </div>
        </div>

        ${
          !selectedClient
            ? `
        <!-- Quick Install Links -->
        <div class="mb-12">
            <h3 class="text-xl font-semibold text-black mb-4">Quick Install</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                ${configs
                  .filter((config) => config.deepLink)
                  .map(
                    (config) => `
                    <a href="${config.deepLink}" 
                       class="flex items-center gap-3 p-4 bg-black text-white rounded-xl hover:bg-apple-gray-800 transition-colors">
                        <img src="${config.iconUrl}" alt="${config.client}" class="w-8 h-8 rounded">
                        <span class="font-medium">${config.client}</span>
                    </a>
                `
                  )
                  .join("")}
            </div>
        </div>
        `
            : ""
        }

        ${
          selectedClient && displayConfigs[0]?.deepLink
            ? `
        <!-- Quick Install for Selected Client -->
        <div class="mb-8">
            <a href="${displayConfigs[0].deepLink}" 
               class="inline-flex items-center gap-3 px-6 py-3 bg-black text-white rounded-xl hover:bg-apple-gray-800 transition-colors text-lg font-medium">
                <img src="${displayConfigs[0].iconUrl}" alt="${displayConfigs[0].client}" class="w-8 h-8 rounded">
                Quick Install in ${displayConfigs[0].client}
            </a>
        </div>
        `
            : ""
        }

        <!-- Manual Setup -->
        <div class="space-y-8">
            <h3 class="text-xl font-semibold text-black mb-6">${
              selectedClient ? `Install for ${selectedClient}` : "Manual Setup"
            }</h3>
            
            ${displayConfigs
              .map(
                (config, index) => `
                <div class="border border-apple-gray-200 rounded-xl p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <img src="${config.iconUrl}" alt="${
                  config.client
                }" class="w-8 h-8 rounded">
                            <h4 class="text-lg font-semibold text-black">${
                              config.client
                            }</h4>
                        </div>
                        <div class="flex items-center gap-2">
                            ${
                              config.deepLink
                                ? `
                            <a href="${config.deepLink}"
                               class="px-3 py-1.5 bg-black text-white text-sm rounded-lg hover:bg-apple-gray-800 transition-colors">
                                Quick Install
                            </a>
                            `
                                : ""
                            }
                            ${
                              !selectedClient
                                ? `
                            <button onclick="navigateToClient('${config.client}')"
                                    class="p-2 text-apple-gray-400 hover:text-black transition-colors"
                                    title="View ${config.client} only">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                            </button>
                            `
                                : ""
                            }
                        </div>
                    </div>
                    
                    ${
                      config.remoteCommand
                        ? `
                        <div class="bg-black text-green-400 p-4 rounded-lg mb-4 font-mono text-sm">
                            <div class="flex items-center justify-between">
                                <span>$ ${config.remoteCommand}</span>
                                <button onclick="copyToClipboard('${config.remoteCommand?.replace(
                                  /'/g,
                                  "\\'"
                                )}', this)" 
                                        class="text-apple-gray-400 hover:text-white text-xs px-2 py-1 rounded transition-colors">
                                    <span>Copy</span>
                                </button>
                            </div>
                        </div>
                    `
                        : ""
                    }
                    
                    <div class="prose prose-sm max-w-none mb-4">
                        <div class="text-apple-gray-700">${config.instructions
                          ?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\n/g, "<br>")}</div>
                    </div>
                    
                    ${
                      config.configJson
                        ? `
                        <div class="bg-apple-gray-50 rounded-lg p-4 border border-apple-gray-200">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm font-medium text-apple-gray-700">Configuration</span>
                                <button onclick="copyToClipboard('${JSON.stringify(
                                  config.configJson,
                                  null,
                                  2
                                ).replace(/'/g, "\\'")}', this)"
                                        class="text-xs text-apple-gray-500 hover:text-black px-2 py-1 rounded transition-colors">
                                    <span>Copy JSON</span>
                                </button>
                            </div>
                            <pre class="text-xs text-apple-gray-800 overflow-x-auto"><code>${JSON.stringify(
                              config.configJson,
                              null,
                              2
                            )}</code></pre>
                        </div>
                    `
                        : ""
                    }
                </div>
            `
              )
              .join("")}
        </div>

        ${copyableContent}

        <!-- Footer -->
        <div class="text-center mt-12 pt-8 border-t border-apple-gray-200">
            <p class="text-apple-gray-500 text-sm">Generated by installthismcp.com</p>
        </div>
    </div>
    
    <script>
        // Improved copy to clipboard function with visual feedback
        async function copyToClipboard(text, buttonElement) {
            try {
                await navigator.clipboard.writeText(text);
                showCopySuccess(buttonElement);
                showToast('Copied to clipboard!', 'success');
            } catch (err) {
                console.error('Copy failed, trying fallback method:', err);
                
                // Fallback method for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    const successful = document.execCommand('copy');
                    if (successful) {
                        showCopySuccess(buttonElement);
                        showToast('Copied to clipboard!', 'success');
                    } else {
                        throw new Error('execCommand failed');
                    }
                } catch (fallbackErr) {
                    console.error('Fallback copy also failed:', fallbackErr);
                    showToast('Failed to copy to clipboard', 'error');
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        }
        
        // Show visual feedback on the button
        function showCopySuccess(buttonElement) {
            if (!buttonElement) return;
            
            const originalText = buttonElement.innerHTML;
            const originalClasses = buttonElement.className;
            
            // Add success styling
            buttonElement.classList.add('btn-copied');
            const span = buttonElement.querySelector('span');
            if (span) {
                span.textContent = 'Copied!';
            }
            
            // Reset after 2 seconds
            setTimeout(() => {
                buttonElement.className = originalClasses;
                buttonElement.innerHTML = originalText;
            }, 2000);
        }
        
        // Show toast notification
        function showToast(message, type = 'success') {
            // Remove any existing toast
            const existingToast = document.querySelector('.toast');
            if (existingToast) {
                existingToast.remove();
            }
            
            const toast = document.createElement('div');
            toast.className = \`toast \${type === 'error' ? 'error' : ''}\`;
            toast.textContent = message;
            
            document.body.appendChild(toast);
            
            // Trigger animation
            setTimeout(() => {
                toast.classList.add('show');
            }, 10);
            
            // Remove after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, 3000);
        }
        
        function navigateToClient(clientName) {
            window.location.href = \`/${encodeURIComponent(
              serverName
            )}/for/\${encodeURIComponent(clientName)}?url=${encodeURIComponent(
    mcpUrl
  )}\`;
        }
    </script>
</body>
</html>`;
}

function generateLandingPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Install This MCP</title>
    <meta name="description" content="Generate shareable installation guides for your MCP server">
    <meta property="og:title" content="Install This MCP">
    <meta property="og:description" content="Generate shareable installation guides for your MCP server">
    <meta property="og:type" content="website">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white font-sans min-h-screen flex items-center justify-center px-4">
    <!-- GitHub Star Button -->
    <div class="fixed top-4 right-4 z-50">
        <iframe src="https://ghbtns.com/github-btn.html?user=janwilmake&repo=install-this-mcp&type=star&count=true&size=large" 
                frameborder="0" scrolling="0" width="170" height="30" title="GitHub"></iframe>
    </div>

    <div class="max-w-md w-full">
        <div class="text-center mb-8">
            <div class="w-16 h-16 mx-auto mb-4 bg-black rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
            </div>
            <h1 class="text-4xl font-bold text-black mb-2">Install This MCP</h1>
            <p class="text-gray-600">Generate shareable installation guides for your MCP server</p>
        </div>
        
        <form id="mcpForm" class="space-y-6">
            <div>
                <label for="name" class="block text-sm font-medium text-black mb-2">Server Name</label>
                <input type="text" 
                       id="name" 
                       name="name" 
                       placeholder="My Awesome MCP Server"
                       class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                       required>
            </div>
            
            <div>
                <label for="url" class="block text-sm font-medium text-black mb-2">Server URL</label>
                <input type="url" 
                       id="url" 
                       name="url" 
                       placeholder="https://api.example.com/mcp"
                       class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                       required>
            </div>
            
            <button type="submit" 
                    class="w-full bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                Generate Installation Guide
            </button>
        </form>
        
        <div class="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 class="font-medium text-black mb-2">Example</h3>
            <p class="text-sm text-gray-600"><strong>Name:</strong> Parallel Task MCP</p>
            <p class="text-sm text-gray-600"><strong>URL:</strong> https://task-mcp.parallel.ai/mcp</p>
        </div>
    </div>
    
    <script>
        document.getElementById('mcpForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const url = document.getElementById('url').value;
            
            if (name && url) {
                window.location.href = '/' + encodeURIComponent(name) + '?url=' + encodeURIComponent(url);
            }
        });
    </script>
</body>
</html>`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle favicon request
    if (url.pathname === "/favicon.svg") {
      const favicon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
</svg>`;

      return new Response(favicon, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=31536000",
        },
      });
    }

    const pathParts = url.pathname.split("/").filter(Boolean);
    const mcpUrl = url.searchParams.get("url");

    // Parse new URL structure: /{name}[/for/{client}]?url={url}
    if (pathParts.length > 0 && mcpUrl) {
      const serverName = decodeURIComponent(pathParts[0]);
      let selectedClient = null;

      // Check if it's the "for" client pattern: /{name}/for/{client}
      if (pathParts.length === 3 && pathParts[1] === "for") {
        selectedClient = decodeURIComponent(pathParts[2]);
      }

      try {
        const configs = generateMCPConfig(mcpUrl, serverName);
        const html = generateHTML(mcpUrl, serverName, configs, selectedClient);

        return new Response(html, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      } catch (error) {
        return new Response("Error generating guide: " + error.message, {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        });
      }
    }

    // Show landing page for root path
    const landingPage = generateLandingPage();
    return new Response(landingPage, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
};
