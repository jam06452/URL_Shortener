export async function onRequest(context) {
  const url = new URL(context.request.url);

  // 1. Static Asset Check
  if (url.pathname === "/" || url.pathname.includes(".")) {
    return context.next();
  }

  // 2. Build API URL (for Redirects)
  // We only care about the path (e.g. /zw3ujl)
  const destination = new URL(
    "/url_shortener" + url.pathname, 
    "https://api.jam06452.uk"
  );

  // 3. Simple Proxy (GET only)
  // We force GET because we know this is only used for redirects.
  // redirect: "manual" ensures the 302/307 is passed to the browser.
  return fetch(destination, {
    method: "GET",
    redirect: "manual"
  });
}