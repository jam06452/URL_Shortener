export async function onRequest(context) {
  const url = new URL(context.request.url);

  // 1. DEFINE STATIC RULES
  // If it is the root OR has a file extension (like .js, .css, .png), serve static.
  // This prevents /p9zs6t from falling into the "SPA" trap.
  const isRoot = url.pathname === "/";
  const isFile = url.pathname.includes("."); // Simple check: does it have a dot?

  if (isRoot || isFile) {
    return context.next();
  }

  // 2. PROXY LOGIC
  // If we are here, it is a path like /p9zs6t with no extension.
  // We assume this is a shortcode for the API.

  const origin = "https://api.jam06452.uk";
  
  // Construct the API path (e.g., /url_shortener/p9zs6t)
  const fullPath = "/url_shortener" + url.pathname + url.search;
  const destination = new URL(fullPath, origin);

  const newRequest = new Request(destination, context.request);

  return fetch(newRequest);
}