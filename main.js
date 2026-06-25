/* ═══════════════════════════════════════════════════════
   main.js  —  Uprint Landing Page Interactions
   Depends on: lang_text.js (window.LANG)
═══════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ─────────────────────────────────────
       1. NAV — sticky scroll class
    ───────────────────────────────────── */
  const navbar = document.getElementById("navbar");
  window.addEventListener(
    "scroll",
    function () {
      navbar.classList.toggle("scrolled", window.scrollY > 28);
    },
    { passive: true }
  );

  /* ─────────────────────────────────────
       2. MOBILE DRAWER
    ───────────────────────────────────── */
  const ham = document.getElementById("nav-ham");
  const drawer = document.getElementById("nav-drawer");

  window.closeDrawer = function () {
    drawer.classList.remove("open");
    ham.classList.remove("open");
    ham.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  ham.addEventListener("click", function () {
    const isOpen = drawer.classList.toggle("open");
    ham.classList.toggle("open", isOpen);
    ham.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  /* ─────────────────────────────────────
       3. SMOOTH SCROLL for anchor links
    ───────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        var offset = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: offset, behavior: "smooth" });
        window.closeDrawer();
      }
    });
  });

  /* ─────────────────────────────────────
       4. REVEAL ON SCROLL
    ───────────────────────────────────── */
  var revealObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObs.observe(el);
  });

  /* ─────────────────────────────────────
       5. FAQ ACCORDION
    ───────────────────────────────────── */
  document.querySelectorAll(".faq-item-hd").forEach(function (hd) {
    function activate() {
      var item = hd.closest(".faq-item");
      var isOpen = item.classList.contains("open");
      /* close all */
      document.querySelectorAll(".faq-item").forEach(function (i) {
        i.classList.remove("open");
        i.querySelector(".faq-item-hd").setAttribute("aria-expanded", "false");
      });
      /* open clicked if it was closed */
      if (!isOpen) {
        item.classList.add("open");
        hd.setAttribute("aria-expanded", "true");
      }
    }
    hd.addEventListener("click", activate);
    hd.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });

  /* ─────────────────────────────────────
       6. LANGUAGE SWITCHER
       Uses data-lang="key" attributes on
       every text node in the HTML.
       Reads translations from window.LANG.
    ───────────────────────────────────── */
  var currentLang = "en";

  var btnEn = document.getElementById("btn-en");
  var btnBn = document.getElementById("btn-bn");

  function applyLang(lang) {
    if (!window.LANG || !window.LANG[lang]) {
      console.warn("LANG object missing for:", lang);
      return;
    }

    var dict = window.LANG[lang];

    /* Switch body font for Bangla */
    if (lang === "bn") {
      document.body.style.fontFamily =
        "'Noto Sans Bengali', 'Inter', sans-serif";
      document.documentElement.lang = "bn";
    } else {
      document.body.style.fontFamily = "'Inter', sans-serif";
      document.documentElement.lang = "en";
    }

    /* Update every [data-lang] element */
    document.querySelectorAll("[data-lang]").forEach(function (el) {
      var key = el.getAttribute("data-lang");
      if (dict[key] !== undefined) {
        /* Use innerHTML so <strong> tags in phone steps render */
        el.innerHTML = dict[key];
      }
    });

    /* Update button active state */
    btnEn.classList.toggle("active", lang === "en");
    btnBn.classList.toggle("active", lang === "bn");

    currentLang = lang;
  }

  btnEn.addEventListener("click", function () {
    applyLang("en");
  });
  btnBn.addEventListener("click", function () {
    applyLang("bn");
  });

  /* Initialise with English (default) */
  applyLang("en");
})();
