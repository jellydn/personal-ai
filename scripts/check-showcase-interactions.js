#!/usr/bin/env node
// Showcase-interactions smoke test: drives the mobile-nav and gallery-lightbox
// IIFEs from showcase/app.js with a mocked DOM, asserting the behaviors that
// could silently regress — the no-op guards on pages without the markup, the
// hamburger toggle + aria-expanded pairing, and the lightbox open/close paths
// (caption fallback, anchor-passthrough, focus return, body-scroll lock).
// Wired into CI alongside the theme guard so future JS changes can't silently
// break the interactions.
//
// Usage: node scripts/check-showcase-interactions.js [path-to-app.js]
// Defaults to ./showcase/app.js. Exits non-zero with a message on any failure.
"use strict";

const fs = require("fs");
const path = require("path");
const { extractIIFE } = require("./lib/extract-iife");

const file = path.resolve(process.argv[2] || "showcase/app.js");
const src = fs.readFileSync(file, "utf8");

// ---- Minimal mock DOM -----------------------------------------------------

function makeClassList() {
  return {
    open: false,
    toggle(cls) {
      if (cls === "open") this.open = !this.open;
      return this.open;
    },
  };
}

function makeEl() {
  return {
    attrs: {},
    classList: makeClassList(),
    listeners: {},
    setAttribute(name, value) {
      // Mirror real DOM: setAttribute stringifies (getAttribute returns
      // "true"/"false", never booleans).
      this.attrs[name] = String(value);
    },
    addEventListener(type, fn) {
      (this.listeners[type] = this.listeners[type] || []).push(fn);
    },
    fire(type, evt) {
      (this.listeners[type] || []).forEach((fn) => fn(evt || {}));
    },
  };
}

// Create an isolated environment and run a single IIFE inside it.
function runIIFE(iifeText, document) {
  // The IIFE is already a complete statement ending in `();` — it is the
  // function body, so the mock globals resolve to the declared parameters.
  // eslint-disable-next-line no-new-func
  const factory = new Function("document", iifeText);
  factory(document);
}

// ---- Mobile nav -----------------------------------------------------------

function runMobileNav({ hamburgerPresent, navLinksPresent }) {
  const hamburger = hamburgerPresent ? makeEl() : null;
  const navLinks = navLinksPresent ? makeEl() : null;
  const document = {
    getElementById(id) {
      if (id === "hamburger") return hamburger;
      if (id === "nav-links") return navLinks;
      return null;
    },
  };
  runIIFE(extractIIFE(src, "// Mobile nav", "mobile nav", file), document);
  return { hamburger, navLinks };
}

// ---- Gallery lightbox -----------------------------------------------------

// Native <dialog> mock: close() fires the "close" listeners like the real one.
function makeDialog() {
  const el = makeEl();
  el.modalOpen = false;
  el.focused = false;
  el.focus = () => {
    el.focused = true;
  };
  el.showModal = () => {
    el.modalOpen = true;
  };
  el.close = () => {
    el.modalOpen = false;
    el.fire("close");
  };
  return el;
}

function makeTrigger(dataset, { anchorWrapped = false } = {}) {
  const el = makeEl();
  el.dataset = dataset;
  el.focused = false;
  el.focus = () => {
    el.focused = true;
  };
  // The IIFE reads e.target.closest("a"), so the closest method must live on
  // the trigger (the click target), not on the synthetic event.
  el.closest = () => (anchorWrapped ? { tagName: "A" } : null);
  return el;
}

function runLightbox({ lbPresent, lbImgPresent, lbCapPresent, closeBtnPresent, triggers }) {
  const lb = lbPresent ? makeDialog() : null;
  const lbImg = lbImgPresent ? makeEl() : null;
  const lbCap = lbCapPresent ? makeEl() : null;
  const closeBtn = closeBtnPresent ? makeDialog() : null;
  const body = { style: {} };
  // Mirror real DOM defaults so "not opened" state is observable: an <img>
  // has src="" (not undefined), a text node starts empty.
  if (lbImg) {
    lbImg.src = "";
    lbImg.alt = "";
  }
  if (lbCap) lbCap.textContent = "";
  const document = {
    getElementById(id) {
      if (id === "lightbox") return lb;
      if (id === "lightbox-img") return lbImg;
      if (id === "lightbox-caption") return lbCap;
      if (id === "lightbox-close") return closeBtn;
      return null;
    },
    querySelectorAll(sel) {
      return sel === "[data-lightbox]" ? triggers : [];
    },
    body,
  };
  runIIFE(extractIIFE(src, "// Gallery lightbox", "gallery lightbox", file), document);
  return { lb, lbImg, lbCap, closeBtn, body };
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

console.log(`interactions guard: driving mobile-nav + lightbox IIFEs from ${path.relative(process.cwd(), file)}`);

// 1. Mobile nav: both elements present → hamburger toggles the menu and keeps
//    aria-expanded in lockstep.
{
  const env = runMobileNav({ hamburgerPresent: true, navLinksPresent: true });
  assert(!env.navLinks.classList.open, "nav menu closed by default");
  assert(env.hamburger.attrs["aria-expanded"] === undefined || env.hamburger.attrs["aria-expanded"] === "false", "aria-expanded starts false");

  env.hamburger.fire("click");
  assert(env.navLinks.classList.open, "click opens nav menu");
  assert(env.hamburger.attrs["aria-expanded"] === "true", "aria-expanded true after open");

  env.hamburger.fire("click");
  assert(!env.navLinks.classList.open, "second click closes nav menu");
  assert(env.hamburger.attrs["aria-expanded"] === "false", "aria-expanded false after close");
}

// 2. Mobile nav: page without the markup (no hamburger / no nav-links) no-ops.
{
  const env = runMobileNav({ hamburgerPresent: false, navLinksPresent: true });
  assert(env.hamburger === null && env.navLinks !== null, "missing hamburger: IIFE still runs");
  assert(env.navLinks.classList.open === false, "missing hamburger: no state mutated");
}
{
  const env = runMobileNav({ hamburgerPresent: true, navLinksPresent: false });
  assert(env.hamburger !== null && env.navLinks === null, "missing nav-links: IIFE still runs");
  assert(!env.hamburger.listeners.click || env.hamburger.listeners.click.length === 0, "missing nav-links: no click listener attached");
}

// 3. Lightbox: page without the gallery markup no-ops (index.html only).
{
  const env = runLightbox({
    lbPresent: false, lbImgPresent: false, lbCapPresent: false, closeBtnPresent: false, triggers: [],
  });
  assert(env.lb === null && env.lbImg === null, "no lightbox markup: IIFE still runs");
}
{
  const env = runLightbox({
    lbPresent: true, lbImgPresent: false, lbCapPresent: false, closeBtnPresent: false, triggers: [],
  });
  assert(env.lb !== null && env.lbImg === null, "lightbox without img element: IIFE still runs");
}

// 4. Lightbox: clicking a data-lightbox item opens it — sets src, caption
//    (fallback alt), scroll lock, focus, and shows the modal.
{
  const t1 = makeTrigger({ lightbox: "shot-one.png", caption: "Console shot" });
  const t2 = makeTrigger({ lightbox: "shot-two.png" }); // no caption
  const env = runLightbox({
    lbPresent: true, lbImgPresent: true, lbCapPresent: true, closeBtnPresent: true,
    triggers: [t1, t2],
  });

  t1.fire("click", { target: t1 });
  assert(env.lbImg.src === "shot-one.png", "open sets img src");
  assert(env.lbImg.alt === "Console shot", "open sets img alt from caption");
  assert(env.lbCap.textContent === "Console shot", "open sets caption text");
  assert(env.body.style.overflow === "hidden", "open locks body scroll");
  assert(env.lb.modalOpen, "open shows the dialog");
  assert(env.closeBtn.focused, "open moves focus to the close button");
  assert(t1.focused === false, "trigger not focused while lightbox is open");

  // Caption fallback: no data-caption → default alt, empty caption.
  t2.fire("click", { target: t2 });
  assert(env.lbImg.src === "shot-two.png", "second open updates img src");
  assert(env.lbImg.alt === "Enlarged screenshot", "caption-less item falls back to default alt");
  assert(env.lbCap.textContent === "", "caption-less item shows empty caption");
}

// 5. Lightbox: clicks on inner anchors inside a tile are ignored (the tile is
//    wrapped in a link in the gallery grid).
{
  const t = makeTrigger({ lightbox: "shot-three.png", caption: "Link-wrapped" }, { anchorWrapped: true });
  const env = runLightbox({
    lbPresent: true, lbImgPresent: true, lbCapPresent: true, closeBtnPresent: true,
    triggers: [t],
  });
  t.fire("click", { target: t });
  assert(env.lbImg.src === "", "anchor click inside tile does not open the lightbox");
  assert(!env.lb.modalOpen, "anchor click leaves dialog closed");
}

// 6. Lightbox: close button and Esc (both fire the dialog "close" event)
//    reset state — clears img src/alt, unlocks scroll, returns focus. (The
//    caption text is left in place; the next open() always overwrites it.)
{
  const t = makeTrigger({ lightbox: "shot-four.png", caption: "Focus return" });
  const env = runLightbox({
    lbPresent: true, lbImgPresent: true, lbCapPresent: true, closeBtnPresent: true,
    triggers: [t],
  });
  t.fire("click", { target: t });
  assert(env.lb.modalOpen, "opened for close test");

  env.closeBtn.fire("click");
  assert(!env.lb.modalOpen, "close button closes the dialog");
  assert(env.lbImg.src === "", "close clears img src");
  assert(env.lbImg.alt === "", "close clears img alt");
  assert(env.body.style.overflow === "", "close unlocks body scroll");
  assert(t.focused, "close returns focus to the triggering tile");
}

// Esc path: the native dialog fires "close" — the same handler resets state.
{
  const t = makeTrigger({ lightbox: "shot-five.png", caption: "Esc close" });
  const env = runLightbox({
    lbPresent: true, lbImgPresent: true, lbCapPresent: true, closeBtnPresent: true,
    triggers: [t],
  });
  t.fire("click", { target: t });
  env.lb.fire("close");
  assert(env.lbImg.src === "", "Esc (close event) clears img src");
  assert(env.body.style.overflow === "", "Esc (close event) unlocks scroll");
}

// 7. Lightbox: backdrop click closes; clicks inside the dialog do not.
{
  const t = makeTrigger({ lightbox: "shot-six.png", caption: "Backdrop" });
  const env = runLightbox({
    lbPresent: true, lbImgPresent: true, lbCapPresent: true, closeBtnPresent: true,
    triggers: [t],
  });
  t.fire("click", { target: t });
  env.lb.fire("click", { target: env.lb }); // e.target === lb → backdrop
  assert(!env.lb.modalOpen, "backdrop click closes the dialog");

  // Re-open, then click an element inside the dialog (target !== lb).
  t.fire("click", { target: t });
  env.lb.fire("click", { target: { tagName: "IMG" } });
  assert(env.lb.modalOpen, "click inside the dialog does not close it");
}

if (process.exitCode) {
  console.error(`interactions guard FAILED (${checks} checks, at least one failed).`);
  process.exit(1);
}
console.log(`interactions guard OK: ${checks} assertions passed.`);
