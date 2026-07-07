const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const themeToggle = document.querySelector("[data-theme-toggle]");
const scrollHero = document.querySelector("[data-scroll-hero]");
const scrollPanels = [...document.querySelectorAll("[data-scroll-panel]")];
const joinForm = document.querySelector("[data-join-form]");
const formFeedback = document.querySelector("[data-form-note]");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let scrollMotionQueued = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

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

function resetScrollMotion() {
  document.documentElement.style.removeProperty("--hero-bg-shift");
  document.documentElement.style.removeProperty("--hero-content-shift");
  scrollPanels.forEach((panel) => panel.style.setProperty("--scroll-shift", "0px"));
}

function updateScrollMotion() {
  if (reducedMotionQuery.matches) {
    resetScrollMotion();
    return;
  }

  const heroHeight = scrollHero?.offsetHeight || 1;
  const heroProgress = clamp(window.scrollY / heroHeight, 0, 1);

  document.documentElement.style.setProperty("--hero-bg-shift", `${Math.round(heroProgress * 34)}px`);
  document.documentElement.style.setProperty("--hero-content-shift", `${Math.round(heroProgress * 16)}px`);

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  scrollPanels.forEach((panel) => {
    const rect = panel.getBoundingClientRect();
    const panelCenter = rect.top + rect.height / 2;
    const distanceFromCenter = panelCenter / viewportHeight - 0.5;
    const shift = clamp(distanceFromCenter * -24, -18, 18);
    panel.style.setProperty("--scroll-shift", `${shift.toFixed(1)}px`);
  });
}

function requestScrollMotionUpdate() {
  if (scrollMotionQueued) return;
  scrollMotionQueued = true;

  requestAnimationFrame(() => {
    scrollMotionQueued = false;
    updateScrollMotion();
  });
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
window.addEventListener("scroll", requestScrollMotionUpdate, { passive: true });
window.addEventListener("resize", requestScrollMotionUpdate);

if (typeof reducedMotionQuery.addEventListener === "function") {
  reducedMotionQuery.addEventListener("change", requestScrollMotionUpdate);
} else {
  reducedMotionQuery.addListener(requestScrollMotionUpdate);
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "night" ? "day" : "night";
  saveTheme(nextTheme);
  setTheme(nextTheme);
});

const validationRules = {
  name: { required: "Please enter your name", minLength: [2, "Name must be at least 2 characters"] },
  email: { required: "Please enter your email", pattern: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"] },
  group: { required: "Please select an option" },
};

function validateField(field) {
  const rules = validationRules[field.name];
  if (!rules) return "";
  const value = field.value.trim();
  if (rules.required && !value) return rules.required;
  if (rules.minLength && value.length < rules.minLength[0]) return rules.minLength[1];
  if (rules.pattern && !rules.pattern[0].test(value)) return rules.pattern[1];
  return "";
}

function showFieldState(field, error) {
  const formField = field.closest(".form-field");
  if (!formField) return;
  const errorEl = formField.querySelector(".field-error");
  formField.classList.toggle("invalid", !!error);
  formField.classList.toggle("valid", !error && field.value.trim().length > 0);
  if (errorEl) {
    errorEl.textContent = error;
    errorEl.classList.toggle("visible", !!error);
  }
}

function showFeedback(type, message) {
  formFeedback.textContent = message;
  formFeedback.className = "form-feedback visible " + type;
}

function clearFeedback() {
  formFeedback.textContent = "";
  formFeedback.className = "form-feedback";
}

joinForm.querySelectorAll("input, select, textarea").forEach((field) => {
  if (!validationRules[field.name]) return;
  field.addEventListener("blur", () => {
    if (field.dataset.touched !== "true") field.dataset.touched = "true";
    showFieldState(field, validateField(field));
  });
  field.addEventListener("input", () => {
    if (field.dataset.touched === "true") showFieldState(field, validateField(field));
  });
});

const selectGroup = joinForm.querySelector("select[name='group']");
if (selectGroup) {
  selectGroup.addEventListener("change", () => {
    selectGroup.closest(".input-wrap").classList.toggle("has-value", !!selectGroup.value);
    if (selectGroup.dataset.touched === "true") showFieldState(selectGroup, validateField(selectGroup));
  });
}

joinForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitBtn = joinForm.querySelector(".submit-btn");
  const fields = joinForm.querySelectorAll("input:not([type='hidden']):not([name='_gotcha']), select, textarea");
  let firstInvalid = null;

  fields.forEach((field) => {
    field.dataset.touched = "true";
    const error = validateField(field);
    showFieldState(field, error);
    if (error && !firstInvalid) firstInvalid = field;
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  const formData = new FormData(joinForm);
  const firstName = String(formData.get("name")).trim().split(" ")[0] || "there";
  const action = joinForm.getAttribute("action");

  submitBtn.disabled = true;
  submitBtn.classList.add("loading");
  clearFeedback();

  try {
    const response = await fetch(action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      showFeedback("success", `Thanks, ${firstName}! We'll be in touch shortly.`);
      joinForm.reset();
      joinForm.querySelectorAll(".form-field").forEach((f) => {
        f.classList.remove("valid", "invalid");
        const err = f.querySelector(".field-error");
        if (err) { err.textContent = ""; err.classList.remove("visible"); }
      });
      joinForm.querySelectorAll(".input-wrap").forEach((w) => w.classList.remove("has-value"));
    } else {
      const data = await response.json().catch(() => null);
      const msg = data?.errors?.map((e) => e.message).join(", ") || "Something went wrong. Please try again or email us directly.";
      showFeedback("error", msg);
    }
  } catch {
    showFeedback("error", "Network error — please check your connection and try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
  }
});

setTheme(getSavedTheme() === "night" ? "night" : "day");
setHeaderState();
updateScrollMotion();
observeSections();
observeReveals();
