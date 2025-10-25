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
    : `https://www.google.com/s2/favicons?domain=${apexDomain}&sz=128`;

  // Client list view (when no client is selected)
  if (!selectedClient) {
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
    <link rel="icon" type="image/png" href="${clientIcon}">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }
        
        .widget-container {
            width: 100%;
            max-width: 480px;
            height: 600px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            border-radius: 1rem;
            overflow: hidden;
            background: white;
        }
        
        .client-list {
            overflow-y: auto;
            flex: 1;
        }
        
        .client-card {
            transition: all 0.2s ease;
        }
        
        .client-card:hover {
            background-color: #f9fafb;
            transform: translateX(4px);
        }
        
        .footer-link {
            color: white;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        .footer-link:hover {
            opacity: 1;
        }

        /* Iframe mode styles */
        .iframe-mode body {
            background: white;
            padding: 0;
            min-height: auto;
        }

        .iframe-mode .widget-container {
            max-width: 100%;
            height: 100vh;
            box-shadow: none;
            border-radius: 0;
        }

        .iframe-mode .header-section {
            background: white;
            color: #1f2937;
            border-bottom: 1px solid #e5e7eb;
        }

        .iframe-mode .header-title {
            color: #1f2937;
        }

        .iframe-mode .header-url {
            color: #6b7280;
        }

        .iframe-mode .footer-wrapper {
            display: none;
        }
        
        .iframe-mode .install-text {
            color: black !important;
        }

        @media (max-width: 600px) {
            body {
                background: white;
                padding: 0;
            }
            .widget-container {
                max-width: 100%;
                height: 100vh;
                box-shadow: none;
                border-radius: 0;
            }
            .header-section {
                background: white;
                color: #1f2937;
                border-bottom: 1px solid #e5e7eb;
            }
            .header-title {
                color: #1f2937;
            }
            .header-url {
                color: #6b7280;
            }
            .footer-wrapper {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="widget-container">
        <!-- Header -->
        <div class="header-section bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-8 text-white flex-shrink-0">
            <div class="flex items-center gap-4 mb-3">
                <img src="${clientIcon}" 
                     alt="${serverName}" 
                     class="w-12 h-12 rounded-lg bg-white/10 backdrop-blur p-1.5"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22white%22%3E%3Cpath d=%22M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z%22/%3E%3C/svg%3E'">
                <div class="flex-1 min-w-0">
                    <h1 class="header-title text-2xl font-bold truncate">${serverName}</h1>
                    <p class="header-url text-blue-100 text-sm truncate">${mcpUrl}</p>
                </div>
            </div>
            <p id="install-text" class="text-sm">Choose your client to install</p>
        </div>

        <!-- Client List -->
        <div class="client-list divide-y divide-gray-100">
            ${configs
              .map(
                (config) => `
                <div class="client-card cursor-pointer" onclick="navigateToClient('${
                  config.client
                }')">
                    <div class="px-6 py-4 flex items-center gap-4">
                        <img src="${config.iconUrl}" 
                             alt="${config.client}" 
                             class="w-10 h-10 rounded-lg flex-shrink-0"
                             onerror="this.style.display='none'">
                        <span class="font-medium text-gray-900 flex-1">${
                          config.client
                        }</span>
                        ${
                          config.deepLink
                            ? `
                            <button onclick="event.stopPropagation(); window.location.href='${config.deepLink}'"
                                    class="px-3 py-1.5 bg-blue-900 text-white text-sm rounded-lg hover:bg-blue-800 transition-colors flex-shrink-0">
                                Install Now
                            </button>
                        `
                            : `
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        `
                        }
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
    </div>
    
    <div class="footer-wrapper text-center mt-6 mb-4">
        <a href="/${encodeURIComponent(
          serverName
        )}/guides?url=${encodeURIComponent(mcpUrl)}" 
           class="footer-link inline-flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <span>Install onto your docs/website</span>
        </a>
    </div>
    
    <script>
        // Check for iframe mode
        const urlParams = new URLSearchParams(window.location.search);
        const isIframeParam = urlParams.get('iframe') === '1';
        const isSmallScreen = window.innerWidth <= 600;
        
        if (isIframeParam || isSmallScreen) {
            document.documentElement.classList.add('iframe-mode');
        }

        function navigateToClient(clientName) {
            const iframeParam = isIframeParam ? '&iframe=1' : '';
            window.location.href = \`/${encodeURIComponent(
              serverName
            )}/for/\${encodeURIComponent(clientName)}?url=${encodeURIComponent(
      mcpUrl
    )}\${iframeParam}\`;
        }
    </script>
    <!-- 100% privacy-first analytics -->
<script async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>

</body>
</html>`;
  }

  // Client-specific view
  const currentConfig = displayConfigs[0];

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
    <link rel="icon" type="image/png" href="${clientIcon}">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }
        
        .widget-container {
            width: 100%;
            max-width: 480px;
            height: 600px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            border-radius: 1rem;
            overflow: hidden;
            background: white;
        }
        
        .content-scroll {
            overflow-y: auto;
            flex: 1;
        }
        
        .tab-item {
            flex: 0 0 auto;
            opacity: 0.5;
            transition: opacity 0.2s;
        }
        
        .tab-item.active {
            opacity: 1;
        }
        
        .tab-item:hover {
            opacity: 0.8;
        }
        
        .footer-link {
            color: white;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        .footer-link:hover {
            opacity: 1;
        }

        /* Iframe mode styles */
        .iframe-mode body {
            background: white;
            padding: 0;
            min-height: auto;
            overflow: hidden;
        }

        .iframe-mode .widget-container {
            max-width: 100%;
            height: 100vh;
            box-shadow: none;
            border-radius: 0;
        }

        .iframe-mode .header-section {
            background: white;
            color: #1f2937;
            border-bottom: 1px solid #e5e7eb;
        }

        .iframe-mode .content-scroll {
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }

        .iframe-mode .footer-wrapper {
            display: none;
        }

        @media (max-width: 600px) {
            body {
                background: white;
                padding: 0;
                overflow: hidden;
            }
            .widget-container {
                max-width: 100%;
                height: 100vh;
                box-shadow: none;
                border-radius: 0;
            }
            .content-scroll {
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
            .footer-wrapper {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="widget-container">
        <!-- Header with Back Button -->
        <div class="header-section bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-4 text-white flex-shrink-0">
            <div class="flex items-center gap-3 mb-3">
                <button onclick="navigateBack()"
                        class="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <div class="flex-1 min-w-0">
                    <h1 class="text-xl font-bold truncate">${serverName}</h1>
                    <p class="text-sm">for ${selectedClient}</p>
                </div>
                <img src="${currentConfig.iconUrl}" 
                     alt="${selectedClient}" 
                     class="w-10 h-10 rounded-lg bg-white/10 backdrop-blur p-1.5"
                     onerror="this.style.display='none'">
            </div>
        </div>

        <!-- Client Tabs -->
        <div class="bg-white border-b border-gray-200 px-4 py-2 overflow-x-auto flex-shrink-0">
            <div class="flex gap-2">
                ${configs
                  .map(
                    (config) => `
                    <button onclick="navigateToClient('${config.client}')"
                            class="tab-item ${
                              config.client === selectedClient ? "active" : ""
                            }"
                            title="${config.client}">
                        <img src="${config.iconUrl}" 
                             alt="${config.client}" 
                             class="w-8 h-8 rounded"
                             onerror="this.style.display='none'">
                    </button>
                `
                  )
                  .join("")}
            </div>
        </div>

        <!-- Installation Content -->
        <div class="content-scroll p-6">
            ${
              currentConfig.deepLink
                ? `
                <a href="${currentConfig.deepLink}" 
                   class="block w-full mb-6 px-4 py-3 bg-blue-900 text-white text-center rounded-lg hover:bg-blue-800 transition-colors font-medium">
                    Quick Install in ${selectedClient}
                </a>
            `
                : ""
            }
            
            ${
              currentConfig.remoteCommand
                ? `
                <div class="bg-black text-green-400 p-4 rounded-lg mb-4 font-mono text-sm">
                    <div class="flex items-center justify-between gap-2">
                        <span class="break-all flex-1">$ ${currentConfig.remoteCommand}</span>
                        <button onclick="copyText(this.previousElementSibling.textContent.trim().substring(2), this)" 
                                class="text-gray-400 hover:text-white text-xs px-2 py-1 rounded transition-colors flex-shrink-0">
                            Copy
                        </button>
                    </div>
                </div>
            `
                : ""
            }
            
            <div class="prose prose-sm max-w-none mb-4 text-gray-700">
                ${currentConfig.instructions
                  ?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\n/g, "<br>")}
            </div>
            
            ${
              currentConfig.configJson
                ? `
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Configuration</span>
                        <button onclick="copyText(this.parentElement.nextElementSibling.textContent, this)"
                                class="text-xs text-gray-500 hover:text-black px-2 py-1 rounded transition-colors">
                            Copy JSON
                        </button>
                    </div>
                    <pre class="text-xs text-gray-800 overflow-x-auto"><code>${JSON.stringify(
                      currentConfig.configJson,
                      null,
                      2
                    )}</code></pre>
                </div>
            `
                : ""
            }
        </div>
    </div>
    
    <div class="footer-wrapper text-center mt-6 mb-4">
        <a href="/${encodeURIComponent(
          serverName
        )}/guides?url=${encodeURIComponent(mcpUrl)}" 
           class="footer-link inline-flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <span>Install onto your docs/website</span>
        </a>
    </div>
    
    <script>
        // Check for iframe mode
        const urlParams = new URLSearchParams(window.location.search);
        const isIframeParam = urlParams.get('iframe') === '1';
        const isSmallScreen = window.innerWidth <= 600;
        
        if (isIframeParam || isSmallScreen) {
            document.documentElement.classList.add('iframe-mode');
        }

        function copyText(text, button) {
            navigator.clipboard.writeText(text).then(() => {
                const original = button.textContent;
                button.textContent = '✓ Copied';
                setTimeout(() => button.textContent = original, 2000);
            }).catch(err => {
                console.error('Copy failed:', err);
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    const original = button.textContent;
                    button.textContent = '✓ Copied';
                    setTimeout(() => button.textContent = original, 2000);
                } catch (e) {
                    alert('Copy failed. Please copy manually.');
                }
                document.body.removeChild(textArea);
            });
        }
        
        function navigateToClient(clientName) {
            const iframeParam = isIframeParam ? '&iframe=1' : '';
            window.location.href = \`/${encodeURIComponent(
              serverName
            )}/for/\${encodeURIComponent(clientName)}?url=${encodeURIComponent(
    mcpUrl
  )}\${iframeParam}\`;
        }

        function navigateBack() {
            const iframeParam = isIframeParam ? '?iframe=1&url=' : '?url=';
            window.location.href = \`/${encodeURIComponent(
              serverName
            )}\${iframeParam}${encodeURIComponent(mcpUrl)}\`;
        }
    </script>
    <!-- 100% privacy-first analytics -->
<script async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>

</body>
</html>`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function generateGuidesPage(mcpUrl, serverName, configs) {
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
  )}-1e3a8a?style=for-the-badge)](${baseUrl})`;

  const iframeCode = `<iframe src="${baseUrl}&iframe=1" width="480" height="600" frameborder="0" title="Install ${serverName}"></iframe>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Installation Guides - ${serverName}</title>
    <meta name="description" content="Installation guides and embed code for ${serverName}">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .copy-success {
            background-color: #10b981 !important;
            color: white !important;
        }
        pre {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
    </style>
</head>
<body class="bg-gradient-to-br from-blue-900 to-blue-700 min-h-screen p-4">
    <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-xl shadow-2xl overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-blue-900 to-blue-700 px-8 py-6 text-white">
                <div class="flex items-center gap-4 mb-3">
                    <button onclick="window.location.href='/${encodeURIComponent(
                      serverName
                    )}?url=${encodeURIComponent(mcpUrl)}'"
                            class="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <div>
                        <h1 class="text-3xl font-bold">Installation Guides</h1>
                        <p class="text-blue-100 mt-1">${serverName}</p>
                    </div>
                </div>
            </div>

            <div class="p-8 space-y-8">
                <!-- Embed Widget -->
                <section>
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Embed on Your Website</h2>
                    <p class="text-gray-600 mb-4">Copy and paste this HTML to embed the installation widget:</p>
                    
                    <div class="relative">
                        <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">${iframeCode
                          .replace(/&/g, "&amp;")
                          .replace(/</g, "&lt;")
                          .replace(/>/g, "&gt;")
                          .replace(/"/g, "&quot;")}</pre>
                        <button onclick="copyCode(0, this)"
                                class="absolute top-4 right-4 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                            Copy HTML
                        </button>
                    </div>

                    <!-- Preview -->
                    <div class="mt-6">
                        <p class="text-sm font-medium text-gray-700 mb-3">Preview:</p>
                        <div class="flex justify-center bg-gradient-to-br from-blue-900 to-blue-700 p-8 rounded-lg">
                            <iframe src="${baseUrl}&iframe=1" 
                                    width="480" 
                                    height="600" 
                                    frameborder="0"
                                    title="Install ${serverName}"></iframe>
                        </div>
                    </div>
                </section>

                <!-- Install Button Badge -->
                <section>
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Install Button (Markdown)</h2>
                    <p class="text-gray-600 mb-4">Add this to your README.md or documentation:</p>
                    
                    <div class="relative">
                        <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">${buttonMarkdown}</pre>
                        <button onclick="copyCode(1, this)"
                                class="absolute top-4 right-4 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                            Copy Markdown
                        </button>
                    </div>

                    <div class="mt-4 text-center">
                        <p class="text-sm text-gray-600 mb-2">Preview:</p>
                        <img src="https://img.shields.io/badge/Install_MCP-${encodeURIComponent(
                          serverName
                        )}-1e3a8a?style=for-the-badge" alt="Install button">
                    </div>
                </section>

                <!-- Client Permalinks -->
                <section>
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Client-Specific Links</h2>
                    <p class="text-gray-600 mb-4">Direct links to installation instructions for each client:</p>
                    
                    <div class="relative">
                        <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">${permalinkMarkdown}</pre>
                        <button onclick="copyCode(2, this)"
                                class="absolute top-4 right-4 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                            Copy Links
                        </button>
                    </div>
                </section>

                <!-- Full Markdown Guide -->
                <section>
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Full Installation Guide (Markdown)</h2>
                    <p class="text-gray-600 mb-4">Complete installation instructions for all clients (${
                      fullGuide.split("\n").length
                    } lines):</p>
                    
                    <div class="relative">
                        <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96">${fullGuide
                          .replace(/&/g, "&amp;")
                          .replace(/</g, "&lt;")
                          .replace(/>/g, "&gt;")}</pre>
                        <button onclick="copyCode(3, this)"
                                class="absolute top-4 right-4 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                            Copy Guide
                        </button>
                    </div>
                </section>
            </div>
        </div>
    </div>

    <script>
        const copyableContent = [
            ${JSON.stringify(iframeCode)},
            ${JSON.stringify(buttonMarkdown)},
            ${JSON.stringify(permalinkMarkdown)},
            ${JSON.stringify(fullGuide)}
        ];

        function copyCode(index, button) {
            const text = copyableContent[index];
            navigator.clipboard.writeText(text).then(() => {
                const original = button.textContent;
                button.classList.add('copy-success');
                button.textContent = '✓ Copied!';
                setTimeout(() => {
                    button.classList.remove('copy-success');
                    button.textContent = original;
                }, 2000);
            }).catch(err => {
                console.error('Copy failed:', err);
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    const original = button.textContent;
                    button.classList.add('copy-success');
                    button.textContent = '✓ Copied!';
                    setTimeout(() => {
                        button.classList.remove('copy-success');
                        button.textContent = original;
                    }, 2000);
                } catch (e) {
                    alert('Copy failed. Please copy manually.');
                }
                document.body.removeChild(textArea);
            });
        }
    </script>
    <!-- 100% privacy-first analytics -->
<script async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>

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
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-blue-900 to-blue-700 font-sans min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full">
        <div class="text-center flex flex-col justify-center items-center mb-8">
            <div class="w-16 h-16 mx-auto mb-4 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
            </div>
            <h1 class="text-4xl font-bold text-white mb-2">Install This MCP</h1>
            <p class="text-blue-100">Generate shareable installation guides for your MCP server <br></p>

            <p class="text-center pt-4"><a href="https://github.com/janwilmake/install-this-mcp"><img src="https://img.shields.io/github/stars/janwilmake/install-this-mcp?style=social" 
       alt="GitHub stars"></a></p>
            
        </div>
        
        <div class="bg-white rounded-xl shadow-2xl p-6">
            <form id="mcpForm" class="space-y-4">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Server Name</label>
                    <input type="text" 
                           id="name" 
                           name="name" 
                           placeholder="My Awesome MCP Server"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                           required>
                </div>
                
                <div>
                    <label for="url" class="block text-sm font-medium text-gray-700 mb-2">Server URL</label>
                    <input type="url" 
                           id="url" 
                           name="url" 
                           placeholder="https://api.example.com/mcp"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                           required>
                </div>
                
                <button type="submit" 
                        class="w-full bg-blue-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-800 transition-colors">
                    Generate Installation Guide
                </button>
            </form>
            
            <div class="mt-6 pt-6 border-t border-gray-200">
                <p class="text-sm text-gray-600 mb-2"><strong>Example:</strong></p>
                <p class="text-xs text-gray-500"><strong>Name:</strong> Parallel Task MCP</p>
                <p class="text-xs text-gray-500"><strong>URL:</strong> https://task-mcp.parallel.ai/mcp</p>
            </div>
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
   <!-- 100% privacy-first analytics -->
<script async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
 
</body>
</html>`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

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

    if (pathParts.length > 0 && mcpUrl) {
      const serverName = decodeURIComponent(pathParts[0]);

      // Handle guides page: /{name}/guides
      if (pathParts.length === 2 && pathParts[1] === "guides") {
        try {
          const configs = generateMCPConfig(mcpUrl, serverName);
          const html = generateGuidesPage(mcpUrl, serverName, configs);

          return new Response(html, {
            headers: {
              "Content-Type": "text/html; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
            },
          });
        } catch (error) {
          return new Response("Error generating guides: " + error.message, {
            status: 500,
            headers: { "Content-Type": "text/plain" },
          });
        }
      }

      let selectedClient = null;

      // Handle client-specific page: /{name}/for/{client}
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

    const landingPage = generateLandingPage();
    return new Response(landingPage, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
};
