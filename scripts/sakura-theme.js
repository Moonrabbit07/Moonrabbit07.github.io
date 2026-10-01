/* 春日庭院首页：注入样式和脚本，不改 Hexo 主题文件。 */
hexo.extend.injector.register(
  "head_end",
  '<link rel="stylesheet" href="/css/sakura.css">',
  "default"
);

hexo.extend.injector.register(
  "body_end",
  '<script defer src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>' +
    '<script defer src="https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.bundle.min.js"></script>' +
    '<script defer src="/js/sakura.js"></script>',
  "default"
);
