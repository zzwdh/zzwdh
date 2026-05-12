import type { ImageMetadata } from "astro";

export type MediaAsset = {
  type?: "local" | "public" | "remote";
  key?: string;
  url?: string;
  cdnUrl?: string;
  width?: number;
  height?: number;
  alt?: string;
};

export type ResolvedMedia = {
  image?: ImageMetadata;
  imageUrl?: string;
  width?: number;
  height?: number;
  alt?: string;
};

const localImageModules = {
  ...import.meta.glob<{ default: ImageMetadata }>("../../assets/photography/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP}", {
    eager: true
  }),
  ...import.meta.glob<{ default: ImageMetadata }>("../../assets/drone/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP}", {
    eager: true
  }),
  ...import.meta.glob<{ default: ImageMetadata }>("../../assets/profile/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP}", {
    eager: true
  })
};

export const localImageAssets = Object.fromEntries(
  Object.entries(localImageModules).map(([path, module]) => [
    path.replace("../../assets/", "").replace(/\.(jpe?g|png|webp)$/i, ""),
    module.default
  ])
) as Record<string, ImageMetadata>;

export const resolveMedia = (asset?: MediaAsset): ResolvedMedia => {
  if (!asset) return {};

  const imageUrl = asset.cdnUrl ?? asset.url;
  if (asset.type === "remote" || asset.type === "public" || imageUrl) {
    return {
      imageUrl,
      width: asset.width,
      height: asset.height,
      alt: asset.alt
    };
  }

  if (asset.key) {
    return {
      image: localImageAssets[asset.key as keyof typeof localImageAssets],
      width: asset.width,
      height: asset.height,
      alt: asset.alt
    };
  }

  return {};
};

export const resolveAssetUrl = (asset?: MediaAsset) => asset?.cdnUrl ?? asset?.url ?? "";
