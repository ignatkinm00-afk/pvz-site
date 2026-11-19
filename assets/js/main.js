/* ПВЗ Под ключ — interactions */
(function () {
  "use strict";

  /* ---- header scroll state ---- */
  var header = document.querySelector(".site-header");
  var backTop = document.querySelector(".back-to-top");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 20);
    if (backTop) backTop.classList.toggle("show", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- animated counters ---- */
  function animateCounters() {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals"), 10) : 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var prefix = el.getAttribute("data-prefix") || "";
      var dur = 1600;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = target * eased;
        el.textContent = prefix + val.toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  var counterIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        animateCounters();
        counterIo.disconnect();
      }
    });
  }, { threshold: 0.4 });
  if (document.querySelector("[data-count]")) {
    counterIo.observe(document.querySelector("[data-count]"));
  }

  /* ---- mobile menu ---- */
  var burger = document.querySelector(".burger");
  var mobile = document.querySelector(".mobile-menu");
  if (burger && mobile) {
    burger.addEventListener("click", function () {
      burger.classList.toggle("open");
      mobile.classList.toggle("open");
      document.body.style.overflow = mobile.classList.contains("open") ? "hidden" : "";
    });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        burger.classList.remove("open");
        mobile.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (o) {
        o.classList.remove("open");
        o.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---- duplicate marquee track for seamless loop ---- */
  document.querySelectorAll(".marquee-track").forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  /* ---- contact form (mailto fallback) ---- */
  var form = document.querySelector("[data-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]') ? form.querySelector('[name="name"]').value : "";
      var contact = form.querySelector('[name="contact"]') ? form.querySelector('[name="contact"]').value : "";
      var task = form.querySelector('[name="task"]') ? form.querySelector('[name="task"]').value : "";
      var subject = encodeURIComponent("Заявка с сайта: " + name);
      var body = encodeURIComponent("Имя: " + name + "\nКонтакт: " + contact + "\nЗадача: " + task);
      window.location.href = "mailto:mail@example.ru?subject=" + subject + "&body=" + body;
    });
  }
})();
