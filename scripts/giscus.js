/* global hexo */

/*
 * 只在文章详情页加载 giscus。
 * 评论框会放在文章卡片之后。
 */
hexo.extend.injector.register(
  "body_end",
  `
<script>
(function () {
  var article = document.querySelector("#main .article-type-post");
  if (!article) return;

  var comments = document.createElement("section");
  comments.className = "blog-comments";
  comments.setAttribute("aria-label", "文章评论");

  var heading = document.createElement("h2");
  heading.textContent = "评论与交流";
  comments.appendChild(heading);

  var description = document.createElement("p");
  description.textContent = "欢迎使用 GitHub 账号留言或为这篇文章添加表情反应。";
  comments.appendChild(description);

  article.insertAdjacentElement("afterend", comments);

  var giscus = document.createElement("script");
  giscus.src = "https://giscus.app/client.js";
  giscus.setAttribute("data-repo", "Moonrabbit07/Moonrabbit07.github.io");
  giscus.setAttribute("data-repo-id", "R_kgDOUlMvQg");
  giscus.setAttribute("data-category", "Announcements");
  giscus.setAttribute("data-category-id", "DIC_kwDOUlMvQs4DGlqs");
  giscus.setAttribute("data-mapping", "pathname");
  giscus.setAttribute("data-strict", "0");
  giscus.setAttribute("data-reactions-enabled", "1");
  giscus.setAttribute("data-emit-metadata", "1");
  giscus.setAttribute("data-input-position", "top");
  giscus.setAttribute("data-theme", "light");
  giscus.setAttribute("data-lang", "zh-CN");
  giscus.setAttribute("data-loading", "lazy");
  giscus.setAttribute("crossorigin", "anonymous");
  giscus.async = true;

  comments.appendChild(giscus);
})();
</script>
  `,
  "post"
);
