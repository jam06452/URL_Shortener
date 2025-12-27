export async function onRequest(context) {
  const url = new URL(context.request.url);

  // 1. Static Asset Check
  // Pass through if it's the root or looks like a file (has an extension)
  if (url.pathname === "/" || url.pathname.includes(".")) {
    return context.next();
  }

  // 2. Prepare the API URL
  const origin = "https://api.jam06452.uk";
  const fullPath = "/url_shortener" + url.pathname + url.search;
  const destination = new URL(fullPath, origin);

  // 3. Create the Proxy Request
  // We use the original request info (headers, method) but target the new URL
  const newRequest = new Request(destination, context.request);

  // 4. FETCH WITH "MANUAL" REDIRECT
  // This is the fix. It tells Cloudflare to return the 301/302 status 
  // to the browser instead of following it.
  return fetch(newRequest, { redirect: "manual" });
}