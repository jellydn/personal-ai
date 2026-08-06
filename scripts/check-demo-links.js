#!/usr/bin/env node
// Demo-link guard: every non-null demo URL in the projects array must respond
// with a successful status (2xx/3xx after following redirects) and must not
// land on a login wall or an expired preview deployment. Wired into CI so dead
// or private destinations are caught before the site ships — the exact failure
// mode that previously took down the streaming-chat-demo link (an expired
// Vercel preview redirecting to vercel.com/login).
//
// Usage: node scripts/check-demo-links.js [path-to-index.html]
// Defaults to ./index.html. Exits non-zero with a message on any dead link.
"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");

const file = path.resolve(process.argv[2] || "index.html");
const src = fs.readFileSync(file, "utf8");

const MAX_REDIRECTS = 5;
const TIMEOUT_MS = 15000;
const CONCURRENCY = 6;

// Extract a balanced JS array literal after `const projects =`, tolerating
// strings, comments, and nested brackets. Mirrors the parity guard's scanner.
function extractProjects(html) {
  const marker = "const projects =";
  const start = html.indexOf(marker);
  if (start === -1) {
    throw new Error(`${path.relative(process.cwd(), file)}: missing ${marker}`);
  }
  const open = html.indexOf("[", start);
  let depth = 0;
  let quote = null; // null | '"' | "'" | "`"
  let comment = null; // null | "//" | "/*"
  let end = -1;
  for (let i = open; i < html.length; i++) {
    const ch = html[i];
    const next = html[i + 1];
    if (comment === "//") {
      if (ch === "\n") comment = null;
      continue;
    }
    if (comment === "/*") {
      if (ch === "*" && next === "/") {
        comment = null;
        i++;
      }
      continue;
    }
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === "/" && next === "/") {
      comment = "//";
      i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      comment = "/*";
      i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "[") depth++;
    if (ch === "]" && --depth === 0) {
      end = i;
      break;
    }
  }
  if (end === -1) {
    throw new Error(`${path.relative(process.cwd(), file)}: unterminated projects array`);
  }
  // Data-only literal (no DOM, no calls) — safe to evaluate in a fresh scope.
  // eslint-disable-next-line no-new-func
  return new Function(`return ${html.slice(open, end + 1)}`)();
}

// Hosts/paths that are authentication walls rather than usable demos. An
// expired Vercel preview redirects to vercel.com/login; a private repo page
// redirects to github.com/login; Google/Microsoft SSO are never demos.
function isLoginWall(url) {
  const patterns = [
    /^https?:\/\/[^/]*vercel\.com\/(login|sso|sso-api)/i,
    /^https?:\/\/github\.com\/login/i,
    /^https?:\/\/accounts\.google\.com/i,
    /^https?:\/\/login\.microsoftonline\.com/i,
    /^https?:\/\/[^/]*\.auth0\.com\//i,
    /^https?:\/\/[^/]*\.okta\.com\//i,
    /^https?:\/\/auth\.(?:supabase|firebase|clerk)\./i,
  ];
  return patterns.some((re) => re.test(url));
}

// A demo must point at a real, publicly reachable host — never localhost or a
// private-network address (signals "run it locally yourself", not a demo).
function isUnreachableAddress(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      /^10\.\d+\.\d+\.\d+$/.test(host) ||
      /^192\.168\.\d+\.\d+$/.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(host)
    );
  } catch {
    return false;
  }
}

function fetchOnce(url, method) {
  return new Promise((resolve) => {
    let u;
    try {
      u = new URL(url);
    } catch {
      resolve({ status: "ERR:invalid-url", finalUrl: url });
      return;
    }
    const mod = u.protocol === "https:" ? https : u.protocol === "http:" ? http : null;
    if (!mod) {
      resolve({ status: "ERR:protocol", finalUrl: url });
      return;
    }
    const req = mod.request(
      u,
      {
        method,
        timeout: TIMEOUT_MS,
        headers: {
          "User-Agent": "personal-ai-demo-link-guard (+https://github.com/jellydn/personal-ai)",
        },
      },
      (res) => {
        res.resume();
        resolve({ status: res.statusCode, location: res.headers.location || null, finalUrl: url });
      }
    );
    req.on("error", (e) => resolve({ status: `ERR:${e.code || "network"}`, location: null, finalUrl: url }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ status: "ERR:timeout", location: null, finalUrl: url });
    });
    req.end();
  });
}

// Follow redirects up to MAX_REDIRECTS; fall back to GET when a server does not
// answer HEAD (405 Method Not Allowed). Returns the final status and URL after
// the redirect chain.
async function fetchStatus(url) {
  let current = url;
  let method = "HEAD";
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await fetchOnce(current, method);
    const status = res.status;
    if (typeof status === "number") {
      // Some servers only answer GET — retry the same URL once with GET.
      if ((status === 405 || status === 501) && method === "HEAD") {
        method = "GET";
        continue;
      }
      if (status >= 300 && status < 400 && res.location) {
        try {
          current = new URL(res.location, current).toString();
        } catch {
          // Malformed Location header — treat as a failure for this link rather
          // than letting one bad header abort the whole run.
          return { status: "ERR:invalid-redirect", finalUrl: current };
        }
        continue;
      }
    }
    return { status, finalUrl: current };
  }
  return { status: "ERR:too-many-redirects", finalUrl: current };
}

// A failure is worth retrying only when it is transient: network errors or a
// 5xx from the server. Definitive 4xx (dead link, private repo) will never
// become 200 on retry, so they fail immediately.
function isTransient(status) {
  return (
    typeof status === "string" && status.startsWith("ERR:") && status !== "ERR:invalid-url" && status !== "ERR:invalid-redirect"
  ) || (typeof status === "number" && status >= 500 && status < 600);
}

async function check(url, attemptsLeft = 2) {
  const result = await fetchStatus(url);
  if (typeof result.status === "number" && result.status >= 200 && result.status < 400) {
    if (isLoginWall(result.finalUrl)) return { ...result, wall: true };
    return result;
  }
  if (isTransient(result.status) && attemptsLeft > 0) return check(url, attemptsLeft - 1);
  return result;
}

async function runPool(tasks, concurrency) {
  const results = new Array(tasks.length);
  let next = 0;
  async function worker() {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, worker);
  await Promise.all(workers);
  return results;
}

(async () => {
  const projects = extractProjects(src);
  const demos = projects
    .map((p) => ({ name: p.name, demo: p.demo }))
    .filter((p) => typeof p.demo === "string" && p.demo.length > 0);

  console.log(`demo-link guard: checking ${demos.length} demo link(s) from ${projects.length} projects`);

  const failures = [];
  await runPool(
    demos.map((p) => async () => {
      const pre = isUnreachableAddress(p.demo)
        ? { status: "ERR:private-address", finalUrl: p.demo }
        : await check(p.demo);
      const ok = typeof pre.status === "number" && pre.status >= 200 && pre.status < 400 && !pre.wall;
      const mark = ok ? "✓" : "✗";
      console.log(
        `${mark} ${String(pre.status).padEnd(18)} ${p.name.padEnd(26)} ${p.demo}${pre.wall ? "  → login wall: " + pre.finalUrl : ""}`
      );
      if (!ok) failures.push({ name: p.name, demo: p.demo, result: pre });
    }),
    CONCURRENCY
  );

  if (failures.length > 0) {
    console.error(
      `\ndemo-link guard FAILED: ${failures.length} of ${demos.length} demo link(s) are dead or unreachable:`
    );
    for (const f of failures) {
      console.error(`  - ${f.name}: ${f.demo} → ${f.result.status}${f.result.wall ? " (login wall: " + f.result.finalUrl + ")" : ""}`);
    }
    process.exit(1);
  }

  console.log(`demo-link guard OK: all ${demos.length} demo link(s) respond (2xx/3xx, no login wall).`);
})().catch((e) => {
  console.error(`demo-link guard ERROR: ${e.message}`);
  process.exit(1);
});
