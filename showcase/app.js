// Dark mode (light / dark / system) — writes storage only on explicit choice
(function () {
  const root = document.documentElement;
  const btns = document.querySelectorAll("[data-theme-btn]");
  function resolve() {
    const t = localStorage.getItem("showcase-theme") || "light";
    return t === "system"
      ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : t;
  }
  function apply(theme) {
    root.setAttribute("data-theme", theme);
    btns.forEach(b => b.classList.toggle("active", b.dataset.themeBtn === theme));
  }
  apply(resolve());
  btns.forEach(b => b.addEventListener("click", () => {
    localStorage.setItem("showcase-theme", b.dataset.themeBtn);
    apply(resolve());
  }));
})();

// Mobile nav
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", open);
  });
}

// Gallery lightbox (index.html only — guarded: pages without the markup no-op)
(function () {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCap = document.getElementById("lightbox-caption");
  const closeBtn = document.getElementById("lightbox-close");
  if (!lb || !lbImg) return;

  let lastTrigger = null;
  function open(src, caption, trigger) {
    lbImg.src = src;
    lbImg.alt = caption || "Enlarged screenshot";
    lbCap.textContent = caption || "";
    lb.hidden = false;
    lastTrigger = trigger;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }
  function close() {
    lb.hidden = true;
    lbImg.src = "";
    lbImg.alt = "";
    document.body.style.overflow = "";
    if (lastTrigger) lastTrigger.focus();
    lastTrigger = null;
  }

  document.querySelectorAll("[data-lightbox]").forEach(item => {
    item.addEventListener("click", e => {
      if (e.target.closest("a")) return;
      open(item.dataset.lightbox, item.dataset.caption, item);
    });
  });
  closeBtn.addEventListener("click", close);
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !lb.hidden) close(); });
})();
