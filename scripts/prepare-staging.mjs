import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const productionOutput = join(projectRoot, "out");
const stagingOutput = join(projectRoot, "staging-out");
const noindexTag = '<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">';

rmSync(stagingOutput, { recursive: true, force: true });
mkdirSync(stagingOutput, { recursive: true });
cpSync(productionOutput, stagingOutput, { recursive: true });

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) walk(path);
    else if (path.endsWith(".html")) {
      const html = readFileSync(path, "utf8");
      writeFileSync(path, html.replace("<head>", `<head>${noindexTag}`));
    }
  }
}

walk(stagingOutput);

writeFileSync(
  join(stagingOutput, "robots.txt"),
  "User-agent: *\nDisallow: /\n",
);

writeFileSync(
  join(stagingOutput, "_headers"),
  `/*
  X-Robots-Tag: noindex, nofollow, noarchive, nosnippet
  Referrer-Policy: strict-origin-when-cross-origin
  X-Content-Type-Options: nosniff
`,
);

const redirects = [
  ["/index.html", "/"],
  ["/byer/egtved", "/egtved"],
  ["/byer/egtved/", "/egtved"],
  ["/byer/egtved/index.html", "/egtved"],
  ["/byer/haderslev", "/haderslev"],
  ["/byer/haderslev/", "/haderslev"],
  ["/byer/haderslev/index.html", "/haderslev"],
  ["/byer/vejle", "/vejle"],
  ["/byer/vejle/", "/vejle"],
  ["/byer/vejle/index.html", "/vejle"],
  ["/services/institutioner.html", "/services/institutioner"],
  ["/services/restauranter.html", "/services/restauranter"],
  ["/services/kontor.html", "/services/kontor"],
  ["/services/solarium.html", "/services/solarium"],
  ["/services/sommerhus.html", "/services/sommerhus"],
  ["/job.html", "/job"],
  ["/thank-you.html", "/thank-you"],
  ["/job-thank-you.html", "/job-thank-you"],
  ["/privacy-policy", "/privatlivspolitik"],
  ["/privacy-policy.html", "/privatlivspolitik"],
  ["/services/privacy-policy", "/privatlivspolitik"],
  ["/services/privacy-policy.html", "/privatlivspolitik"],
];

function normalizedNetlifyPath(path) {
  return path === "/" ? path : path.replace(/\/+$/, "");
}

for (const [from, to] of redirects) {
  if (normalizedNetlifyPath(from) === normalizedNetlifyPath(to)) {
    throw new Error(`Refusing to generate a self-redirect: ${from} -> ${to}`);
  }
}

writeFileSync(
  join(stagingOutput, "_redirects"),
  `${redirects.map(([from, to]) => `${from} ${to} 301!`).join("\n")}\n`,
);

console.log(`Prepared staging artifact: ${stagingOutput}`);
