(function(){
  "use strict";

  /* Persistent light/dark theme with system preference fallback */
  var root = document.documentElement;
  var themeButton = document.querySelector(".theme-toggle");
  var storedTheme = localStorage.getItem("abg-theme");
  var preferredTheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  var activeTheme = storedTheme || preferredTheme;
  function applyTheme(theme){
    root.setAttribute("data-theme", theme);
    if (themeButton) {
      var dark = theme === "dark";
      themeButton.setAttribute("aria-pressed", String(dark));
      themeButton.setAttribute("aria-label", dark ? "Activer le mode clair / Enable light mode" : "Activer le mode sombre / Enable dark mode");
    }
  }
  applyTheme(activeTheme);
  if (themeButton) themeButton.addEventListener("click", function(){
    activeTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("abg-theme", activeTheme);
    applyTheme(activeTheme);
  });

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav__toggle");
  var links  = document.querySelector(".nav__links");
  var lang   = document.querySelector(".nav__lang");
  if (toggle && links) {
    toggle.addEventListener("click", function(){
      var open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (lang) lang.classList.toggle("is-open", open);
      links.style.display = open ? "flex" : "";
      if (lang) lang.style.display = open ? "flex" : "";
    });
    links.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){
        links.style.display = "";
        if (lang) lang.style.display = "";
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("is-visible"); });
  }

  /* Animated stat counters */
  var counters = document.querySelectorAll("[data-count]");
  function animateCount(el){
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1200;
    var start = null;
    function step(ts){
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var ioc = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          animateCount(entry.target);
          ioc.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function(el){ ioc.observe(el); });
  }

  /* Contact form (static hosting: no backend by default) */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var action = form.getAttribute("data-action-url");
      if (action) {
        fetch(action, { method: "POST", body: new FormData(form), headers: { "Accept": "application/json" } })
          .then(function(res){
            if (res.ok) {
              form.reset();
              if (status) status.textContent = form.getAttribute("data-success-text") || "Message envoyé.";
            } else {
              if (status) status.textContent = form.getAttribute("data-error-text") || "Une erreur est survenue.";
            }
          })
          .catch(function(){
            if (status) status.textContent = form.getAttribute("data-error-text") || "Une erreur est survenue.";
          });
      } else {
        var name = encodeURIComponent(form.name.value || "");
        var email = encodeURIComponent(form.email.value || "");
        var org = encodeURIComponent((form.org && form.org.value) || "");
        var message = encodeURIComponent(form.message.value || "");
        var to = form.getAttribute("data-mailto") || "contact@abgdigitalsolutions.com";
        var subject = encodeURIComponent("Contact site — " + (form.name.value || ""));
        var body = "Nom / Name: " + decodeURIComponent(name) +
                    "%0AEmail: " + decodeURIComponent(email) +
                    "%0AOrganisation: " + decodeURIComponent(org) +
                    "%0A%0A" + decodeURIComponent(message);
        window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
        if (status) status.textContent = form.getAttribute("data-success-text") || "Ouverture de votre client mail…";
      }
    });
  }

  /* Nav background on scroll (keeps consistent blur, hook for future use) */
  var nav = document.querySelector(".nav");
  if (nav) {
    window.addEventListener("scroll", function(){
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    }, { passive: true });
  }
})();
