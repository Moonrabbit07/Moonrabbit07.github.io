(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var home = location.pathname === "/" || location.pathname === "/index.html";
  var header = document.getElementById("header");
  if (!header) return;
  if (home) document.body.classList.add("sakura-home");

  var light = document.createElement("div");
  light.className = "sakura-light";
  light.setAttribute("aria-hidden", "true");
  document.body.prepend(light);

  var particles = document.createElement("div");
  particles.className = "sakura-particles";
  particles.setAttribute("aria-hidden", "true");
  document.body.appendChild(particles);

  var petalNodes = [];
  if (!reduced) {
    for (var i = 0; i < 10; i++) {
      var petal = document.createElement("span");
      petal.className = "sakura-petal";
      petal.style.left = ((i * 67.4 + 13) % 100) + "%";
      petal.style.setProperty("--fall", (11 + (i % 7) * 1.8) + "s");
      petal.style.setProperty("--delay", (-i * 1.13) + "s");
      petal.style.setProperty("--drift", ((i % 2 ? 1 : -1) * (40 + i * 8)) + "px");
      particles.appendChild(petal);
      petalNodes.push(petal);
    }
  }

  function cardContent() {
    return '<img class="sakura-avatar" src="https://github.com/Moonrabbit07.png?size=220" alt="Moonrabbit07 的头像">' +
      '<p class="sakura-kicker">SPRING · PERSONAL BLOG</p>' +
      '<h1>Moonrabbit_7</h1>' +
      '<p class="sakura-handle">@Moonrabbit07</p>' +
      '<p class="sakura-intro">记录 CTF、网络安全与学习中的问题和收获。欢迎来到我的春日庭院。</p>';
  }

  if (home) {
    var motionStyle = document.createElement("style");
    motionStyle.id = "sakura-notes-motion";
    motionStyle.textContent = [
      "body.sakura-home .sakura-hero { transition: opacity .7s ease, transform .9s cubic-bezier(.22,1,.36,1); }",
      "body.sakura-entering .sakura-hero { opacity: .76; transform: translate3d(0,-22px,0) scale(.985); }",
      "body.sakura-home .article .article-inner { background-color: rgba(255,255,255,.34) !important; border: 1px solid rgba(255,255,255,.72); -webkit-backdrop-filter: blur(14px) saturate(1.28); backdrop-filter: blur(14px) saturate(1.28); }",
      "body.sakura-home .article .article-entry { max-height: 310px; overflow: hidden; -webkit-mask-image: linear-gradient(#000 68%,transparent 100%); mask-image: linear-gradient(#000 68%,transparent 100%); }",
      "body.sakura-home .article .article-entry .article-more-link { display: none; }",
      "body.sakura-home .article .article-inner { padding-bottom: 78px; }",
      ".sakura-read-more { position: absolute; right: 28px; bottom: 22px; z-index: 2; display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border: 1px solid rgba(255,255,255,.82); border-radius: 999px; background: rgba(255,255,255,.48); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); color: #69516f !important; text-decoration: none; font-weight: 600; box-shadow: 0 6px 20px rgba(92,73,111,.1); transition: background .3s ease, transform .3s ease; }",
      ".sakura-read-more:hover, .sakura-read-more:focus-visible { background: rgba(255,255,255,.75); transform: translateY(-2px); }",
      "body.sakura-home .article .article-inner::before { opacity: .87; }",
      "@media (prefers-reduced-motion: no-preference) { body.sakura-home .article .article-inner.sakura-reveal { opacity: 0; transform: translate3d(0,76px,0) scale(.97); transition: opacity .85s ease, transform 1.05s cubic-bezier(.22,1,.36,1), box-shadow .55s ease, border-radius .7s ease; } body.sakura-home .article .article-inner.sakura-reveal.sakura-visible { opacity: 1; transform: translate3d(0,0,0) scale(1); } body.sakura-home .article .article-inner.sakura-visible:hover { transform: translate3d(0,-4px,0) scale(1.004); } }",
      "@media (max-width:600px) { body.sakura-home .article .article-entry { max-height: 260px; } .sakura-read-more { right: 20px; bottom: 17px; } }",
      "@media (prefers-reduced-motion: reduce) { body.sakura-entering .sakura-hero { opacity: 1; transform: none; } .sakura-read-more { transition: none; } }"
    ].join("\n");
    document.head.appendChild(motionStyle);

    var headerNav = document.getElementById("header-inner");
    if (headerNav) {
      headerNav.setAttribute("inert", "");
      headerNav.setAttribute("aria-hidden", "true");
    }

    var hero = document.createElement("div");
    hero.className = "sakura-hero";
    hero.innerHTML = '<section class="sakura-card">' + cardContent() + '</section>';
    header.appendChild(hero);

    var main = document.getElementById("main");
    if (main) {
      var postAnchor = document.createElement("span");
      postAnchor.id = "sakura-posts";
      postAnchor.setAttribute("aria-hidden", "true");
      main.insertBefore(postAnchor, main.firstChild);

      main.querySelectorAll(".article").forEach(function (article) {
        var titleLink = article.querySelector(".article-title[href]");
        var inner = article.querySelector(".article-inner");
        if (!titleLink || !inner) return;

        var moreLink = document.createElement("a");
        moreLink.className = "sakura-read-more";
        moreLink.href = titleLink.href;
        moreLink.textContent = "阅读全文 →";
        inner.appendChild(moreLink);
      });
    }

    function enterBlog() {
      document.body.classList.add("sakura-entering");
      var target = Math.max(0, header.getBoundingClientRect().bottom + window.scrollY - 18);
      window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
      setTimeout(function () {
        document.body.classList.remove("sakura-entering");
      }, 1100);
    }

    header.setAttribute("role", "button");
    header.setAttribute("tabindex", "0");
    header.setAttribute("aria-label", "进入博客正文");
    header.addEventListener("click", enterBlog);
    header.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        enterBlog();
      }
    });

    var loader = document.createElement("div");
    loader.className = "sakura-loader";
    loader.setAttribute("role", "button");
    loader.setAttribute("tabindex", "0");
    loader.setAttribute("aria-label", "进入博客正文，加载后自动滑动");
    loader.innerHTML = '<section class="sakura-card">' + cardContent() + '</section>';
    document.body.appendChild(loader);

    var started = Date.now();
    var finished = false;
    var requestedEntry = false;

    loader.addEventListener("click", function () {
      requestedEntry = true;
    });
    loader.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        requestedEntry = true;
      }
    });

    function finishLoading() {
      if (finished) return;
      finished = true;
      setTimeout(function () {
        loader.classList.add("is-done");
        setTimeout(function () { loader.remove(); }, 950);
        if (requestedEntry) setTimeout(enterBlog, 120);
        if (!reduced && window.gsap) {
          window.gsap.from(hero, {
            opacity: 0,
            duration: .8,
            ease: "sine.out"
          });
        }
      }, reduced ? 0 : Math.max(0, 1250 - (Date.now() - started)));
    }

    var bg = new Image();
    bg.onload = finishLoading;
    bg.onerror = finishLoading;
    bg.src = "/images/sakura-garden.webp";
    setTimeout(finishLoading, 4500);

    var card = hero.querySelector(".sakura-card");
    card.addEventListener("mouseenter", function () {
      if (reduced) return;
      var center = card.getBoundingClientRect();
      petalNodes.forEach(function (node) {
        var position = node.getBoundingClientRect();
        if (Math.abs(position.left - (center.left + center.width / 2)) > 260 ||
            Math.abs(position.top - (center.top + center.height / 2)) > 320) return;
        node.style.transition = "translate 1.4s ease-out";
        node.style.translate = (18 + Math.random() * 23) + "px 0";
      });
    });
    card.addEventListener("mouseleave", function () {
      petalNodes.forEach(function (node) {
        node.style.transition = "translate 2.5s ease-out";
        node.style.translate = "0 0";
      });
    });
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      document.body.classList.toggle("sakura-scrolled", window.scrollY > 100);
      light.style.opacity = String(Math.max(.55, 1 - window.scrollY / 2400));
      ticking = false;
    });
  }, { passive: true });

  var glassPanels = document.querySelectorAll(
    ".article .article-inner, .archive-article .archive-article-inner, .blog-comments"
  );
  if (!reduced && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("sakura-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.04 });

    glassPanels.forEach(function (panel) {
      panel.classList.add("sakura-reveal");
      revealObserver.observe(panel);
    });
  }

  if (!reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    glassPanels.forEach(function (panel) {
      var pending = false;
      var nextX = 0;
      var nextY = 0;

      panel.addEventListener("pointermove", function (event) {
        var rect = panel.getBoundingClientRect();
        nextX = event.clientX - rect.left;
        nextY = event.clientY - rect.top;
        if (pending) return;

        pending = true;
        requestAnimationFrame(function () {
          panel.style.setProperty("--glow-x", nextX + "px");
          panel.style.setProperty("--glow-y", nextY + "px");
          pending = false;
        });
      }, { passive: true });

      panel.addEventListener("pointerleave", function () {
        panel.style.removeProperty("--glow-x");
        panel.style.removeProperty("--glow-y");
      });
    });
  }

  if (!reduced && window.tsParticles && typeof window.tsParticles.load === "function") {
    var canvas = document.createElement("div");
    canvas.id = "sakura-tsparticles";
    canvas.style.cssText = "position:absolute;inset:0;pointer-events:none";
    particles.appendChild(canvas);

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="22" viewBox="0 0 16 22"><path fill="#f8d1df" d="M8 0C16 4 16 12 8 22 0 13-1 5 8 0Z"/></svg>';

    try {
      var particleLoad = window.tsParticles.load("sakura-tsparticles", {
        fullScreen: { enable: false },
        fpsLimit: 30,
        particles: {
          number: { value: 8, density: { enable: true, area: 1100 } },
          opacity: { value: { min: .35, max: .7 } },
          size: { value: { min: 6, max: 12 } },
          shape: {
            type: "image",
            image: {
              src: "data:image/svg+xml," + encodeURIComponent(svg),
              width: 16,
              height: 22
            }
          },
          move: {
            enable: true,
            direction: "bottom",
            speed: { min: .5, max: 1.5 },
            outModes: { default: "out", top: "out" }
          },
          rotate: {
            value: { min: 0, max: 360 },
            direction: "random",
            animation: { enable: true, speed: 2 }
          }
        },
        detectRetina: true
      });
      if (particleLoad && typeof particleLoad.catch === "function") {
        particleLoad.catch(function () { canvas.remove(); });
      }
    } catch (error) {
      canvas.remove();
    }
  }
})();
