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

  // Hero mouse parallax (art gently follows the cursor)
  const heroArt = document.querySelector(".hero-art");
  const hero = document.querySelector(".hero");
  if (heroArt && hero && matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    let raf = null;
    hero.addEventListener("mousemove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        heroArt.style.transform = "translate(" + x * 18 + "px," + y * 14 + "px)";
        raf = null;
      });
    });
    hero.addEventListener("mouseleave", () => {
      heroArt.style.transform = "";
    });
  }

  // 3D tilt on cards
  if (matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.classList.add("tilt");
        card.style.transform =
          "perspective(700px) rotateX(" + -y * 6 + "deg) rotateY(" + x * 6 + "deg) translateY(-6px)";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();
})();
