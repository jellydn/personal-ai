// Dark mode (light / dark / system) — writes storage only on explicit choice
(function () {
  const root = document.documentElement;
  const btns = document.querySelectorAll("[data-theme-btn]");
  const metaScheme = document.querySelector('meta[name="color-scheme"]');
  const mq = matchMedia("(prefers-color-scheme: dark)");
  function stored() { return localStorage.getItem("showcase-theme") || "light"; }
  function resolve() {
    const t = stored();
    return t === "system" ? (mq.matches ? "dark" : "light") : t;
  }
  function syncMeta() {
    // Reflect the chosen theme so the browser themes native UI (scrollbars, canvas)
    if (metaScheme) metaScheme.content = stored() === "system" ? "light dark" : stored();
  }
  function apply(theme) {
    root.setAttribute("data-theme", theme);
    btns.forEach(b => b.classList.toggle("active", b.dataset.themeBtn === theme));
    syncMeta();
  }
  apply(resolve());
  btns.forEach(b => b.addEventListener("click", () => {
    localStorage.setItem("showcase-theme", b.dataset.themeBtn);
    apply(resolve());
  }));
  // In "system" mode, follow live OS theme changes (prefers-color-scheme change event)
  mq.addEventListener("change", () => { if (stored() === "system") apply(resolve()); });
})();

// Mobile nav
(function () {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  if (!hamburger || !navLinks) return;
  hamburger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", open);
  });
})();

// Gallery lightbox (index.html only — native <dialog>; pages without the markup no-op)
(function () {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCap = document.getElementById("lightbox-caption");
  const closeBtn = document.getElementById("lightbox-close");
  if (!lb || !lbImg) return;

  let lastTrigger = null;
  // Cleanup must live on the dialog's "close" event: Esc, the close button, and
  // programmatic .close() all fire it, so every close path resets state.
  lb.addEventListener("close", () => {
    lbImg.src = "";
    lbImg.alt = "";
    document.body.style.overflow = "";
    if (lastTrigger) lastTrigger.focus();
    lastTrigger = null;
  });
  function open(src, caption, trigger) {
    lbImg.src = src;
    lbImg.alt = caption || "Enlarged screenshot";
    lbCap.textContent = caption || "";
    lastTrigger = trigger;
    document.body.style.overflow = "hidden";
    // Native <dialog> traps focus, dims via ::backdrop, and Esc-closes for free
    lb.showModal();
    closeBtn.focus();
  }

  document.querySelectorAll("[data-lightbox]").forEach(item => {
    item.addEventListener("click", e => {
      if (e.target.closest("a")) return;
      open(item.dataset.lightbox, item.dataset.caption, item);
    });
  });
  closeBtn.addEventListener("click", () => lb.close());
  // Light-dismiss on backdrop click (closedby="any" is not Baseline Widely available yet)
  lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
})();
