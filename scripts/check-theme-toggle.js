#!/usr/bin/env node
// Theme-toggle smoke test: drives the theme IIFE from showcase/app.js with a
// mocked DOM, localStorage, and matchMedia, asserting the three behaviors that
// regressed before — system resolution, session switching when storage is
// blocked, and active-button state. Wired into CI so future theme changes
// can't silently break the toggle.
//
// Usage: node scripts/check-theme-toggle.js [path-to-app.js]
// Defaults to ./showcase/app.js. Exits non-zero with a message on any failure.
"use strict";

const fs = require("fs");
const path = require("path");
const { extractIIFE } = require("./lib/extract-iife");

const file = path.resolve(process.argv[2] || "showcase/app.js");
const src = fs.readFileSync(file, "utf8");

// ---- Minimal mock DOM -----------------------------------------------------
function makeButtons() {
  return ["light", "dark", "system"].map((mode) => ({
    dataset: { themeBtn: mode },
    classList: {
      active: false,
      toggle(cls, force) {
        if (cls === "active") this.active = Boolean(force);
      },
    },
    listeners: {},
    addEventListener(type, fn) {
      this.listeners[type] = fn;
    },
    click() {
      (this.listeners.click || function () {}).call(this);
    },
  }));
}

// Create an isolated environment and run the theme IIFE inside it. Returns
// handles for asserting afterwards.
function runThemeIIFE({ stored, storageThrows, systemDark }) {
  const root = {
    attrs: {},
    setAttribute(name, value) {
      this.attrs[name] = value;
    },
  };
  const meta = { content: "" };
  const buttons = makeButtons();
  let storage = stored;
  let mqDark = Boolean(systemDark);
  const mqListeners = [];

  const document = {
    documentElement: root,
    querySelectorAll(sel) {
      return sel === "[data-theme-btn]" ? buttons : [];
    },
    querySelector(sel) {
      return sel === 'meta[name="color-scheme"]' ? meta : null;
    },
  };
  const localStorage = {
    getItem() {
      if (storageThrows) throw new Error("storage blocked (get)");
      return storage === null || storage === undefined ? null : storage;
    },
    setItem(_k, v) {
      if (storageThrows) throw new Error("storage blocked (set)");
      storage = v;
    },
  };
  const matchMedia = (q) => ({
    // Live getter: the IIFE captures this object, so setSystemDark() must be
    // observable through it — a snapshot would keep the stale OS state.
    get matches() {
      return mqDark;
    },
    addEventListener(_type, fn) {
      mqListeners.push(fn);
    },
  });

  // The IIFE is already a complete statement ending in `();` — it is the
  // function body, so the mock globals resolve to the declared parameters.
  // eslint-disable-next-line no-new-func
  const factory = new Function("document", "localStorage", "matchMedia", extractIIFE(src, "// Dark mode (light / dark / system)", "theme", file));
  factory(document, localStorage, matchMedia);

  return {
    root,
    meta,
    buttons,
    get storage() {
      return storage;
    },
    setSystemDark(v) {
      mqDark = v;
      mqListeners.forEach((fn) => fn());
    },
  };
}

let checks = 0;
function assert(cond, label) {
  checks++;
  if (!cond) {
    console.error(`  ✗ ${label}`);
    process.exitCode = 1;
  } else {
    console.log(`  ✓ ${label}`);
  }
}

console.log(`theme guard: driving theme IIFE from ${path.relative(process.cwd(), file)}`);

// 1. Default (no stored preference) → light, light button active, meta synced.
{
  const env = runThemeIIFE({ stored: null });
  assert(env.root.attrs["data-theme"] === "light", "no preference resolves to light");
  assert(env.meta.content === "light", "meta color-scheme syncs to light");
  assert(env.buttons.find((b) => b.dataset.themeBtn === "light").classList.active, "light button active by default");
}

// 2. Stored dark → dark, dark button active.
{
  const env = runThemeIIFE({ stored: "dark" });
  assert(env.root.attrs["data-theme"] === "dark", "stored dark resolves to dark");
  assert(env.meta.content === "dark", "meta color-scheme syncs to dark");
  assert(env.buttons.find((b) => b.dataset.themeBtn === "dark").classList.active, "dark button active when stored dark");
}

// 3. System + dark OS → resolved dark theme, but the SYSTEM button stays lit.
{
  const env = runThemeIIFE({ stored: "system", systemDark: true });
  assert(env.root.attrs["data-theme"] === "dark", "system + dark OS resolves to dark");
  assert(env.meta.content === "light dark", "system mode meta stays 'light dark'");
  assert(env.buttons.find((b) => b.dataset.themeBtn === "system").classList.active, "system button lit in system mode (not the resolved theme)");
  assert(!env.buttons.find((b) => b.dataset.themeBtn === "dark").classList.active, "dark button NOT lit in system mode");
}

// 4. System + light OS → resolved light, system button still lit.
{
  const env = runThemeIIFE({ stored: "system", systemDark: false });
  assert(env.root.attrs["data-theme"] === "light", "system + light OS resolves to light");
  assert(env.buttons.find((b) => b.dataset.themeBtn === "system").classList.active, "system button lit with light OS too");
}

// 5. Click dark → persists AND applies for the session; active button follows.
{
  const env = runThemeIIFE({ stored: null });
  env.buttons.find((b) => b.dataset.themeBtn === "dark").click();
  assert(env.root.attrs["data-theme"] === "dark", "clicking dark switches theme");
  assert(env.storage === "dark", "clicking dark persists 'dark' to storage");
  assert(env.buttons.find((b) => b.dataset.themeBtn === "dark").classList.active, "dark button active after click");
}

// 6. Storage blocked (private mode): click must STILL switch the session theme,
//    even though persist() silently fails — this was the historical regression.
{
  const env = runThemeIIFE({ stored: "light", storageThrows: true });
  assert(env.root.attrs["data-theme"] === "light", "blocked storage falls back to light on load");
  env.buttons.find((b) => b.dataset.themeBtn === "dark").click();
  assert(env.root.attrs["data-theme"] === "dark", "blocked storage: click still switches theme this session");
  assert(env.buttons.find((b) => b.dataset.themeBtn === "dark").classList.active, "blocked storage: dark button active after click");
}

// 7. Live OS change while in system mode → re-resolves; not in other modes.
{
  const envSystem = runThemeIIFE({ stored: "system", systemDark: false });
  envSystem.setSystemDark(true);
  assert(envSystem.root.attrs["data-theme"] === "dark", "system mode follows live OS change to dark");

  // Flip OS to the OPPOSITE of a non-system stored value: a buggy change
  // listener (no stored() === "system" guard) would apply the resolved theme
  // and flip data-theme to dark — this assertion catches that regression.
  const envLight = runThemeIIFE({ stored: "light", systemDark: false });
  envLight.setSystemDark(true);
  assert(envLight.root.attrs["data-theme"] === "light", "non-system stored theme is unaffected by OS change");
}

if (process.exitCode) {
  console.error(`theme guard FAILED (${checks} checks, at least one failed).`);
  process.exit(1);
}
console.log(`theme guard OK: ${checks} assertions passed.`);
