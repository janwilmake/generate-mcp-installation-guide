https://pastebin.contextarea.com/Gxzqjp2.md lets use this idea for a cloudflare worker but also offer it as a package

-the package exposes a function to get filled config and to get the markdown

- the worker exposes /?url={url}&name={name} and returns a HTML with the guide with nice styling. it's hosted at installthismcp.com so the main title should be "Install This MCP"

The landingpage should allow a form to fill in URL and name when they're not both given.

update this worker.js such that there's a link icon added to each client that, when clicked, adds &client={client} to the url and navigates there, which will show a html focused on just that client with a button to view all clients. it should appropriately update the title, html meta tags, and icon
