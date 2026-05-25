# Content Guide

这个目录是网站的内容层。页面会从这里读取数据，新增作品时尽量只改这里和 `assets/`，不要直接改组件。

## 目录

- `settings/site.json`：姓名、首屏、联系方式、社媒链接。
- `works/*.json`：照片和航拍作品，一张作品一份文件。
- `videos/*.json`：个人视频入口。
- `panoramas/*.json`：360 全景作品。

## 作品状态

- `featured: true`：出现在首页精选，最多建议 9 张。
- `featuredOrder`：首页精选顺序，精选作品必填且不能重复。
- `archive: true`：进入档案馆和作品详情页。
- `archiveOrder`：档案馆顺序，归档作品必填且不能重复。
- `storyStatus: "ready"`：详情页会出现“查看这张照片的故事”提示。
- `storyStatus: "draft"`：详情页保留正文，但不主动弹故事提示。
- `storyStatus: "hidden"`：不显示故事入口。

## 媒体来源

本地素材：

```json
{ "type": "local", "key": "photography/photo-01" }
```

公共目录素材：

```json
{ "type": "public", "url": "/panorama/pano-02.JPG" }
```

CDN / 对象存储素材：

```json
{
  "type": "remote",
  "url": "https://cdn.example.com/works/photo-01.jpg",
  "width": 2400,
  "height": 1600,
  "alt": "照片说明"
}
```

新增或改完内容后运行：

```bash
npm run validate:content
```

内容文件名必须是小写英文、数字和连字符组成的 slug。视频、全景的 `order` 也必须填写且不能重复；视频 `externalUrl` 必须是完整的 `http(s)` 外链。

## Pages CMS 后台

仓库根目录的 `.pages.yml` 已经配置 Pages CMS 托管版。登录 `https://app.pagescms.org/` 后连接 GitHub 仓库，即可编辑作品、视频、全景和站点设置。

后台新增作品时：

- 文件名继续使用小写英文、数字和连字符组成的 slug。
- 现有素材继续使用 `local` + `key`，不要改动 `assets/` 与 `src/data/media.ts` 的关系。
- 后台新上传图片使用 `public` 类型，图片会进入 `public/uploads/`，内容里保存为 `/uploads/...`。
- 360 全景仍优先使用 `public/panorama/`，不要把未压缩的大原图上传到 `public/uploads/`。
- 保存后等待 GitHub `Verify` 检查通过，再发布服务器上的 `dist/`。

后台上传图片前先压缩到网页尺寸。`npm run budget` 会检查 `dist/uploads/`，单张后台上传图片超过 3 MB 或总量超过 30 MB 会失败。
