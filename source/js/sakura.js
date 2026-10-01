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
    for (var i = 0; i < 15; i++) {
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
      '<p class="sakura-intro">记录 CTF、网络安全与学习中的问题和收获。欢迎来到我的春日庭院。</p>' +
      '<div class="sakura-actions"><a href="#sakura-posts">阅读文章</a>' +
      '<a href="https://github.com/Moonrabbit07" target="_blank" rel="noopener noreferrer">我的 GitHub</a></div>';
  }

  if (home) {
    var hero = document.createElement("div");
    hero.className = "sakura-hero";
    hero.innerHTML = '<section class="sakura-card">' + cardContent() + '</section>' +
      '<span class="sakura-scroll">向下滚动 · 阅读笔记 ↓</span>';
    header.appendChild(hero);
    var main = document.getElementById("main");
    if (main) {
      var postAnchor = document.createElement("span");
      postAnchor.id = "sakura-posts";
      postAnchor.setAttribute("aria-hidden", "true");
      main.insertBefore(postAnchor, main.firstChild);
    }

    var loader = document.createElement("div");
    loader.className = "sakura-loader";
    loader.setAttribute("role", "status");
    loader.setAttribute("aria-label", "春日庭院正在加载");
    loader.innerHTML = '<section class="sakura-card">' + cardContent() + '</section>' +
      '<span class="sakura-loading-caption">春日庭院 · 正在开启</span>';
    document.body.appendChild(loader);

    var started = Date.now();
    var finished = false;
    function finishLoading() {
      if (finished) return;
      finished = true;
      setTimeout(function () {
        loader.classList.add("is-done");
        setTimeout(function () { loader.remove(); }, 950);
        if (!reduced && window.gsap) {
          window.gsap.from(hero.querySelector(".sakura-card"), {
            y: 20, opacity: 0, duration: 1.1, ease: "power2.out"
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
        var x = node.getBoundingClientRect().left;
        if (Math.abs(x - (center.left + center.width / 2)) > 260) return;
        if (window.gsap) window.gsap.to(node, { x: 18 + Math.random() * 23, duration: 1.4, ease: "sine.out", overwrite: true });
        else node.style.translate = "22px 0";
      });
    });
    card.addEventListener("mouseleave", function () {
      petalNodes.forEach(function (node) {
        if (window.gsap) window.gsap.to(node, { x: 0, duration: 2.5, ease: "sine.out", overwrite: true });
        else { node.style.transition = "translate 2.5s ease"; node.style.translate = "0 0"; }
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
    window.tsParticles.load("sakura-tsparticles", {
      fullScreen: { enable: false }, fpsLimit: 45,
      particles: {
        number: { value: 16, density: { enable: true, area: 1100 } },
        opacity: { value: { min: .35, max: .7 } },
        size: { value: { min: 6, max: 12 } },
        shape: { type: "image", image: { src: "data:image/svg+xml," + encodeURIComponent(svg), width: 16, height: 22 } },
        move: { enable: true, direction: "bottom", speed: { min: .5, max: 1.5 }, outModes: { default: "out", top: "out" } },
        rotate: { value: { min: 0, max: 360 }, direction: "random", animation: { enable: true, speed: 2 } }
      },
      detectRetina: true
    }).catch(function () { canvas.remove(); });
  }
})();
