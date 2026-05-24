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
