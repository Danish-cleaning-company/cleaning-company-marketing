import assert from "node:assert/strict";
import { createReadStream, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve } from "node:path";

const outputDirectory = resolve(import.meta.dirname, "..", "staging-out");
const rules = readFileSync(join(outputDirectory, "_redirects"), "utf8")
  .trim()
  .split("\n")
  .map((line) => line.trim().split(/\s+/).slice(0, 2));

function normalizedPath(path) {
  return path === "/" ? path : path.replace(/\/+$/, "");
}

function fileForPath(pathname) {
  const relative = decodeURIComponent(pathname).replace(/^\/+/, "");
  const candidates = pathname === "/"
    ? [join(outputDirectory, "index.html")]
    : [join(outputDirectory, relative), join(outputDirectory, `${relative}.html`), join(outputDirectory, relative, "index.html")];
  return candidates.find((candidate) => {
    try {
      return statSync(candidate).isFile();
    } catch {
      return false;
    }
  });
}

const server = createServer((request, response) => {
  const pathname = new URL(request.url || "/", "http://localhost").pathname;
  const redirect = rules.find(([from]) => normalizedPath(from) === normalizedPath(pathname));

  if (redirect) {
    response.writeHead(301, { Location: redirect[1] });
    response.end();
    return;
  }

  if (pathname.length > 1 && pathname.endsWith("/")) {
    response.writeHead(301, { Location: normalizedPath(pathname) });
    response.end();
    return;
  }

  const file = fileForPath(pathname);
  if (!file) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  response.writeHead(200, { "Content-Type": extname(file) === ".html" ? "text/html" : "application/octet-stream" });
  createReadStream(file).pipe(response);
});

const canonicalRoutes = [
  "/",
  "/services/institutioner",
  "/services/restauranter",
  "/services/kontor",
  "/services/solarium",
  "/services/sommerhus",
  "/egtved",
  "/haderslev",
  "/vejle",
  "/job",
  "/kontakt",
  "/faa-tilbud",
  "/privatlivspolitik",
  "/thank-you",
  "/job-thank-you",
];

const legacyRoutes = [
  "/index.html",
  "/byer/egtved/",
  "/byer/haderslev/",
  "/byer/vejle/",
  ...canonicalRoutes.filter((path) => path !== "/").map((path) => `${path}/`),
  ...canonicalRoutes.filter((path) => path.startsWith("/services/") || ["/job", "/thank-you", "/job-thank-you"].includes(path)).map((path) => `${path}.html`),
  "/privacy-policy.html",
];

async function followRoute(origin, initialPath) {
  const chain = [];
  let url = new URL(initialPath, origin);

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const response = await fetch(url, { redirect: "manual" });
    chain.push(`${response.status} ${url.pathname}`);
    if (response.status < 300 || response.status >= 400) return { response, chain };
    url = new URL(response.headers.get("location"), url);
  }

  throw new Error(`Redirect limit exceeded for ${initialPath}: ${chain.join(" -> ")}`);
}

await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
const address = server.address();
assert(address && typeof address === "object");
const origin = `http://127.0.0.1:${address.port}`;

try {
  for (const path of [...canonicalRoutes, ...legacyRoutes]) {
    const { response, chain } = await followRoute(origin, path);
    assert.equal(response.status, 200, `${path}: ${chain.join(" -> ")}`);
    console.log(`${path}\t${chain.join(" -> ")}`);
  }

  for (const path of canonicalRoutes.filter((route) => route.startsWith("/services/"))) {
    const response = await fetch(`${origin}${path}?_rsc=diagnostic`, {
      redirect: "manual",
      headers: {
        RSC: "1",
        "Next-Router-Prefetch": "1",
      },
    });
    assert.equal(response.status, 200, `Prefetch request redirected for ${path}`);
    console.log(`${path}?_rsc=diagnostic\t${response.status} prefetch`);
  }

  console.log("Staging route verification passed.");
} finally {
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()));
}
