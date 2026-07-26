/* ── Nav hamburger ── */
const ham = document.getElementById("nav-ham");
const drawer = document.getElementById("nav-drawer");
ham.addEventListener("click", () => {
  const open = drawer.classList.toggle("open");
  ham.classList.toggle("open", open);
  ham.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
});

function closeDrawer() {
  drawer.classList.remove("open");
  ham.classList.remove("open");
  ham.setAttribute("aria-expanded", false);
  document.body.style.overflow = "";
}
window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeDrawer();
});

/* ── Hero video autoplay ───────────────────────────────────────── */
const heroVideo = document.getElementById("hero-video");
if (heroVideo) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          heroVideo.play().catch(() => {});
        } else {
          heroVideo.pause();
        }
      });
    },
    { threshold: 0.4 }
  );

  videoObserver.observe(heroVideo);
}

/* ── Scroll reveal ───────────────────────────────────────── */
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("on");
        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.08 }
);
document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

/* ── Hero progress bar animate ───────────────────────────────────────── */
setTimeout(() => {
  const bar = document.getElementById("hero-prog");
  if (bar) bar.style.width = "33%";
}, 700);

/* ── Smooth scroll for anchor links (offset for sticky nav) ── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = 56;
      const top =
        target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

/* ── Fix FAQ link in mobile drawer ───────────────────────────────────────── */
document
  .querySelectorAll('.nav-drawer-links a[href="#faq"]')
  .forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

/* ── FAQ accordion toggle ───────────────────────────────────────── */
document.querySelectorAll(".faq-item-hd").forEach((hd) => {
  hd.addEventListener("click", () => {
    const item = hd.closest(".faq-item");
    const wasOpen = item.classList.contains("open");
    // close all
    document.querySelectorAll(".faq-item.open").forEach((i) => {
      i.classList.remove("open");
      i.querySelector(".faq-item-hd").setAttribute("aria-expanded", "false");
    });
    // toggle clicked
    if (!wasOpen) {
      item.classList.add("open");
      hd.setAttribute("aria-expanded", "true");
    }
  });
  // keyboard support
  hd.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      hd.click();
    }
  });
});

/* ── Language Toggle ───────────────────────────────────────── */
let currentLang = "en";

// Map of data-i18n key → { selector, property }
// property: "text" = textContent, "html" = innerHTML
const I18N_MAP = [
  /* Nav desktop */
  { key: "nav_how", sel: ".nav-links li:nth-child(1) a", prop: "text" },
  { key: "nav_results", sel: ".nav-links li:nth-child(2) a", prop: "text" },
  { key: "nav_demo", sel: ".nav-links li:nth-child(3) a", prop: "text" },
  { key: "nav_faq", sel: ".nav-links li:nth-child(4) a", prop: "text" },
  { key: "nav_contact", sel: ".nav-links li:nth-child(5) a", prop: "text" },

  /* Nav drawer */
  { key: "nav_how", sel: ".nav-drawer-links li:nth-child(1) a", prop: "text" },
  {
    key: "nav_results",
    sel: ".nav-drawer-links li:nth-child(2) a",
    prop: "text",
  },
  { key: "nav_demo", sel: ".nav-drawer-links li:nth-child(3) a", prop: "text" },
  { key: "nav_faq", sel: ".nav-drawer-links li:nth-child(4) a", prop: "text" },
  {
    key: "nav_contact",
    sel: ".nav-drawer-links li:nth-child(5) a",
    prop: "text",
  },
  { key: "nav_try", sel: ".nav-drawer-btns .btn-ghost", prop: "text" },

  /* Hero */
  { key: "hero_h1_1", sel: ".hero-display", prop: "hero_h1" }, // special
  { key: "hero_sub", sel: ".hero-sub", prop: "text" },
  { key: "hero_cta", sel: ".hero-cta .btn-primary", prop: "text" },

  /* Stats */
  {
    key: "stat_sheets_num",
    sel: ".stat-badge:nth-child(1) .s-num",
    prop: "text",
  },
  {
    key: "stat_sheets_lbl",
    sel: ".stat-badge:nth-child(1) .s-lbl",
    prop: "text",
  },
  { key: "stat_acc_num", sel: ".stat-badge:nth-child(2) .s-num", prop: "text" },
  { key: "stat_acc_lbl", sel: ".stat-badge:nth-child(2) .s-lbl", prop: "text" },
  {
    key: "stat_speed_num",
    sel: ".stat-badge:nth-child(3) .s-num",
    prop: "text",
  },
  {
    key: "stat_speed_lbl",
    sel: ".stat-badge:nth-child(3) .s-lbl",
    prop: "text",
  },
  {
    key: "stat_teachers_num",
    sel: ".stat-badge:nth-child(4) .s-num",
    prop: "text",
  },
  {
    key: "stat_teachers_lbl",
    sel: ".stat-badge:nth-child(4) .s-lbl",
    prop: "text",
  },

  /* Real Results */
  { key: "rr_eyebrow", sel: "#real-results .eyebrow", prop: "text" },
  { key: "rr_h2", sel: "#real-results .h2", prop: "text" },

  /* Compare */
  { key: "cmp_eyebrow", sel: "#compare .eyebrow", prop: "text" },
  { key: "cmp_h2", sel: "#compare .h2", prop: "text" },
  {
    key: "cmp_without",
    sel: ".compare-col.pain .compare-col-hd",
    prop: "col_hd_pain",
  }, // special: keep SVG
  {
    key: "cmp_with",
    sel: ".compare-col.gain .compare-col-hd",
    prop: "col_hd_gain",
  }, // special: keep SVG
  {
    key: "cmp_pain_1",
    sel: ".compare-col.pain .compare-item:nth-child(2) span:first-child",
    prop: "text",
  },
  {
    key: "cmp_pain_2",
    sel: ".compare-col.pain .compare-item:nth-child(3) span:first-child",
    prop: "text",
  },
  {
    key: "cmp_pain_3",
    sel: ".compare-col.pain .compare-item:nth-child(4) span:first-child",
    prop: "text",
  },
  {
    key: "cmp_gain_1",
    sel: ".compare-col.gain .compare-item:nth-child(2) span:last-child",
    prop: "text",
  },
  {
    key: "cmp_gain_2",
    sel: ".compare-col.gain .compare-item:nth-child(3) span:last-child",
    prop: "text",
  },
  {
    key: "cmp_gain_3",
    sel: ".compare-col.gain .compare-item:nth-child(4) span:last-child",
    prop: "text",
  },

  /* How It Works */
  { key: "hiw_eyebrow", sel: "#how-it-works .eyebrow", prop: "text" },
  { key: "hiw_h2", sel: "#how-it-works .h2", prop: "text" },
  {
    key: "hiw_1_title",
    sel: ".hiw-card-new:nth-child(1) .hiw-card-title",
    prop: "text",
  },
  {
    key: "hiw_1_text",
    sel: ".hiw-card-new:nth-child(1) .hiw-card-text",
    prop: "text",
  },
  {
    key: "hiw_2_title",
    sel: ".hiw-card-new:nth-child(2) .hiw-card-title",
    prop: "text",
  },
  {
    key: "hiw_2_text",
    sel: ".hiw-card-new:nth-child(2) .hiw-card-text",
    prop: "text",
  },
  {
    key: "hiw_3_title",
    sel: ".hiw-card-new:nth-child(3) .hiw-card-title",
    prop: "text",
  },
  {
    key: "hiw_3_text",
    sel: ".hiw-card-new:nth-child(3) .hiw-card-text",
    prop: "text",
  },

  /* Phone Feature copy */
  { key: "pf_eyebrow", sel: "#phone-feat .eyebrow", prop: "text" },
  { key: "pf_h2", sel: "#phone-feat .h2", prop: "text" },
  { key: "pf_body", sel: "#phone-feat .body-lg", prop: "text" },
  {
    key: "pf_step1",
    sel: ".phone-step:nth-child(1) .phone-step-text",
    prop: "html",
  },
  {
    key: "pf_step2",
    sel: ".phone-step:nth-child(2) .phone-step-text",
    prop: "html",
  },
  {
    key: "pf_step3",
    sel: ".phone-step:nth-child(3) .phone-step-text",
    prop: "html",
  },
  { key: "pf_cta", sel: "#phone-feat .btn-white", prop: "text" },
  /* Phone UI mockup */
  { key: "phone_hdr_title", sel: ".phone-app-hdr-title", prop: "text" },
  { key: "phone_hdr_sub", sel: ".phone-app-hdr-sub", prop: "text" },
  {
    key: "phone_take",
    sel: ".phone-upload-half:nth-child(1) span",
    prop: "html",
  },
  {
    key: "phone_browse",
    sel: ".phone-upload-half:nth-child(2) span",
    prop: "html",
  },
  {
    key: "phone_selected",
    sel: '.phone-app-body div[style*="8.5px"]',
    prop: "text",
  },
  { key: "phone_btn", sel: ".phone-btn", prop: "text" },
  { key: "phone_score_sub", sel: ".phone-score-sub", prop: "text" },
  { key: "phone_pass", sel: ".pill.pill-green", prop: "text" },
  { key: "phone_meta", sel: ".phone-meta", prop: "text" },

  /* FAQ */
  { key: "faq_eyebrow", sel: "#faq .eyebrow", prop: "text" },
  { key: "faq_h2", sel: "#faq .h2", prop: "text" },
  { key: "faq_q1", sel: ".faq-item:nth-child(1) .faq-item-q", prop: "text" },
  { key: "faq_a1", sel: ".faq-item:nth-child(1) .faq-item-a", prop: "text" },
  { key: "faq_q2", sel: ".faq-item:nth-child(2) .faq-item-q", prop: "text" },
  { key: "faq_a2", sel: ".faq-item:nth-child(2) .faq-item-a", prop: "text" },
  { key: "faq_q3", sel: ".faq-item:nth-child(3) .faq-item-q", prop: "text" },
  { key: "faq_a3", sel: ".faq-item:nth-child(3) .faq-item-a", prop: "text" },
  { key: "faq_q4", sel: ".faq-item:nth-child(4) .faq-item-q", prop: "text" },
  { key: "faq_a4", sel: ".faq-item:nth-child(4) .faq-item-a", prop: "text" },

  /* Footer */
  { key: "footer_tagline", sel: ".footer-tagline", prop: "html" },
  {
    key: "footer_col_links",
    sel: ".footer-links .footer-col-hd",
    prop: "text",
  },
  { key: "footer_how", sel: ".footer-links a:nth-child(2)", prop: "text" },
  { key: "footer_results", sel: ".footer-links a:nth-child(3)", prop: "text" },
  { key: "footer_demo", sel: ".footer-links a:nth-child(4)", prop: "text" },
  { key: "footer_faq", sel: ".footer-links a:nth-child(5)", prop: "text" },
  {
    key: "footer_col_contact",
    sel: ".footer-contact .footer-col-hd",
    prop: "text",
  },
  { key: "footer_copy", sel: ".footer-bottom-inner", prop: "html" },
];

function applyLang(lang) {
  const t = LANG[lang];
  if (!t) return;

  I18N_MAP.forEach(({ key, sel, prop }) => {
    const els = document.querySelectorAll(sel);
    els.forEach((el) => {
      if (!el) return;
      if (prop === "text") {
        el.textContent = t[key];
      } else if (prop === "html") {
        el.innerHTML = t[key];
      } else if (prop === "hero_h1") {
        // Keep the <em> tag structure intact
        el.innerHTML = t["hero_h1_1"] + "<br><em>" + t["hero_h1_2"] + "</em>";
      } else if (prop === "col_hd_pain" || prop === "col_hd_gain") {
        // Keep the SVG icon, replace only the text node (last child)
        const svgEl = el.querySelector("svg");
        el.textContent = t[key]; // clear
        if (svgEl) el.insertBefore(svgEl, el.firstChild);
      }
    });
  });

  // swap video src based on data attributes
  const video = document.getElementById("hero-video");
  if (video) {
    const newSrc =
      video.dataset[`src${lang.charAt(0).toUpperCase() + lang.slice(1)}`];
    if (newSrc && video.src !== newSrc) {
      video.src = newSrc;
      video.load();
    }
  }

  // Update body class
  document.body.classList.toggle("lang-bn", lang === "bn");

  // Store preference
  currentLang = lang;
  localStorage.setItem("smartomr_lang", lang);
}

function initLangToggle() {
  const btnEn = document.getElementById("btn-en");
  const btnBn = document.getElementById("btn-bn");
  if (!btnEn || !btnBn) return;

  function setActive(lang) {
    btnEn.classList.toggle("active", lang === "en");
    btnBn.classList.toggle("active", lang === "bn");
    applyLang(lang);
  }

  const saved = localStorage.getItem("smartomr_lang") || "en";
  setActive(saved);

  btnEn.addEventListener("click", () => setActive("en"));
  btnBn.addEventListener("click", () => setActive("bn"));
}

initLangToggle();
