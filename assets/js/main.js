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

  /* Animated particle-wave hero, inspired by flowing data surfaces */
  var waveCanvas = document.querySelector("[data-particle-wave]");
  if (waveCanvas) {
    var waveContext = waveCanvas.getContext("2d");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var waveFrame = 0;
    var waveWidth = 0;
    var waveHeight = 0;
    var waveRatio = 1;
    function sizeWave(){
      var box = waveCanvas.getBoundingClientRect();
      waveRatio = Math.min(window.devicePixelRatio || 1, 1.6);
      waveWidth = Math.max(1, box.width);
      waveHeight = Math.max(1, box.height);
      waveCanvas.width = Math.round(waveWidth * waveRatio);
      waveCanvas.height = Math.round(waveHeight * waveRatio);
      waveContext.setTransform(waveRatio, 0, 0, waveRatio, 0, 0);
    }
    function drawWave(time){
      var t = (time || 0) * 0.00028;
      waveContext.clearRect(0, 0, waveWidth, waveHeight);
      var compact = waveWidth < 760;
      var stepX = compact ? 18 : 15;
      var stepZ = compact ? 20 : 15;
      var startX = compact ? waveWidth * 0.08 : waveWidth * 0.34;
      var rows = Math.ceil(waveHeight / stepZ) + 14;
      var cols = Math.ceil((waveWidth - startX) / stepX) + 12;
      for (var row = 0; row < rows; row++) {
        var depth = row / Math.max(1, rows - 1);
        var perspectiveY = waveHeight * 0.16 + depth * waveHeight * 0.92;
        var scale = 0.52 + depth * 1.05;
        for (var col = 0; col < cols; col++) {
          var xNorm = col / Math.max(1, cols - 1);
          var x = startX + col * stepX * scale - depth * waveWidth * 0.10;
          var crest = Math.sin(xNorm * 9.2 + t * 2.2 + row * 0.10) * (26 + depth * 34);
          crest += Math.cos(xNorm * 4.4 - t * 1.4 + row * 0.055) * 22;
          var y = perspectiveY + crest - Math.sin(row * 0.12 + t) * 10;
          if (x < -10 || x > waveWidth + 10 || y < -10 || y > waveHeight + 10) continue;
          var alpha = (0.10 + depth * 0.58) * (0.50 + 0.50 * Math.sin(xNorm * 3.14));
          var cyanMix = Math.max(0, Math.min(1, depth * 1.1));
          var red = Math.round(38 + 12 * cyanMix);
          var green = Math.round(96 + 122 * cyanMix);
          var blue = Math.round(255 - 18 * cyanMix);
          waveContext.beginPath();
          waveContext.fillStyle = "rgba(" + red + "," + green + "," + blue + "," + alpha.toFixed(3) + ")";
          waveContext.arc(x, y, 0.7 + depth * 1.15, 0, Math.PI * 2);
          waveContext.fill();
        }
      }
      if (!reduceMotion && !document.hidden) waveFrame = requestAnimationFrame(drawWave);
    }
    sizeWave();
    drawWave(0);
    window.addEventListener("resize", function(){
      cancelAnimationFrame(waveFrame);
      sizeWave();
      drawWave(0);
    }, { passive:true });
    document.addEventListener("visibilitychange", function(){
      cancelAnimationFrame(waveFrame);
      if (!document.hidden) drawWave(performance.now());
    });
  }

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
