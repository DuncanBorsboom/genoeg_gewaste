(function () {
  "use strict";

  // Header background on scroll
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  // Reveal on scroll
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // Animated stat counters
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const suffix = el.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counters = document.querySelectorAll(".stat-number[data-count]");
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (!e.target.dataset.plain) animateCount(e.target);
            co.unobserve(e.target);
          }
        }),
      { threshold: 0.6 }
    );
    counters.forEach((el) => co.observe(el));
  }

  // Signup form (demo only — hook up to real backend later)
  const form = document.getElementById("signupForm");
  const msg = document.getElementById("formMsg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const name = form.name.value.trim();
    if (!name) { msg.textContent = "Vul je naam in."; msg.style.color = "#b3402a"; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = "Vul een geldig e-mailadres in.";
      msg.style.color = "#b3402a";
      return;
    }
    msg.textContent = "Bedankt, " + name + "! Je bent aangemeld. 🌱";
    msg.style.color = "";
    form.reset();
  });

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();
})();
