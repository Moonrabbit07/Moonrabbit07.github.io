/* global hexo */
// 为文章开头生成可见的分层目录，并在滚动时提供悬浮目录。

hexo.extend.injector.register("head_end", `
<style>
.article-entry .moon-toc-inline {
  box-sizing: border-box;
  width: min(360px, 100%);
  max-height: min(56vh, 460px);
  overflow: auto;
  overscroll-behavior: contain;
  margin: 4px 0 30px auto;
  padding: 19px 16px;
  border: 1px solid rgba(255,255,255,.86);
  border-radius: 25px 29px 24px 30px;
  background: linear-gradient(145deg, rgba(255,255,255,.78), rgba(255,234,247,.65));
  box-shadow: 0 15px 38px rgba(73,65,104,.14), inset 0 1px rgba(255,255,255,.9);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  backdrop-filter: blur(18px) saturate(1.2);
}
.moon-toc {
  position: fixed;
  z-index: 900;
  right: max(16px, env(safe-area-inset-right));
  bottom: max(20px, env(safe-area-inset-bottom));
  color: #62536d;
  font-family: inherit;
}
.moon-toc details { position: relative; }
.moon-toc summary {
  display: block;
  width: max-content;
  margin-left: auto;
  padding: 11px 18px;
  border: 1px solid rgba(255,255,255,.82);
  border-radius: 999px;
  background: rgba(255,242,250,.82);
  box-shadow: 0 9px 28px rgba(89,66,105,.2);
  -webkit-backdrop-filter: blur(14px) saturate(1.25);
  backdrop-filter: blur(14px) saturate(1.25);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  list-style: none;
}
.moon-toc summary::-webkit-details-marker { display: none; }
.moon-toc nav {
  box-sizing: border-box;
  position: absolute;
  right: 0;
  bottom: calc(100% + 12px);
  width: min(320px, calc(100vw - 32px));
  max-height: min(66vh, 520px);
  overflow: auto;
  overscroll-behavior: contain;
  padding: 17px 13px 15px;
  border: 1px solid rgba(255,255,255,.83);
  border-radius: 26px 31px 25px 30px / 30px 25px 31px 26px;
  background: linear-gradient(145deg, rgba(255,255,255,.83), rgba(251,232,245,.76));
  box-shadow: 0 18px 48px rgba(79,62,109,.19), inset 0 1px rgba(255,255,255,.9);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  backdrop-filter: blur(18px) saturate(1.2);
}
.moon-toc-title {
  margin: 0 8px 10px;
  color: #765576;
  font-size: 16px;
  font-weight: 700;
}
.moon-toc-inline .moon-toc-title { margin: 0 10px 11px; }
.moon-toc ol,
.moon-toc-inline ol { margin: 0; padding: 0; list-style: none; }
.moon-toc li,
.moon-toc-inline li { margin: 0; padding: 0; list-style: none; }
.moon-toc ol ol,
.moon-toc-inline ol ol {
  margin-left: 13px;
  padding-left: 8px;
  border-left: 1px solid rgba(169,119,157,.3);
}
.moon-toc .level-h4 > a,
.moon-toc-inline .level-h4 > a { font-size: 12px; opacity: .85; }
.moon-toc a,
.moon-toc-inline a {
  display: block;
  padding: 8px 10px;
  border-radius: 12px;
  color: #62536d;
  font-size: 13px;
  line-height: 1.55;
  text-decoration: none;
  overflow-wrap: anywhere;
}
.moon-toc a:hover,
.moon-toc a.is-active,
.moon-toc-inline a:hover,
.moon-toc-inline a.is-active {
  color: #805077;
  background: rgba(246,215,234,.7);
}
.moon-toc a:focus-visible,
.moon-toc-inline a:focus-visible,
.moon-toc summary:focus-visible {
  outline: 2px solid #a95d7b;
  outline-offset: 2px;
}
.article-entry h2,
.article-entry h3,
.article-entry h4 { scroll-margin-top: 24px; }
@media (max-width: 600px) {
  .article-entry .moon-toc-inline { width: 100%; max-height: 48vh; }
  .moon-toc summary { padding: 10px 15px; }
  .moon-toc nav { max-height: 58vh; }
}
</style>
`, "post");

hexo.extend.injector.register("body_end", `
<script>
(function () {
  "use strict";
  var article = document.querySelector("#main > article.article-type-post");
  var entry = article && article.querySelector(".article-entry");
  if (!entry) return;
  var headings = Array.prototype.slice.call(entry.querySelectorAll("h2, h3, h4"));
  if (headings.length < 2) return;

  var used = new Set(Array.prototype.map.call(document.querySelectorAll("[id]"), function (node) {
    return node.id;
  }));
  var intro = document.createElement("aside");
  intro.className = "moon-toc-inline";
  intro.setAttribute("aria-label", "文章目录");

  var toc = document.createElement("aside");
  toc.className = "moon-toc";
  var box = document.createElement("details");
  var summary = document.createElement("summary");
  summary.textContent = "☰ 目录";
  var nav = document.createElement("nav");
  nav.setAttribute("aria-label", "文章目录");
  var title = document.createElement("div");
  title.className = "moon-toc-title";
  title.textContent = "文章目录 · " + headings.length + " 节";
  var links = [];

  function buildList() {
    var root = document.createElement("ol");
    var parents = [];
    headings.forEach(function (heading) {
      var level = Number(heading.tagName.slice(1));
      while (parents.length && parents[parents.length - 1].level >= level) parents.pop();
      var parent = parents.length ? parents[parents.length - 1].item : null;
      var container = root;
      if (parent) {
        container = parent.querySelector(":scope > ol");
        if (!container) {
          container = document.createElement("ol");
          parent.appendChild(container);
        }
      }
      var item = document.createElement("li");
      item.className = "level-" + heading.tagName.toLowerCase();
      var link = document.createElement("a");
      link.href = "#" + encodeURIComponent(heading.id);
      link.textContent = heading.textContent.trim();
      item.appendChild(link);
      container.appendChild(item);
      links.push(link);
      parents.push({ level: level, item: item });
    });
    return root;
  }

  headings.forEach(function (heading, index) {
    if (!heading.id) {
      var base = "moon-section-" + (index + 1);
      var id = base;
      var n = 2;
      while (used.has(id)) id = base + "-" + n++;
      heading.id = id;
      used.add(id);
    }
  });

  var introTitle = title.cloneNode(true);
  intro.appendChild(introTitle);
  intro.appendChild(buildList());
  var firstParagraph = entry.querySelector(":scope > p");
  if (firstParagraph) firstParagraph.after(intro);
  else entry.insertBefore(intro, entry.firstChild);

  nav.appendChild(title);
  nav.appendChild(buildList());
  box.appendChild(summary);
  box.appendChild(nav);
  toc.appendChild(box);
  document.body.appendChild(toc);

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) box.open = false;
  });
  document.addEventListener("click", function (event) {
    if (box.open && !toc.contains(event.target)) box.open = false;
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") box.open = false;
  });

  var scheduled = false;
  function updateActive() {
    scheduled = false;
    var current = 0;
    headings.forEach(function (heading, index) {
      if (heading.getBoundingClientRect().top <= 110) current = index;
    });
    links.forEach(function (link) {
      var active = link.getAttribute("href") === "#" + encodeURIComponent(headings[current].id);
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", function () {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateActive);
  }, { passive: true });
  updateActive();
})();
</script>
`, "post");
