const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const themeToggle = document.querySelector("[data-theme-toggle]");
const joinForm = document.querySelector("[data-join-form]");
const formNote = document.querySelector("[data-form-note]");

function getSavedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // The visual toggle still works if browser storage is unavailable.
  }
}

function setTheme(theme) {
  const isNight = theme === "night";
  document.body.dataset.theme = isNight ? "night" : "day";
  themeToggle.setAttribute("aria-pressed", String(isNight));
  themeToggle.setAttribute("aria-label", isNight ? "Disable night mode" : "Enable night mode");
}

function setHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 16);
}

function toggleMenu(forceOpen) {
  const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !nav.classList.contains("open");
  nav.classList.toggle("open", shouldOpen);
  header.classList.toggle("menu-active", shouldOpen);
  document.body.classList.toggle("menu-open", shouldOpen);
  menuButton.setAttribute("aria-expanded", String(shouldOpen));
  menuButton.setAttribute("aria-label", shouldOpen ? "Close menu" : "Open menu");
}

function observeSections() {
  const sections = [...document.querySelectorAll("main section[id]")];
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function observeReveals() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));
}

menuButton.addEventListener("click", () => toggleMenu());
navLinks.forEach((link) => link.addEventListener("click", () => toggleMenu(false)));
window.addEventListener("scroll", setHeaderState, { passive: true });

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "night" ? "day" : "night";
  saveTheme(nextTheme);
  setTheme(nextTheme);
});

joinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(joinForm);
  const firstName = String(formData.get("name")).trim().split(" ")[0] || "there";
  formNote.textContent = `Thanks, ${firstName}. We will follow up shortly.`;
  joinForm.reset();
});

setTheme(getSavedTheme() === "night" ? "night" : "day");
setHeaderState();
observeSections();
observeReveals();
