/* =====================================================================
   HOME PAGE — nav "current page" colour + hero slideshow
   Works next to the existing script.js without touching it:
   it only adds / removes the class "is-current" on menu links.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- 1. CURRENT-SECTION COLOUR (scroll) ---------- */
  // Any element with  data-spy="home"  /  data-spy="products game"  etc.
  // lights up the menu links that have the same  data-nav  value.
  var spyEls = Array.prototype.slice.call(document.querySelectorAll("[data-spy]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var moreToggle = document.querySelector(".more-toggle");
  var moreKeys = ["about", "news", "reviews"]; // the items that live inside "More"

  function setCurrent(keys) {
    var showMore = false;
    navLinks.forEach(function (a) {
      var on = keys.indexOf(a.getAttribute("data-nav")) !== -1;
      a.classList.toggle("is-current", on);
      if (on && moreKeys.indexOf(a.getAttribute("data-nav")) !== -1) showMore = true;
    });
    if (moreToggle) moreToggle.classList.toggle("is-current", showMore);
  }

  function updateSpy() {
    // the "reading line": a little way down the screen, so a section lights
    // up when it is really in view (not only when it touches the very top)
    var probe = window.scrollY + Math.max(140, window.innerHeight * 0.3);
    var keys = [];
    var nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 80;

    if (nearBottom) {
      keys = ["contact"];
    } else {
      // the last section that has started above the reading line wins,
      // so small gaps between sections never fall back to "Home"
      spyEls.forEach(function (el) {
        var top = el.getBoundingClientRect().top + window.scrollY;
        if (probe >= top) {
          keys = el.getAttribute("data-spy").split(/\s+/);
        }
      });
    }
    if (!keys.length) keys = ["home"];
    setCurrent(keys);
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateSpy();
      ticking = false;
    });
  }, { passive: true });
  window.addEventListener("resize", updateSpy);
  window.addEventListener("load", updateSpy);
  updateSpy();

  // brief colour feedback the moment a link is tapped / clicked
  navLinks.forEach(function (a) {
    a.addEventListener("click", function () {
      setCurrent([a.getAttribute("data-nav")]);
    });
  });

  /* ---------- 2. "MORE" DROPDOWN (desktop) ---------- */
  var more = document.querySelector(".nav-more");
  if (more && moreToggle) {
    moreToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      more.classList.toggle("open");
    });
    document.addEventListener("click", function () {
      more.classList.remove("open");
    });
  }

  /* ---------- 3. HERO SLIDESHOW ---------- */
  // The slides themselves are written in  js/hero-slides.js  (window.HERO_SLIDES).
  // This part turns that list into slides on the page.

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var SVG_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">';
  var ICONS = {
    gadget: SVG_OPEN + '<rect x="3" y="4" width="18" height="12" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>',
    design: SVG_OPEN + '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
    event: SVG_OPEN + '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
  };

  var TYPES = {
    gadget: { tag: "GADGETS STORE", button: "Visit Store →", link: "store.html", art: "art-gadget", label: "Your gadget photo goes here", fit: "cover", text: "" },
    design: { tag: "GRAPHIC DESIGN", button: "Request a Design →", link: "", art: "art-graphics", label: "Your design goes here", fit: "contain",
              text: "Logos, flyers, brand kits and more, designed in-house." },
    event:  { tag: "WEDDINGS & EVENTS", button: "Visit Events Page →", link: "events.html", art: "art-events", label: "Your event flyer goes here", fit: "contain",
              text: "Weddings, ceremonies and events, planned from start to finish." }
  };

  function whatsappLink() {
    var msg = "Hello IUEX Globe.Net, I would like to request a graphic design.";
    return "https://wa.me/" + (window.WHATSAPP_NUMBER || "") + "?text=" + encodeURIComponent(msg);
  }

  function makeLink(cls, href) {
    var a = el("a", cls);
    a.href = href;
    if (/^https?:/i.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }

  function buildSlides(slider) {
    var box = slider.querySelector("#heroSlides");
    var data = window.HERO_SLIDES;
    if (!box || !data || !data.length) { slider.style.display = "none"; return; }

    data.forEach(function (s, i) {
      var t = TYPES[s.type] || TYPES.gadget;
      var kind = TYPES[s.type] ? s.type : "gadget";
      var link = s.link || (kind === "design" ? whatsappLink() : t.link);
      var fit = s.fit || t.fit;

      var slide = el("article", "hero-slide");

      // picture (or a coloured placeholder while there is no picture yet)
      var media = makeLink("slide-media" + (fit === "contain" ? " fit-contain" : ""), link);
      function placeholder() {
        var d = el("div", "slide-art " + t.art);
        d.innerHTML = ICONS[kind];
        d.appendChild(el("span", null, s.placeholder || t.label));
        return d;
      }
      if (s.image) {
        var img = document.createElement("img");
        img.src = s.image;
        img.alt = s.alt || s.title || "";
        img.loading = i === 0 ? "eager" : "lazy";
        img.addEventListener("error", function () {
          if (img.parentNode) img.parentNode.replaceChild(placeholder(), img);
        });
        media.appendChild(img);
      } else {
        media.appendChild(placeholder());
      }
      slide.appendChild(media);

      // words under / beside the picture
      var body = el("div", "slide-body");
      body.appendChild(el("span", "slide-tag", s.tag || t.tag));
      body.appendChild(el("h2", null, s.title || ""));

      if (s.specs && s.specs.length) {
        var ul = el("ul", "spec-list");
        s.specs.forEach(function (line) {
          var li = el("li");
          var cut = String(line).indexOf(": ");
          if (cut > 0) {
            li.appendChild(el("small", null, line.slice(0, cut)));
            li.appendChild(document.createTextNode(line.slice(cut + 2)));
          } else {
            li.appendChild(document.createTextNode(line));
          }
          ul.appendChild(li);
        });
        body.appendChild(ul);
      } else {
        var words = (s.text != null) ? s.text : t.text;
        if (words) body.appendChild(el("p", null, words));
      }

      var btn = makeLink("primary-btn slide-btn", link);
      btn.textContent = s.button || t.button;
      body.appendChild(btn);

      slide.appendChild(body);
      box.appendChild(slide);
    });
  }

  var slider = document.getElementById("heroSlider");
  if (!slider) return;
  buildSlides(slider);

  var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
  var dotsBox = slider.querySelector(".hero-dots");
  var prevBtn = slider.querySelector(".hero-arrow.prev");
  var nextBtn = slider.querySelector(".hero-arrow.next");
  var index = 0;
  var timer = null;
  var DELAY = 7000;
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var dots = slides.map(function (_, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Show slide " + (i + 1));
    b.addEventListener("click", function () { show(i); restart(); });
    dotsBox.appendChild(b);
    return b;
  });

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach(function (s, n) { s.classList.toggle("is-active", n === index); });
    dots.forEach(function (d, n) { d.classList.toggle("is-active", n === index); });
  }

  function restart() {
    stop();
    if (!reduceMotion) timer = setInterval(function () { show(index + 1); }, DELAY);
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  if (prevBtn) prevBtn.addEventListener("click", function () { show(index - 1); restart(); });
  if (nextBtn) nextBtn.addEventListener("click", function () { show(index + 1); restart(); });

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", restart);
  slider.addEventListener("focusin", stop);
  slider.addEventListener("focusout", restart);

  // swipe on phones
  var startX = null;
  slider.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
    stop();
  }, { passive: true });
  slider.addEventListener("touchend", function (e) {
    if (startX !== null) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) show(dx < 0 ? index + 1 : index - 1);
    }
    startX = null;
    restart();
  }, { passive: true });

  show(0);
  restart();
})();