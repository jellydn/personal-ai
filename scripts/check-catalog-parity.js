#!/usr/bin/env node
// Catalog parity guard: the README's project headings and demo values must stay
// aligned with the canonical projects array in index.html. Wired into CI so
// catalog edits cannot silently leave the user-facing documentation stale.
//
// Usage: node scripts/check-catalog-parity.js [path-to-index.html] [path-to-README.md]
// Defaults to ./index.html and ./README.md. Exits non-zero on any mismatch.
"use strict";

const fs = require("fs");
const path = require("path");

const indexFile = path.resolve(process.argv[2] || "index.html");
const readmeFile = path.resolve(process.argv[3] || "README.md");
const indexHtml = fs.readFileSync(indexFile, "utf8");
const readme = fs.readFileSync(readmeFile, "utf8");

function relative(file) {
  return path.relative(process.cwd(), file);
}

function extractProjects(src) {
  const marker = "const projects =";
  const start = src.indexOf(marker);
  if (start === -1) {
    throw new Error(`${relative(indexFile)}: missing ${marker}`);
  }

  const open = src.indexOf("[", start);
  let depth = 0;
  let quote = null;
  let comment = null;
  let end = -1;

  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    const next = src[i + 1];
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
    throw new Error(`${relative(indexFile)}: unterminated projects array`);
  }

  // The catalog is a data-only literal, matching the existing category guard.
  // eslint-disable-next-line no-new-func
  return new Function(`return ${src.slice(open, end + 1)}`)();
}

function extractReadmeProjects() {
  const entries = [];
  const heading = /^### \[([^\]]+)\]\(https:\/\/github\.com\/([^\)]+)\)\n\n- \*\*Description\*\*: [^\n]+\n- \*\*Approach\*\*: [^\n]+\n- \*\*Demo\*\*: ([^\n]+)/gm;
  let match;
  while ((match = heading.exec(readme)) !== null) {
    entries.push({ name: match[1], repo: match[2], demo: match[3] === "Not ready yet." ? null : match[3] });
  }
  return entries;
}

function fail(message) {
  console.error(`catalog parity FAILED: ${message}`);
  process.exit(1);
}

const projects = extractProjects(indexHtml);
const readmeProjects = extractReadmeProjects();
if (projects.length !== readmeProjects.length) {
  fail(`index.html has ${projects.length} projects but README.md has ${readmeProjects.length}`);
}

const readmeByName = new Map(readmeProjects.map((project) => [project.name, project]));
const duplicateNames = readmeProjects.filter((project, index) => readmeProjects.findIndex((candidate) => candidate.name === project.name) !== index);
if (duplicateNames.length > 0) fail(`README contains duplicate project headings: ${duplicateNames.map((p) => p.name).join(", ")}`);

for (const project of projects) {
  const readmeProject = readmeByName.get(project.name);
  if (!readmeProject) fail(`${project.name} is missing from README.md`);
  if (readmeProject.repo !== project.repo) fail(`${project.name} repo differs: ${project.repo} vs ${readmeProject.repo}`);
  if (readmeProject.demo !== project.demo) {
    fail(`${project.name} demo differs: ${project.demo || "Not ready yet."} vs ${readmeProject.demo || "Not ready yet."}`);
  }
}

console.log(`catalog parity OK: ${projects.length} projects and demo values match.`);
