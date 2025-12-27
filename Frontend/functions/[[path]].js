export async function onRequest(context) {
  const url = new URL(context.request.url);

  // 1. Static Asset Check
  if (url.pathname === "/" || url.pathname.includes(".")) {
    return context.next();
  }

  // 2. Prepare API URL
  const origin = "https://api.jam06452.uk";
  const fullPath = "/url_shortener" + url.pathname + url.search;
  
  // 3. Create the Proxy Request
  // Include 'body' so POST methods work correctly if you ever send JSON data
  const proxyRequest = new Request(new URL(fullPath, origin), {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body, // <--- Added this back for completeness
    redirect: "manual"
  });

  return fetch(proxyRequest);
}