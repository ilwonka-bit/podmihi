/* ============================================================
   Режим — скрипты заготовки
   ============================================================ */

(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     1. Появление элементов при прокрутке
     ---------------------------------------------------------- */

  var revealItems = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealItems.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     2. Кружок, следующий за курсором с небольшим опозданием
     ---------------------------------------------------------- */

  var cursor = document.getElementById("cursor");
  var canHover = window.matchMedia("(pointer: fine)").matches;

  if (cursor && canHover) {
    var SIZE = 26;          // должен совпадать с width/height в styles.css
    var HALF = SIZE / 2;
    var EASING = 0.13;       // чем меньше — тем сильнее отставание
    var HOVER_SCALE = 1.6;

    var targetX = -100;
    var targetY = -100;
    var currentX = -100;
    var currentY = -100;
    var targetScale = 1;
    var currentScale = 1;
    var started = false;

    window.addEventListener(
      "mousemove",
      function (event) {
        targetX = event.clientX;
        targetY = event.clientY;

        if (!started) {
          started = true;
          currentX = targetX;
          currentY = targetY;
          cursor.classList.add("is-on");
        }
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", function () {
      cursor.classList.remove("is-on");
      started = false;
    });

    document.addEventListener("mouseenter", function () {
      if (started) cursor.classList.add("is-on");
    });

    // увеличение кружка над интерактивными элементами
    var HOVER_SELECTOR = "a, button, .role, [data-cursor]";

    document.addEventListener(
      "mouseover",
      function (event) {
        if (event.target.closest && event.target.closest(HOVER_SELECTOR)) {
          targetScale = HOVER_SCALE;
        }
      },
      { passive: true }
    );

    document.addEventListener(
      "mouseout",
      function (event) {
        var hovered = event.target.closest && event.target.closest(HOVER_SELECTOR);
        var stillInside = event.relatedTarget && hovered && hovered.contains(event.relatedTarget);

        if (hovered && !stillInside) {
          targetScale = 1;
        }
      },
      { passive: true }
    );

    var render = function () {
      currentX += (targetX - currentX) * EASING;
      currentY += (targetY - currentY) * EASING;
      currentScale += (targetScale - currentScale) * 0.12;

      cursor.style.transform =
        "translate3d(" +
        (currentX - HALF) +
        "px," +
        (currentY - HALF) +
        "px, 0) scale(" +
        currentScale.toFixed(4) +
        ")";

      window.requestAnimationFrame(render);
    };

    window.requestAnimationFrame(render);
  } else if (cursor) {
    cursor.style.display = "none";
  }

  /* ----------------------------------------------------------
     3. Индикатор прокрутки и состояние навигации
     ---------------------------------------------------------- */

  var nav = document.getElementById("nav");
  var progress = document.getElementById("progress");

  var onScroll = function () {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? window.scrollY / max : 0;

    if (progress) {
      progress.style.transform = "scaleX(" + Math.min(Math.max(ratio, 0), 1) + ")";
    }

    if (nav) {
      nav.classList.toggle("is-scrolled", window.scrollY > 40);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ----------------------------------------------------------
     4. Год в футере
     ---------------------------------------------------------- */

  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();
