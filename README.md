# 邹羽轩个人影像作品集

这是一个 Astro 静态作品集网站，面向自有服务器部署。源码按组件和数据拆分，构建后输出到 `dist/`。

## 开发命令

```bash
npm install --cache /private/tmp/npm-cache
npm run dev
npm run build
npm run preview
npm run verify
npm run validate:architecture
npm run validate:content
npm run budget
```

如果本机 npm 用户缓存有权限问题，继续使用 `--cache /private/tmp/npm-cache` 即可。

工程协作规则见 `docs/engineering-standards.md`。提交前以 `npm run verify` 为准。

## 内容维护

主要内容已经迁到 Astro Content Collections：

- 作品：`src/content/works/*.json`，一张照片一份文件。
- 个人视频：`src/content/videos/*.json`，`externalUrl` 可选。
- 360 全景：`src/content/panoramas/*.json`，支持预览图和原图分离。
- 站点配置：`src/content/settings/site.json`，维护姓名、邮箱、微信、社媒、首屏文案等。

新增作品时，先把图片放进 `assets/photography/` 或 `assets/drone/`，再复制一份 `src/content/works/` 里的 JSON 改内容。`featured` 控制是否上首页精选，`archive` 控制是否进入档案馆，`storyStatus: "ready"` 才会在详情页显示“查看这张照片的故事”提示。

也可以通过 Pages CMS 托管版维护内容。根目录 `.pages.yml` 已经配置作品、视频、全景和站点设置四组入口。登录 `https://app.pagescms.org/` 并连接 GitHub 仓库 `zzwdh/zzwdh` 的 `main` 分支后，即可在浏览器里编辑这些 JSON 内容。

Pages CMS 新上传的普通图片会进入 `public/uploads/`，内容字段保存为：

```json
{ "type": "public", "url": "/uploads/example.jpg" }
```

现有 `assets/` 图片继续使用 `local` + `key`，不要在后台里改成 `/uploads/`。后台上传前先压缩图片；构建预算会检查 `dist/uploads/`，单张上传图超过 3 MB 或总量超过 30 MB 会失败。

图片字段已经按对象存储/CDN 设计。现在可以继续用本地素材：

```json
{ "type": "local", "key": "photography/photo-01" }
```

以后迁到 Cloudflare R2、阿里云 OSS 或其他 CDN 时，可以改成：

```json
{ "type": "remote", "url": "https://cdn.example.com/works/photo-01.jpg", "width": 2400, "height": 1600 }
```

详情页支持 `detail.style`，当前有 `line`、`story`、`technical`、`poetic`、`series` 五种说明样式。新增照片后建议运行 `npm run validate:content`，它会检查 slug、缺图、精选数量、故事状态和全景配置。

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
- 构建后运行 `npm run budget`，分别检查首页、档案馆、作品详情、CSS、首页 JS、全景异步 JS、普通图片和全景原图。

不要把对象存储密钥写进仓库。全景原图和大作品图后续建议上传到对象存储/CDN，只在内容文件里保留公开访问 URL。

## 未来扩展方向

- 全景：从单图升级为多点位 scene，增加热点、楼层/路线地图和项目独立分享页。
- 内容：年份筛选、项目合集页、更细的故事模板，或等编辑后台生态兼容 Astro 6 后再接入轻量 CMS。
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
