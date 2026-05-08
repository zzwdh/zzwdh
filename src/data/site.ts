import type { ImageMetadata } from "astro";

import droneCloudRidge from "../../assets/drone/drone-01.jpg";
import droneMountainLayers from "../../assets/drone/drone-02.jpg";
import photoReflection from "../../assets/photography/photo-01.jpg";
import photoFieldPath from "../../assets/photography/photo-02.jpg";
import photoFieldPeople from "../../assets/photography/photo-03.jpg";
import photoQuietFrame from "../../assets/photography/photo-04.jpg";
import photoUntitledSix from "../../assets/photography/photo-06.jpg";
import photoUntitledNine from "../../assets/photography/photo-09.jpg";
import photoUntitledTen from "../../assets/photography/photo-10.jpg";
import photoUntitledEleven from "../../assets/photography/photo-11.jpg";
import photoUntitledTwelve from "../../assets/photography/photo-12.jpg";
import photoUntitledThirteen from "../../assets/photography/photo-13.jpg";
import photoUntitledFourteen from "../../assets/photography/photo-14.jpg";
import photoUntitledFifteen from "../../assets/photography/photo-15.jpg";
import photoUntitledSixteen from "../../assets/photography/photo-16.jpg";
import photoUntitledSeventeen from "../../assets/photography/photo-17.jpg";
import photoUntitledEighteen from "../../assets/photography/photo-18.jpg";
import photoUntitledNineteen from "../../assets/photography/photo-19.jpg";
import droneUntitledThree from "../../assets/drone/drone-03.jpg";
import droneUntitledFour from "../../assets/drone/drone-04.jpg";
import wechatQr from "../../assets/profile/wechat-qr.jpg";

export type WorkCategory = "photography" | "drone";
export type DetailStyle = "line" | "story" | "technical" | "poetic" | "series";

export type DetailMeta = {
  label: string;
  value: string;
};

export type WorkDetail = {
  style: DetailStyle;
  eyebrow?: string;
  headline?: string;
  paragraphs: string[];
  meta?: DetailMeta[];
};

export type WorkItem = {
  slug: string;
  title: string;
  category: WorkCategory;
  image?: ImageMetadata;
  alt: string;
  description: string;
  label: string;
  layout?: "wide" | "tall";
  placeholder?: string;
  featured: boolean;
  archive: boolean;
  detail: WorkDetail;
  tags?: string[];
};

export type VideoItem = {
  title: string;
  image?: ImageMetadata;
  alt: string;
  description: string;
  label: string;
  placeholder?: string;
  externalUrl?: string;
};

export type PanoramaItem = {
  slug: string;
  title: string;
  panoramaUrl: string;
  previewUrl: string;
  alt: string;
  description: string;
  initialYaw: number;
  initialPitch: number;
};

export type SocialLink = {
  label: string;
  value: string;
  href?: string;
};

const photoMeta = (year = "2026", location = "未标注地点"): DetailMeta[] => [
  { label: "年份", value: year },
  { label: "地点", value: location }
];

export const site = {
  title: "邹羽轩 | 影像作品集",
  navTitle: "影像作品集",
  name: "邹羽轩",
  role: "个人影像作品集",
  eyebrow: "PHOTOS / MOTION / 360",
  email: "zzwdh1417857813@outlook.com",
  wechat: "adad12657",
  socials: [
    {
      label: "Bilibili",
      value: "space.bilibili.com/441613181",
      href: "https://space.bilibili.com/441613181"
    },
    {
      label: "小红书",
      value: "xhslink.com/m/5FaMFmWSc3k",
      href: "https://xhslink.com/m/5FaMFmWSc3k"
    },
    {
      label: "抖音",
      value: "52786965973"
    }
  ],
  heroImage: photoUntitledSeventeen,
  heroAlt: "个人影像作品代表照片",
  heroCopy: "一些照片。一点全景。还有我看世界时，按下快门的那一秒。",
  aboutTitle: "拍得少一点，记得久一点。",
  aboutCopy: "我把光、颜色和偶然经过的人，收进画面里。",
  wechatQr
};

export const photography: WorkItem[] = [
  {
    slug: "water-reflection",
    title: "水面枝影",
    category: "photography",
    image: photoReflection,
    alt: "水面枝影摄影作品",
    description: "水面很安静，树枝轻轻乱了一下。",
    label: "REFLECTION",
    layout: "wide",
    featured: true,
    archive: true,
    detail: {
      style: "poetic",
      eyebrow: "QUIET WATER",
      headline: "风停下来的时候，水面替树枝说话。",
      paragraphs: ["这张照片不急着解释什么。它只是把一小段安静留下来。"],
      meta: photoMeta()
    },
    tags: ["水面", "枝影", "安静"]
  },
  {
    slug: "field-path",
    title: "花田路径",
    category: "photography",
    image: photoFieldPath,
    alt: "花田路径摄影作品",
    description: "一条路穿过去，颜色就有了方向。",
    label: "FIELD 01",
    featured: true,
    archive: true,
    detail: {
      style: "story",
      eyebrow: "FIELD NOTE",
      headline: "花开得很多，路只留一条。",
      paragraphs: [
        "我喜欢这张里的秩序感。颜色铺得很满，但人的视线不会迷路。",
        "路径把画面轻轻切开，也把远处的城市留在了边上。"
      ],
      meta: photoMeta()
    },
    tags: ["花田", "路径", "秩序"]
  },
  {
    slug: "field-people",
    title: "花海人物",
    category: "photography",
    image: photoFieldPeople,
    alt: "花海人物摄影作品",
    description: "人在花海里出现一下，画面就有了尺度。",
    label: "FIELD 02",
    featured: true,
    archive: true,
    detail: {
      style: "line",
      eyebrow: "A PERSON IN COLOR",
      headline: "人很小。颜色很大。",
      paragraphs: ["我按下快门，是因为这个比例刚刚好。"],
      meta: photoMeta()
    },
    tags: ["人物", "花海", "尺度"]
  },
  {
    slug: "quiet-frame",
    title: "未命名 04",
    category: "photography",
    image: photoQuietFrame,
    alt: "未命名摄影作品 04",
    description: "先收进档案馆，名字以后慢慢想。",
    label: "PHOTO 04",
    featured: true,
    archive: true,
    detail: {
      style: "line",
      eyebrow: "UNTITLED 04",
      headline: "有些照片，先不命名也没关系。",
      paragraphs: ["它已经在这里了。名字可以晚一点来。"],
      meta: photoMeta("2025")
    },
    tags: ["未命名", "日常"]
  },
  {
    slug: "untitled-six",
    title: "未命名 06",
    category: "photography",
    image: photoUntitledSix,
    alt: "未命名摄影作品 06",
    description: "留给一段更短的说明。",
    label: "PHOTO 06",
    featured: false,
    archive: true,
    detail: {
      style: "poetic",
      eyebrow: "UNTITLED 06",
      headline: "短一点。也可以记很久。",
      paragraphs: ["画面已经说了大半。"],
      meta: photoMeta("2025")
    },
    tags: ["未命名", "短句"]
  },
  {
    slug: "untitled-nine",
    title: "未命名 09",
    category: "photography",
    image: photoUntitledNine,
    alt: "未命名摄影作品 09",
    description: "放进档案馆的一页。",
    label: "PHOTO 09",
    featured: false,
    archive: true,
    detail: {
      style: "series",
      eyebrow: "ARCHIVE PAGE",
      headline: "它属于这个小小的系列。",
      paragraphs: ["以后如果同主题照片变多，这里可以升级成系列页。"],
      meta: photoMeta("2025")
    },
    tags: ["档案", "系列"]
  },
  {
    slug: "untitled-ten",
    title: "未命名 10",
    category: "photography",
    image: photoUntitledTen,
    alt: "未命名摄影作品 10",
    description: "暂时叫十号照片。",
    label: "PHOTO 10",
    featured: false,
    archive: true,
    detail: {
      style: "line",
      eyebrow: "PHOTO 10",
      headline: "先叫十号。以后再给它一个更好的名字。",
      paragraphs: ["档案馆允许作品慢慢长出标题。"],
      meta: photoMeta("2025")
    },
    tags: ["档案"]
  },
  {
    slug: "untitled-eleven",
    title: "未命名 11",
    category: "photography",
    image: photoUntitledEleven,
    alt: "未命名摄影作品 11",
    description: "新放进档案馆的一张照片。",
    label: "PHOTO 11",
    layout: "wide",
    featured: true,
    archive: true,
    detail: {
      style: "story",
      eyebrow: "PHOTO 11",
      headline: "这张照片刚刚住进档案馆。",
      paragraphs: ["它先以画面的方式出现。等我想好那天发生了什么，再把故事写得更完整。"],
      meta: photoMeta("2026")
    },
    tags: ["新作", "档案"]
  },
  {
    slug: "untitled-twelve",
    title: "未命名 12",
    category: "photography",
    image: photoUntitledTwelve,
    alt: "未命名摄影作品 12",
    description: "一张新的停顿。",
    label: "PHOTO 12",
    featured: true,
    archive: true,
    detail: {
      style: "poetic",
      eyebrow: "PHOTO 12",
      headline: "把停顿留在这里。",
      paragraphs: ["有些画面不需要很快被说清。它先存在，文字慢慢靠近。"],
      meta: photoMeta("2026")
    },
    tags: ["新作", "短句"]
  },
  {
    slug: "untitled-thirteen",
    title: "未命名 13",
    category: "photography",
    image: photoUntitledThirteen,
    alt: "未命名摄影作品 13",
    description: "又一张被收进来的照片。",
    label: "PHOTO 13",
    featured: true,
    archive: true,
    detail: {
      style: "line",
      eyebrow: "PHOTO 13",
      headline: "先放进来。",
      paragraphs: ["等故事到了，再给它一个更具体的名字。"],
      meta: photoMeta("2026")
    },
    tags: ["新作", "未命名"]
  },
  {
    slug: "untitled-fourteen",
    title: "未命名 14",
    category: "photography",
    image: photoUntitledFourteen,
    alt: "未命名摄影作品 14",
    description: "档案馆里的第十四张。",
    label: "PHOTO 14",
    featured: false,
    archive: true,
    detail: {
      style: "series",
      eyebrow: "PHOTO 14",
      headline: "它可能会成为某个系列的一部分。",
      paragraphs: ["如果以后同一类画面越来越多，这里可以继续长成一个小系列。"],
      meta: photoMeta("2026")
    },
    tags: ["档案", "系列"]
  },
  {
    slug: "untitled-fifteen",
    title: "未命名 15",
    category: "photography",
    image: photoUntitledFifteen,
    alt: "未命名摄影作品 15",
    description: "暂时不命名，只保留画面。",
    label: "PHOTO 15",
    featured: false,
    archive: true,
    detail: {
      style: "story",
      eyebrow: "PHOTO 15",
      headline: "名字可以晚一点到。",
      paragraphs: ["照片已经在这里了。真正重要的，是那一刻为什么让我停下来。"],
      meta: photoMeta("2026")
    },
    tags: ["档案"]
  },
  {
    slug: "untitled-sixteen",
    title: "未命名 16",
    category: "photography",
    image: photoUntitledSixteen,
    alt: "未命名摄影作品 16",
    description: "竖幅新作，放进档案馆。",
    label: "PHOTO 16",
    layout: "tall",
    featured: false,
    archive: true,
    detail: {
      style: "technical",
      eyebrow: "PHOTO 16",
      headline: "竖幅让视线从上往下慢慢走。",
      paragraphs: ["这张之后可以补充拍摄地点、构图选择，或者那天的光线。"],
      meta: [
        ...photoMeta("2026"),
        { label: "版式", value: "竖幅" }
      ]
    },
    tags: ["竖幅", "档案"]
  },
  {
    slug: "untitled-seventeen",
    title: "未命名 17",
    category: "photography",
    image: photoUntitledSeventeen,
    alt: "未命名摄影作品 17",
    description: "一张横向展开的画面。",
    label: "PHOTO 17",
    featured: false,
    archive: true,
    detail: {
      style: "poetic",
      eyebrow: "PHOTO 17",
      headline: "画面铺开，故事还没急着说。",
      paragraphs: ["我先把它放在档案馆里。以后再把那天的细节补上。"],
      meta: photoMeta("2026")
    },
    tags: ["横幅", "新作"]
  },
  {
    slug: "untitled-eighteen",
    title: "未命名 18",
    category: "photography",
    image: photoUntitledEighteen,
    alt: "未命名摄影作品 18",
    description: "又一页新的档案。",
    label: "PHOTO 18",
    featured: false,
    archive: true,
    detail: {
      style: "line",
      eyebrow: "PHOTO 18",
      headline: "这一页先留白。",
      paragraphs: ["说明会来。现在先看照片。"],
      meta: photoMeta("2026")
    },
    tags: ["档案", "留白"]
  },
  {
    slug: "untitled-nineteen",
    title: "未命名 19",
    category: "photography",
    image: photoUntitledNineteen,
    alt: "未命名摄影作品 19",
    description: "新收进来的最后一张。",
    label: "PHOTO 19",
    featured: false,
    archive: true,
    detail: {
      style: "story",
      eyebrow: "PHOTO 19",
      headline: "这张照片也会有自己的故事。",
      paragraphs: ["暂时先把位置留好。等你写下说明，它就会从占位的文字变成真正的注脚。"],
      meta: photoMeta("2026")
    },
    tags: ["新作", "故事"]
  }
];

export const drone: WorkItem[] = [
  {
    slug: "cloud-ridge",
    title: "云海山脊",
    category: "drone",
    image: droneCloudRidge,
    alt: "云海山脊航拍作品",
    description: "云在低处，山脊像一条慢慢展开的线。",
    label: "CLOUD RIDGE",
    layout: "wide",
    featured: true,
    archive: true,
    detail: {
      style: "technical",
      eyebrow: "AERIAL VIEW",
      headline: "从空中看，山会变成线。",
      paragraphs: ["这类照片适合记录视角、飞行高度、天气和地形关系。"],
      meta: [
        ...photoMeta("2026"),
        { label: "类型", value: "航拍" },
        { label: "说明样式", value: "技术型" }
      ]
    },
    tags: ["航拍", "云海", "山脊"]
  },
  {
    slug: "mountain-layers",
    title: "远山云层",
    category: "drone",
    image: droneMountainLayers,
    alt: "远山云层航拍作品",
    description: "远山一层一层，云把距离变软。",
    label: "MOUNTAIN LAYERS",
    featured: true,
    archive: true,
    detail: {
      style: "poetic",
      eyebrow: "LAYERS",
      headline: "远处的山，像被云轻轻折起来。",
      paragraphs: ["航拍有时不是为了更高，而是为了看见层次。"],
      meta: [
        ...photoMeta("2026"),
        { label: "类型", value: "航拍" }
      ]
    },
    tags: ["航拍", "远山", "云层"]
  },
  {
    slug: "aerial-three",
    title: "航拍 03",
    category: "drone",
    image: droneUntitledThree,
    alt: "航拍作品 03",
    description: "第三张航拍，先收进作品集。",
    label: "DRONE 03",
    featured: true,
    archive: true,
    detail: {
      style: "technical",
      eyebrow: "AERIAL 03",
      headline: "从高处看，画面会自动安静一点。",
      paragraphs: ["这里可以补充飞行高度、天气、地点，或者为什么选择这个视角。"],
      meta: [
        ...photoMeta("2026"),
        { label: "类型", value: "航拍" }
      ]
    },
    tags: ["航拍", "新作"]
  },
  {
    slug: "aerial-four",
    title: "航拍 04",
    category: "drone",
    image: droneUntitledFour,
    alt: "航拍作品 04",
    description: "更宽的一张航拍。",
    label: "DRONE 04",
    layout: "wide",
    featured: true,
    archive: true,
    detail: {
      style: "poetic",
      eyebrow: "AERIAL 04",
      headline: "视野一宽，时间也像被拉长了。",
      paragraphs: ["航拍有时不是为了看得更多，而是为了让空间自己说话。"],
      meta: [
        ...photoMeta("2026"),
        { label: "类型", value: "航拍" }
      ]
    },
    tags: ["航拍", "宽幅"]
  }
];

export const works: WorkItem[] = [...photography, ...drone];
export const featuredWorks = works.filter((item) => item.featured);
export const archiveWorks = works.filter((item) => item.archive && item.image);

export const videos: VideoItem[] = [
  {
    title: "生活片段",
    alt: "视频作品封面 01 待补",
    description: "一些走走停停的动态记录，等我把它剪好。",
    label: "MOMENTS",
    placeholder: "待放入视频"
  },
  {
    title: "旅行记录",
    alt: "视频作品封面 02 待补",
    description: "路上的风、光和人声，先留一个位置。",
    label: "TRAVEL",
    placeholder: "待放入视频"
  },
  {
    title: "动态影像",
    alt: "视频作品封面 03 待补",
    description: "照片之外，那些稍纵即逝的几秒钟。",
    label: "MOTION",
    placeholder: "待放入视频"
  }
];

export const panoramas: PanoramaItem[] = [
  {
    slug: "panorama-02",
    title: "全景 02",
    panoramaUrl: "/panorama/pano-02.JPG",
    previewUrl: "/panorama/pano-02-poster.jpg",
    alt: "360度全景照片 02",
    description: "第一张全景。打开后直接进入原图浏览。",
    initialYaw: 0,
    initialPitch: 0
  },
  {
    slug: "panorama-03",
    title: "全景 03",
    panoramaUrl: "/panorama/pano-03.JPG",
    previewUrl: "/panorama/pano-03-poster.jpg",
    alt: "360度全景照片 03",
    description: "第二张全景。保留原始细节，按需加载。",
    initialYaw: 0,
    initialPitch: 0
  }
];
