/* global hexo */

// 在个人卡片内显示全站和今日的页面访问次数。
hexo.extend.injector.register("head_end", `
<style>
#sidebar .moon-footfall {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin: 2px 0 19px;
}
#sidebar .moon-footfall-item {
  min-width: 0;
  padding: 13px 8px 11px;
  text-align: center;
  border: 1px solid rgba(255,255,255,.75);
  border-radius: 20px 24px 21px 25px / 24px 20px 25px 21px;
  background: linear-gradient(145deg, rgba(255,240,246,.66), rgba(232,239,255,.42));
  box-shadow: 0 8px 24px rgba(116,85,117,.1), inset 0 1px rgba(255,255,255,.83);
  -webkit-backdrop-filter: blur(8px) saturate(1.2);
  backdrop-filter: blur(8px) saturate(1.2);
  transition: transform .5s ease, box-shadow .5s ease, border-radius .6s ease;
}
#sidebar .moon-footfall-item:nth-child(2) {
  background: linear-gradient(145deg, rgba(234,244,255,.67), rgba(255,232,243,.45));
}
#sidebar .moon-footfall-item:hover {
  transform: translateY(-3px);
  border-radius: 24px 20px 25px 21px / 20px 25px 21px 24px;
  box-shadow: 0 12px 30px rgba(116,85,117,.14), inset 0 1px rgba(255,255,255,.9);
}
#sidebar .moon-footfall-icon {
  display: block;
  margin-bottom: 3px;
  font-size: 23px;
  line-height: 1.2;
  animation: moon-paw-float 6s ease-in-out infinite;
}
#sidebar .moon-footfall-item:nth-child(2) .moon-footfall-icon {
  animation-delay: -3s;
}
#sidebar .moon-footfall-label {
  display: block;
  color: #796b82;
  font-size: 12px;
  letter-spacing: .04em;
  white-space: nowrap;
}
#sidebar .moon-footfall-value {
  display: block;
  margin-top: 3px;
  color: #665579;
  font-size: 22px;
  font-weight: 750;
  line-height: 1.35;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}
#sidebar .moon-footfall-value.is-ready {
  animation: moon-number-appear .65s ease-out both;
}
@keyframes moon-paw-float {
  0%, 100% { transform: translateY(0) rotate(-4deg); }
  50% { transform: translateY(-3px) rotate(3deg); }
}
@keyframes moon-number-appear {
  from { opacity: .35; transform: translateY(5px) scale(.94); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  #sidebar .moon-footfall-icon,
  #sidebar .moon-footfall-value.is-ready {
    animation: none;
  }
  #sidebar .moon-footfall-item {
    transition: none;
  }
}
</style>
`, "default");

hexo.extend.injector.register("body_end", `
<script>
(function () {
  function showFootfall() {
    var content = document.querySelector("#sidebar .moon-profile-content");
    if (!content || document.querySelector(".moon-footfall")) return;

    var panel = document.createElement("section");
    panel.className = "moon-footfall";
    panel.setAttribute("aria-label", "博客访问量");
    panel.innerHTML =
      '<div class="moon-footfall-item">' +
        '<span class="moon-footfall-icon" aria-hidden="true">🐾</span>' +
        '<span class="moon-footfall-label">总踩踏量</span>' +
        '<strong class="moon-footfall-value" id="busuanzi_site_pv">···</strong>' +
      '</div>' +
      '<div class="moon-footfall-item">' +
        '<span class="moon-footfall-icon" aria-hidden="true">🌸</span>' +
        '<span class="moon-footfall-label">今日踩踏</span>' +
        '<strong class="moon-footfall-value" id="busuanzi_today_pv">···</strong>' +
      '</div>';

    var follow = content.querySelector(".moon-profile-follow");
    content.insertBefore(panel, follow || null);

    var numbers = panel.querySelectorAll(".moon-footfall-value");
    numbers.forEach(function (number) {
      var observer = new MutationObserver(function () {
        if (number.textContent.trim() === "···") return;
        number.classList.add("is-ready");
        observer.disconnect();
      });
      observer.observe(number, {
        childList: true,
        characterData: true,
        subtree: true
      });
    });

    var script = document.createElement("script");
    script.src = "https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js";
    script.async = true;
    script.onerror = function () {
      numbers.forEach(function (number) {
        if (number.textContent.trim() === "···") number.textContent = "—";
      });
    };
    document.body.appendChild(script);

    setTimeout(function () {
      numbers.forEach(function (number) {
        if (number.textContent.trim() === "···") number.textContent = "—";
      });
    }, 12000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showFootfall, { once: true });
  } else {
    showFootfall();
  }
})();
</script>
`, "default");
