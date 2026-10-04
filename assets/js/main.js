// Protect Paints — shared JS
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      var expanded = nav.classList.contains("open");
      toggle.setAttribute("aria-expanded", expanded);
    });
  }

  // Product category filters (Shop page)
  var filterBtns = document.querySelectorAll(".filter-btn");
  var cards = document.querySelectorAll(".product-card");
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var cat = btn.dataset.filter;
        cards.forEach(function (card) {
          if (cat === "all" || card.dataset.cat === cat) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // Simple form submit feedback (no backend yet)
  var forms = document.querySelectorAll(".contact-form form, .dealer-form form");
  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        var original = btn.textContent;
        btn.textContent = "Thank you! We'll be in touch.";
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = original;
          btn.disabled = false;
          form.reset();
        }, 3000);
      }
    });
  });

  // Logo text contrast: white on dark bg, dark on light bg
  function updateLogoContrast() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var rect = header.getBoundingClientRect();
    var sampleY = Math.min(rect.bottom + 8, window.innerHeight - 2);
    var sampleX = Math.min(Math.max(window.innerWidth / 2, 40), window.innerWidth - 40);
    var el = document.elementFromPoint(sampleX, sampleY);
    var onDark = false;
    var node = el;
    var hops = 0;
    while (node && hops < 12) {
      if (node.classList) {
        if (node.classList.contains("hero") ||
            node.classList.contains("section-dark") ||
            node.classList.contains("page-hero") ||
            node.classList.contains("site-footer")) {
          onDark = true;
          break;
        }
      }
      if (node === document.body) break;
      try {
        var bg = window.getComputedStyle(node).backgroundColor;
        if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
          var m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (m) {
            var r = +m[1], g = +m[2], b = +m[3];
            // relative luminance
            var lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            onDark = lum < 0.55;
            break;
          }
        }
      } catch (e) {}
      node = node.parentElement;
      hops++;
    }
    // Home hero special case: top of page is dark until scrolled
    if (document.body.classList.contains("home") && window.scrollY < 60) {
      onDark = true;
    }
    header.classList.toggle("logo-on-dark", onDark);
    header.classList.toggle("logo-on-light", !onDark);
  }
  window.addEventListener("scroll", updateLogoContrast, { passive: true });
  window.addEventListener("resize", updateLogoContrast);
  // run after layout
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      updateLogoContrast();
      setTimeout(updateLogoContrast, 100);
    });
  } else {
    updateLogoContrast();
    setTimeout(updateLogoContrast, 100);
  }

})();