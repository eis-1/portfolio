(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');

  const STORAGE_KEY = "ei_portfolio_theme";

  function updateToggleUi(theme) {
    if (!toggle) return;
    const isLight = theme === "light";
    toggle.textContent = isLight ? "Light" : "Dark";
    toggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    toggle.setAttribute("aria-pressed", String(!isLight));
  }

  function updateThemeColor(theme) {
    if (!themeColor) return;
    themeColor.setAttribute("content", theme === "light" ? "#f7f7fb" : "#0b1020");
  }

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
      updateToggleUi("light");
      updateThemeColor("light");
      return;
    }
    root.removeAttribute("data-theme");
    updateToggleUi("dark");
    updateThemeColor("dark");
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") {
    applyTheme(saved);
  } else {
    applyTheme("dark");
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
    });
  }

  // Micro animation: reveal sections on scroll.
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    const sections = document.querySelectorAll(".section");

    sections.forEach((s) => s.classList.add("reveal"));

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { root: null, threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    sections.forEach((s) => io.observe(s));
  } else {
    document.querySelectorAll(".section").forEach((s) => s.classList.add("is-visible"));
  }
})();
