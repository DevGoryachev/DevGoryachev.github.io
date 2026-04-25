const translations = {
  en: {
    "nav.about": "About",
    "nav.work": "Experience",
    "nav.case": "Case",
    "nav.contact": "Contact",
    "hero.eyebrow": "Middle 1C Developer · 3+ years of experience",
    "hero.lead":
      "I'm Nikita Goryachev. I customize 1C, design data exchanges, build reports, integrations and developer tools that make 1C work faster and clearer.",
    "hero.telegram": "Message on Telegram",
    "hero.github": "GitHub",
    "hero.status": "Open to talk",
    "stats.exp": "3+ years",
    "stats.level": "Middle",
    "stats.company": "SOKOLOV",
    "about.kicker": "About me",
    "about.title": "I calmly untangle complex 1C tasks",
    "about.text1":
      "I work with standard and custom 1C configurations: feature development, database-to-database exchanges, reports, extensions and integrations.",
    "about.text2":
      "I currently work at SOKOLOV. Before that I worked in a startup where the team built a configuration from scratch, so I understand both mature systems and new product mechanics.",
    "services.title": "What I build",
    "services.item1": "1C customizations",
    "services.item2": "database integrations",
    "services.item3": "reports",
    "services.item4": "data exchanges",
    "services.item5": "extensions",
    "services.item6": "optimization",
    "services.item7": "MCP servers and 1C rules",
    "work.kicker": "Experience",
    "work.title": "Experience and tools",
    "work.card1.title": "SOKOLOV",
    "work.card1.text":
      "1C development and support in a production environment: custom features, consulting, reports and business process support.",
    "work.card2.title": "Startup configuration",
    "work.card2.text":
      "Took part in creating a configuration from scratch: mechanism design, application development and bringing solutions to production-ready state.",
    "work.card3.title": "Modern toolchain",
    "work.card3.text":
      "I use EDT, Codex, Cursor, MCP servers, custom skills and rules to speed up analysis, development and 1C code maintenance.",
    "case.label": "Selected case",
    "case.title": "Address parsing with a local language model",
    "case.text":
      "Designed and implemented a custom address parsing and normalization mechanism using Ollama and Gemma-3 instead of the standard BSP approach.",
    "process.title": "How I work",
    "process.step1.title": "Understand",
    "process.step1.text": "I clarify the goal, limits, roles, data and risk points.",
    "process.step2.title": "Design",
    "process.step2.text": "I choose the lowest-risk solution without unnecessary complexity.",
    "process.step3.title": "Build",
    "process.step3.text": "I keep client-server boundaries, permissions and performance in mind.",
    "process.step4.title": "Verify",
    "process.step4.text": "I document checks, risks and what must stay intact during rollout.",
    "contact.kicker": "Contact",
    "contact.title": "Let's discuss a task, experience or project",
    "contact.text": "Message me on Telegram or check my code and experiments on GitHub.",
    "contact.telegram": "Telegram",
    "contact.github": "GitHub",
    "footer.text": "1C Developer · personal website",
  },
};

const languageButtons = document.querySelectorAll(".lang-button");
const themeSwitch = document.querySelector(".theme-switch");
const translatableNodes = document.querySelectorAll("[data-i18n]");
const revealNodes = document.querySelectorAll(
  ".section:not(.hero), .card, .chip, .process-step, .case-stack span, .stats span",
);
let themeTransitionTimer;
let languageTransitionTimer;
const languageMagicSwapDelay = 140;
const languageMagicDuration = 320;

function getDefaultTranslations() {
  return Array.from(translatableNodes).reduce((dictionary, node) => {
    dictionary[node.dataset.i18n] = node.textContent.trim().replace(/\s+/g, " ");
    return dictionary;
  }, {});
}

translations.ru = getDefaultTranslations();

function setTheme(theme, options = {}) {
  const isDark = theme === "dark";
  const shouldAnimate = options.animate === true;

  if (shouldAnimate) {
    clearTimeout(themeTransitionTimer);
    document.documentElement.classList.add("theme-changing");
    themeTransitionTimer = setTimeout(() => {
      document.documentElement.classList.remove("theme-changing");
    }, 420);
  }

  document.documentElement.dataset.theme = theme;
  localStorage.setItem("site-theme", theme);

  if (themeSwitch) {
    themeSwitch.setAttribute("aria-pressed", String(isDark));
    themeSwitch.setAttribute("aria-label", isDark ? "Включить светлую тему" : "Включить темную тему");
  }
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem("site-theme");

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyLanguage(language) {
  const dictionary = translations[language];

  document.documentElement.dataset.activeLanguage = language;

  translatableNodes.forEach((node) => {
    const key = node.dataset.i18n;

    if (dictionary[key]) {
      node.textContent = dictionary[key];
    }
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === language;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.documentElement.lang = language;
  localStorage.setItem("site-language", language);
}

function setLanguage(language, options = {}) {
  const currentLanguage = document.documentElement.lang || "ru";
  const shouldAnimate =
    options.animate === true &&
    language !== currentLanguage &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!shouldAnimate) {
    applyLanguage(language);
    return;
  }

  clearTimeout(languageTransitionTimer);
  document.documentElement.classList.remove("language-magic");
  document.documentElement.dataset.activeLanguage = language;
  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === language;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  localStorage.setItem("site-language", language);

  requestAnimationFrame(() => {
    document.documentElement.classList.add("language-magic");

    languageTransitionTimer = setTimeout(() => {
      applyLanguage(language);

      languageTransitionTimer = setTimeout(() => {
        document.documentElement.classList.remove("language-magic");
      }, languageMagicDuration - languageMagicSwapDelay);
    }, languageMagicSwapDelay);
  });
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang, { animate: true }));
});

setLanguage(localStorage.getItem("site-language") || "ru", { animate: false });
setTheme(getInitialTheme(), { animate: false });

if (themeSwitch) {
  themeSwitch.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme || getInitialTheme();
    setTheme(currentTheme === "dark" ? "light" : "dark", { animate: true });
  });
}

function initRevealAnimations() {
  const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (shouldReduceMotion || !("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("in-view"));
    return;
  }

  revealNodes.forEach((node, index) => {
    node.classList.add("reveal");
    node.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealNodes.forEach((node) => observer.observe(node));
}

initRevealAnimations();
