# 邹羽轩个人影像作品集

这是一个 Astro 静态作品集网站，面向自有服务器部署。源码按组件和数据拆分，构建后输出到 `dist/`。

## 开发命令

```bash
npm install --cache /private/tmp/npm-cache
npm run dev
npm run build
npm run preview
npm run budget
```

如果本机 npm 用户缓存有权限问题，继续使用 `--cache /private/tmp/npm-cache` 即可。

## 内容维护

主要内容在 `src/data/site.ts`：

- 作品集：`works`，由 `photography` 和 `drone` 合并展示
- 首页精选：`featuredWorks`，只放第一眼要看的作品
- 档案馆：`archiveWorks`，生成 `/archive/` 和 `/works/[slug]/` 详情页
- 个人视频：`videos`，`externalUrl` 可选，没有链接时显示“待补链接”
- 360 全景：`panoramas`
- 免费在线全景查看器：`/panorama-viewer/`
- 姓名、邮箱、微信、社媒链接、简介：`site`

新增作品时，先把图片放进 `assets/` 对应目录，再在 `src/data/site.ts` 引入并添加到摄影或航拍数组。没有图片的项目可以保留 `placeholder`，页面会显示占位。

作品可以通过 `featured` 控制是否出现在首页，通过 `archive` 控制是否进入档案馆。详情页支持 `detail.style`，当前有 `line`、`story`、`technical`、`poetic`、`series` 五种说明样式。

## 素材规范

```text
assets/
  photography/photo-01.jpg
  drone/drone-01.jpg
  profile/wechat-qr.jpg

public/
  panorama/pano-02.JPG
  panorama/pano-02-web.jpg
  panorama/pano-02-poster.jpg
```

普通作品图片由 Astro 在构建时生成响应式图片和现代格式。360 度全景原图保留在 `public/panorama/`，首页只加载 `*-poster.jpg` 作为预览，用户点击后由 Pannellum 查看器按需打开原图。

全景原图通常很大。当前发布策略会把 `pano-02.JPG` 这类原图保留到 `dist/panorama/`，但不会进入首页初始加载。`*-web.jpg` 可以继续作为备用压缩版本，`*-poster.jpg` 用作预览。

## 性能预算

- 首屏图片 eager + high priority，其余图片 lazy。
- 普通作品图依赖 Astro 生成 `srcset`，避免直接把 6000px 原图发给所有设备。
- 首页除灯箱和全景外不引入重型前端框架。
- Pannellum 和它的样式只在用户点击全景按钮时加载。
- 构建后运行 `npm run budget`，检查首页有效载荷、普通图片、CSS、首页 JS、全景异步 JS，并单独检查全景原图体积。

## 未来扩展方向

- 全景：从单图升级为多点位 scene，增加热点、楼层/路线地图和项目独立分享页。
- 工具页：`/panorama-viewer/` 可继续增加热点标注、截图导出和多图场景切换。
- 内容：作品量变大后可迁移到 Astro Content Collections 或轻量 CMS，继续保持页面组件不动、只维护数据。
- 媒体：视频外链稳定后，可增加平台图标、精选短片页和结构化 SEO 数据。
- 部署：自有服务器建议加 CI 构建、资源体积检查、HTTPS 自动续期和定期备份。

## 自有服务器部署

构建：

```bash
npm run build
```

把 `dist/` 上传到服务器静态目录。`deploy/` 中提供了 Nginx 和 Caddy 示例配置：

- `deploy/nginx-portfolio.conf`
- `deploy/Caddyfile`

建议启用 HTTPS、gzip/brotli 或 zstd，并给 hash 静态资源设置长期缓存。
