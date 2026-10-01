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
    var headerNav = document.getElementById("header-inner");
    if (headerNav) {
      headerNav.setAttribute("inert", "");
      headerNav.setAttribute("aria-hidden", "true");
    }

    var hero = document.createElement("div");
    hero.className = "sakura-hero";
    hero.innerHTML = '<section class="sakura-card">' + cardContent() + '</section>' +
      '<span class="sakura-scroll-hint" aria-hidden="true">轻触画面，继续阅读 ↓</span>';
    header.appendChild(hero);

    var main = document.getElementById("main");
    if (main) {
      var postAnchor = document.createElement("span");
      postAnchor.id = "sakura-posts";
      postAnchor.setAttribute("aria-hidden", "true");
      main.insertBefore(postAnchor, main.firstChild);
    }

    function enterBlog() {
      var target = Math.max(0, header.getBoundingClientRect().bottom + window.scrollY - 18);
      window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
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
    loader.innerHTML = '<section class="sakura-card">' + cardContent() + '</section>' +
      '<span class="sakura-loading-caption">春日庭院 · 正在开启</span>';
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
