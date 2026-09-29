/* global hexo */

/* 个人卡片样式，以及把桌面端侧栏放到左边 */
hexo.extend.injector.register(
  "head_end",
  `
<style>
@media (min-width: 768px) {
  #sidebar {
    float: left;
  }

  #main {
    float: right;
  }
}

.moon-profile {
  margin: 0 0 28px;
  overflow: hidden;
  background: #f7fbff;
  border: 1px solid #d8ebf6;
  border-radius: 18px;
  box-shadow: 0 12px 32px rgba(35, 104, 149, 0.14);
}

.moon-profile-cover {
  height: 118px;
  background: linear-gradient(125deg, #65d5f2, #329cec);
}

.moon-profile-content {
  padding: 0 20px 24px;
  text-align: center;
}

.moon-profile-avatar {
  display: block;
  width: 96px;
  height: 96px;
  box-sizing: border-box;
  margin: -48px auto 14px;
  position: relative;
  border: 5px solid #ffffff;
  border-radius: 50%;
  background: #ffffff;
  object-fit: cover;
  box-shadow: 0 4px 14px rgba(30, 91, 132, 0.18);
}

.moon-profile-name {
  margin: 0;
  color: #294d64;
  font-size: 23px;
  line-height: 1.4;
}

.moon-profile-handle {
  margin: 3px 0 14px;
  color: #6d8494;
  font-size: 14px;
}

.moon-profile-intro {
  margin: 0 0 20px;
  color: #4c6677;
  font-size: 14px;
  line-height: 1.8;
}

.moon-profile-follow {
  display: block;
  padding: 11px 14px;
  color: #ffffff !important;
  background: #329cec;
  border-radius: 999px;
  font-weight: bold;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease;
}

.moon-profile-follow:hover {
  background: #197dbd;
  transform: translateY(-2px);
}

.moon-profile-links {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #dcebf3;
  text-align: left;
}

.moon-profile-links h3 {
  margin: 0 0 11px;
  color: #42667b;
  font-size: 15px;
}

.moon-profile-links a {
  display: block;
  padding: 8px 0;
  color: #287faf;
  text-decoration: none;
  font-size: 14px;
}

.moon-profile-links a:hover {
  color: #155d8b;
}

#sidebar .widget-wrap {
  margin: 24px 0;
}
</style>
  `,
  "default"
);

/* 在现有侧栏顶部插入个人卡片 */
hexo.extend.injector.register(
  "body_end",
  `
<script>
(function () {
  var sidebar = document.querySelector("#sidebar");
  if (!sidebar) return;

  var card = document.createElement("section");
  card.className = "moon-profile";

  card.innerHTML =
    '<div class="moon-profile-cover"></div>' +
    '<div class="moon-profile-content">' +
      '<img class="moon-profile-avatar" ' +
        'src="https://github.com/Moonrabbit07.png?size=200" ' +
        'alt="Moonrabbit07 的头像">' +
      '<h2 class="moon-profile-name">Moonrabbit_7</h2>' +
      '<p class="moon-profile-handle">@Moonrabbit07</p>' +
      '<p class="moon-profile-intro">' +
        '记录 CTF、网络安全与学习中的问题和收获。' +
      '</p>' +
      '<a class="moon-profile-follow" ' +
        'href="https://github.com/Moonrabbit07" ' +
        'target="_blank" rel="noopener noreferrer">' +
        '前往 GitHub · 关注我' +
      '</a>' +
      '<div class="moon-profile-links">' +
        '<h3>我的博客</h3>' +
        '<a href="/">🏠 博客首页</a>' +
        '<a href="/archives/">📚 全部文章</a>' +
        '<a href="https://github.com/Moonrabbit07/Moonrabbit07.github.io" ' +
          'target="_blank" rel="noopener noreferrer">' +
          '⭐ 博客源码' +
        '</a>' +
      '</div>' +
    '</div>';

  sidebar.insertBefore(card, sidebar.firstChild);
})();
</script>
  `,
  "default"
);
