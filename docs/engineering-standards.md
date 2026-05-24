# Engineering Standards

这份规范只针对当前 Astro 静态作品集项目。目标是让内容继续扩展、多人协作和后续接 CMS/CDN 时，不把页面、内容和媒体逻辑搅在一起。

## 当前技术边界

- Astro 是页面和组件主框架，默认 SSG。
- 当前没有 React/Vue/Svelte island，不新增前端框架来解决静态展示问题。
- Pannellum 只允许作为全景查看器按需加载，不进入首页初始主包。
- 内容源以 Astro Content Collections 为准，JSON 文件是当前 CMS 之前的内容接口。
- 本地图片走 `astro:assets`，全景原图和可公开直链素材走 `public/` 或未来 CDN。

## 必跑校验

提交前必须跑：

```bash
npm run verify
```

`verify` 包含 lint、格式、Astro 类型同步、TypeScript、架构边界校验、内容校验、构建和性能预算。任何内容、样式、脚本、图片引用变更都不能绕过它。

## 目录职责

- `src/pages/`：路由入口，只组合数据和页面级组件，不写复杂业务逻辑。
- `src/layouts/`：HTML 外壳、SEO 基础、全站脚本入口。
- `src/components/`：Astro 组件。优先服务具体页面，不提前做通用抽象。
- `src/data/`：把 Content Collections 转成页面可用的 view model。媒体解析也在这里收口。
- `src/content/`：内容数据。新增作品、视频、全景优先改这里。
- `src/scripts/`：浏览器增强脚本。只能处理真实交互，不承担内容拼装。
- `src/styles/partials/`：全站样式 partial。`tokens.css` 放设计变量，`base.css` 放 reset/base，`site.css` 放主视觉规则，`work-pages.css` 放档案页/作品详情页，`overlays.css` 放故事浮层/灯箱，`responsive.css` 放 viewport 和 reduced-motion 覆盖。
- `assets/`：由 Astro 优化的本地素材。
- `public/`：必须以原路径公开访问的文件，例如全景原图、poster、vendor 文件。
- `scripts/`：构建、内容校验、性能预算、发布前处理。

禁止从组件直接扫描文件系统或读取 JSON。页面需要的数据必须经过 `src/data/`。

## 组件规范

- 默认 Astro server component，不做客户端 hydration。
- 只有真实交互进入 `src/scripts/`，例如灯箱、档案筛选、全景启动、精选轮播。
- 不为静态展示新增 island。照片卡片、视频卡片、作品详情、联系区都不应该变成 React/Vue/Svelte 组件。
- 组件 props 保持页面需要的 view model，不把原始 content entry 整包传入深层组件。
- 删除无人引用的组件和配套样式。当前已经移除旧 `GalleryGrid`，后续不要再保留“备用组件”。

## 内容和媒体规范

媒体字段必须使用显式来源类型：

```json
{ "type": "local", "key": "photography/photo-01" }
```

```json
{ "type": "public", "url": "/panorama/pano-02.JPG" }
```

```json
{ "type": "remote", "url": "https://cdn.example.com/works/photo-01.jpg", "width": 2400, "height": 1600 }
```

规则：

- `local` 必须注册在 `src/data/media.ts`，并且 `assets/` 中存在实际文件。
- `public` 必须是 `/` 开头的公开路径，并且文件存在于 `public/`。
- `remote` 必须是绝对 URL，并且必须提供正整数 `width` 和 `height`。
- `local` 不允许写 `url` 或 `cdnUrl`，`public` 不允许写 `key` 或 `cdnUrl`，`remote` 不允许写 `key`。
- 内容文件名必须是小写英文、数字和连字符组成的 slug。
- 精选作品必须有唯一 `featuredOrder`，归档作品必须有唯一 `archiveOrder`。
- 视频和全景必须有唯一 `order`，视频 `externalUrl` 必须是完整 `http(s)` URL。
- 新增内容后跑 `npm run validate:content`，不要只依赖构建时报错。

## TypeScript 规范

- 禁止 `any`。内容类型优先从 Astro collection schema 推导。
- DTO/view model 放在 `src/data/` 或就近页面模块，不散落在组件里。
- `type` 优先用于组合、联合和推导类型；需要开放扩展的对象契约才使用 `interface`。
- 不使用 `enum`。内容状态用字符串 union，与 Zod schema 保持一致。
- 泛型只用于真实复用的数据转换，不为单个函数制造抽象。
- 运行时输入必须由 schema 或内容校验兜底，不能只靠 TypeScript。

## 样式规范

- 全局变量只放 `tokens.css`。
- 基础 reset/base 只放 `base.css`。
- 响应式覆盖只放 `responsive.css`，不要散回组件样式段中。
- `site.css` 继续按现有视觉系统维护。页面级规则已经拆到 `work-pages.css`，浮层规则已经拆到 `overlays.css`。
- 禁止新增大段重复 class 组合。出现第三次重复布局规则时，再考虑抽出共享选择器。
- 禁止为单次使用的视觉块抽象组件或 token。
- 移动端规则必须写在 `responsive.css`，避免桌面规则和覆盖规则交叉修改。
- 作品详情页、档案馆、故事浮层、灯箱的样式不要再写回 `site.css`。
- `npm run validate:architecture` 会检查样式归属、禁止未决策的 client hydration、禁止绕过 `src/data/` 直接读内容。

## 性能规范

- 首页主 JS 必须保持轻量，非首屏重交互按需 import。
- 全景查看器只能在用户点击后加载。
- 普通作品图通过 Astro 图片管线输出响应式资源。
- 全景原图允许大，但不能进入首页首屏加载。
- 每次构建必须通过 `npm run budget`。预算提高需要明确说明原因，不允许因为新增内容直接放宽。

## 工作流规范

- CI 使用 `.github/workflows/verify.yml`，保持和本地 `npm run verify` 一致。
- `.env` 和 `.env.*` 不入库，只保留 `.env.example`。
- 修改内容 schema 时，同步更新 `scripts/validate-content.mjs` 和 `src/content/README.md`。
- 修改媒体解析时，同步更新 `src/data/media.ts`、内容校验和 README 中的媒体说明。
- PR review 优先看：内容 schema 是否被绕过、是否新增不必要 hydration、是否引入首屏 JS、是否破坏性能预算。

## 现阶段不要做

- 不引入 Zustand、Nano Stores、Redux 或 Context。当前没有跨 island 状态需求。
- 不接 MDX，除非作品详情进入长文编辑阶段。
- 不引入 CMS 后台，除非内容维护频率明显超过 JSON 能承受的范围。
- 不把 `src/styles/partials/site.css` 一次性拆成很多文件。先拆稳定边界，再按实际冲突继续拆。
