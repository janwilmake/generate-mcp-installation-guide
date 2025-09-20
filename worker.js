const { generateMCPConfig } = require("./index");

function generateHTML(mcpUrl, serverName, configs) {
  const apexDomain = new URL(mcpUrl).hostname
    .split(".")
    .reverse()
    .slice(0, 2)
    .reverse()
    .join(".");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Install This MCP</title>
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
</head>
<body class="bg-white font-sans">
    <div class="max-w-4xl mx-auto px-4 py-8">
        <!-- Header -->
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-black mb-2">Install This MCP</h1>
            <p class="text-apple-gray-600 text-lg">Connect your MCP server to any client</p>
            
            <!-- Server Info -->
            <div class="bg-apple-gray-50 rounded-xl p-6 mt-8 border border-apple-gray-200">
                <div class="flex items-center justify-center gap-4 mb-4">
                    <img src="https://www.google.com/s2/favicons?domain=${apexDomain}&sz=64" 
                         alt="${serverName}" 
                         class="w-16 h-16 rounded-xl border border-apple-gray-200"
                         onerror="this.style.display='none'">
                    <div>
                        <h2 class="text-2xl font-semibold text-black">${serverName}</h2>
                        <code class="text-sm text-apple-gray-600 bg-apple-gray-200 px-2 py-1 rounded">${mcpUrl}</code>
                    </div>
                </div>
            </div>
        </div>

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

        <!-- Manual Setup -->
        <div class="space-y-8">
            <h3 class="text-xl font-semibold text-black mb-6">Manual Setup</h3>
            
            ${configs
              .map(
                (config, index) => `
                <div class="border border-apple-gray-200 rounded-xl p-6">
                    <div class="flex items-center gap-3 mb-4">
                        <img src="${config.iconUrl}" alt="${
                  config.client
                }" class="w-8 h-8 rounded">
                        <h4 class="text-lg font-semibold text-black">${
                          config.client
                        }</h4>
                    </div>
                    
                    ${
                      config.remoteCommand
                        ? `
                        <div class="bg-black text-green-400 p-4 rounded-lg mb-4 font-mono text-sm">
                            <div class="flex items-center justify-between">
                                <span>$ ${config.remoteCommand}</span>
                                <button onclick="copyToClipboard('${config.remoteCommand}')" 
                                        class="text-apple-gray-400 hover:text-white text-xs">
                                    Copy
                                </button>
                            </div>
                        </div>
                    `
                        : ""
                    }
                    
                    <div class="prose prose-sm max-w-none mb-4">
                        <div class="text-apple-gray-700">${config.instructions
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
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
                                ).replace(/'/g, "\\'")}') "
                                        class="text-xs text-apple-gray-500 hover:text-black">
                                    Copy JSON
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

        <!-- Footer -->
        <div class="text-center mt-12 pt-8 border-t border-apple-gray-200">
            <p class="text-apple-gray-500 text-sm">Generated by installthismcp.com</p>
        </div>
    </div>
    
    <script>
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('Copied to clipboard');
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
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
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white font-sans min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full">
        <div class="text-center mb-8">
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
                window.location.href = '/?name=' + encodeURIComponent(name) + '&url=' + encodeURIComponent(url);
            }
        });
    </script>
</body>
</html>`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const mcpUrl = url.searchParams.get("url");
    const serverName = url.searchParams.get("name");

    if (mcpUrl && serverName) {
      try {
        const configs = generateMCPConfig(mcpUrl, serverName);
        const html = generateHTML(mcpUrl, serverName, configs);

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

    const landingPage = generateLandingPage();
    return new Response(landingPage, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
};
