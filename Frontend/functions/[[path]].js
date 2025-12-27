export async function onRequest(context) {
  const url = new URL(context.request.url);

  // 1. Static Asset Check (Keep this)
  const isStatic = 
    url.pathname === "/" || 
    url.pathname.includes(".") || 
    url.pathname.startsWith("/assets");

  if (isStatic) {
    return context.next();
  }

  // 2. API Proxy
  const origin = "https://api.jam06452.uk";
  const fullPath = "/url_shortener" + url.pathname + url.search;
  const destination = new URL(fullPath, origin);

  // Create the new request
  const newRequest = new Request(destination, context.request);

  // 3. EXECUTE FETCH WITH MANUAL REDIRECT
  // This tells the worker: "If the API sends a 301/302, don't follow it. Just return it."
  const response = await fetch(newRequest, { redirect: "manual" });

  // 4. Return the API's response (which contains the 301/302 Location header)
  return response;
}