import { getCollection, getEntry } from "astro:content";
import type { ImageMetadata } from "astro";
import { resolveAssetUrl, resolveMedia, type MediaAsset } from "./media";

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
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  alt: string;
  description: string;
  label: string;
  layout?: "wide" | "tall";
  placeholder?: string;
  featured: boolean;
  featuredOrder?: number;
  archive: boolean;
  archiveOrder?: number;
  storyStatus: "draft" | "ready" | "hidden";
  detail: WorkDetail;
  tags?: string[];
};

export type VideoItem = {
  title: string;
  image?: ImageMetadata;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  alt: string;
  description: string;
  label: string;
  placeholder?: string;
  externalUrl?: string;
  order?: number;
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

export type SiteSettings = {
  title: string;
  navTitle: string;
  name: string;
  role: string;
  eyebrow: string;
  email: string;
  wechat: string;
  socials: SocialLink[];
  heroImage?: ImageMetadata;
  heroImageUrl?: string;
  heroImageWidth?: number;
  heroImageHeight?: number;
  heroAlt: string;
  heroCopy: string;
  aboutTitle: string;
  aboutCopy: string;
  wechatQr?: ImageMetadata;
  wechatQrUrl?: string;
};

const byOptionalOrder =
  <T extends { featuredOrder?: number; archiveOrder?: number; title: string }>(key: "featuredOrder" | "archiveOrder") =>
  (a: T, b: T) =>
    (a[key] ?? 9999) - (b[key] ?? 9999) || a.title.localeCompare(b.title, "zh-CN");

const mapImage = (asset: MediaAsset | undefined, fallbackAlt: string) => {
  const media = resolveMedia(asset);
  return {
    image: media.image,
    imageUrl: media.imageUrl,
    imageWidth: media.width,
    imageHeight: media.height,
    alt: media.alt ?? asset?.alt ?? fallbackAlt
  };
};

export const getSite = async (): Promise<SiteSettings> => {
  const entry = await getEntry("settings", "site");
  if (!entry) throw new Error("Missing settings/site.json");

  const hero = mapImage(entry.data.heroImage, entry.data.heroAlt);
  const qr = mapImage(entry.data.wechatQr, "微信二维码");

  return {
    ...entry.data,
    heroImage: hero.image,
    heroImageUrl: hero.imageUrl,
    heroImageWidth: hero.imageWidth,
    heroImageHeight: hero.imageHeight,
    wechatQr: qr.image,
    wechatQrUrl: qr.imageUrl
  };
};

export const getWorks = async (): Promise<WorkItem[]> => {
  const entries = await getCollection("works");

  return entries
    .map((entry) => {
      const image = mapImage(entry.data.image, entry.data.alt);
      return {
        slug: entry.id,
        title: entry.data.title,
        category: entry.data.category,
        ...image,
        description: entry.data.description,
        label: entry.data.label,
        layout: entry.data.layout,
        featured: entry.data.featured,
        featuredOrder: entry.data.featuredOrder,
        archive: entry.data.archive,
        archiveOrder: entry.data.archiveOrder,
        storyStatus: entry.data.storyStatus,
        detail: {
          style: entry.data.detail.style,
          eyebrow: entry.data.detail.eyebrow,
          headline: entry.data.detail.headline,
          paragraphs: entry.data.detail.paragraphs,
          meta: entry.data.detail.meta
        },
        tags: entry.data.tags
      };
    })
    .sort(byOptionalOrder("archiveOrder"));
};

export const getFeaturedWorks = async () =>
  (await getWorks())
    .filter((item) => item.featured)
    .sort(byOptionalOrder("featuredOrder"))
    .slice(0, 9);

export const getArchiveWorks = async () =>
  (await getWorks()).filter((item) => item.archive && (item.image || item.imageUrl));

export const getVideos = async (): Promise<VideoItem[]> => {
  const entries = await getCollection("videos");

  return entries
    .map((entry) => {
      const image = mapImage(entry.data.image, entry.data.alt);
      return {
        title: entry.data.title,
        ...image,
        description: entry.data.description,
        label: entry.data.label,
        placeholder: entry.data.placeholder,
        externalUrl: entry.data.externalUrl,
        order: entry.data.order
      };
    })
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999) || a.title.localeCompare(b.title, "zh-CN"));
};

export const getPanoramas = async (): Promise<PanoramaItem[]> => {
  const entries = await getCollection("panoramas");

  return entries
    .map((entry) => ({
      slug: entry.id,
      title: entry.data.title,
      panoramaUrl: resolveAssetUrl(entry.data.panorama),
      previewUrl: resolveAssetUrl(entry.data.preview),
      alt: entry.data.alt,
      description: entry.data.description,
      initialYaw: entry.data.initialYaw,
      initialPitch: entry.data.initialPitch,
      order: entry.data.order
    }))
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999) || a.title.localeCompare(b.title, "zh-CN"));
};
