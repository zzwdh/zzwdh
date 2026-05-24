import type { ImageMetadata } from "astro";

import droneCloudRidge from "../../assets/drone/drone-01.jpg";
import droneMountainLayers from "../../assets/drone/drone-02.jpg";
import droneLightWhale from "../../assets/drone/drone-03.jpg";
import droneCloudLine from "../../assets/drone/drone-04.jpg";
import photoReflection from "../../assets/photography/photo-01.jpg";
import photoFieldPath from "../../assets/photography/photo-02.jpg";
import photoFieldPeople from "../../assets/photography/photo-03.jpg";
import photoMoonTrail from "../../assets/photography/photo-04.jpg";
import photoPair from "../../assets/photography/photo-06.jpg";
import photoLightEcho from "../../assets/photography/photo-09.jpg";
import photoRedStage from "../../assets/photography/photo-10.jpg";
import photoMistLake from "../../assets/photography/photo-11.jpg";
import photoSparkSpiral from "../../assets/photography/photo-12.jpg";
import photoWhiteDuck from "../../assets/photography/photo-13.jpg";
import photoLightCorridor from "../../assets/photography/photo-14.jpg";
import photoBirds from "../../assets/photography/photo-15.jpg";
import photoCityLine from "../../assets/photography/photo-16.jpg";
import photoCityClouds from "../../assets/photography/photo-17.jpg";
import photoStorm from "../../assets/photography/photo-18.jpg";
import photoLakeWalk from "../../assets/photography/photo-19.jpg";
import photoStageBlade from "../../assets/photography/photo-20.jpg";
import photoBirdsThroughBranches from "../../assets/photography/photo-21.jpg";
import photoBirdsClose from "../../assets/photography/photo-22.jpg";
import photoBirdsCampus from "../../assets/photography/photo-23.jpg";
import photoLakeWindow from "../../assets/photography/photo-24.jpg";
import wechatQr from "../../assets/profile/wechat-qr.jpg";

export const localImageAssets = {
  "drone/drone-01": droneCloudRidge,
  "drone/drone-02": droneMountainLayers,
  "drone/drone-03": droneLightWhale,
  "drone/drone-04": droneCloudLine,
  "photography/photo-01": photoReflection,
  "photography/photo-02": photoFieldPath,
  "photography/photo-03": photoFieldPeople,
  "photography/photo-04": photoMoonTrail,
  "photography/photo-06": photoPair,
  "photography/photo-09": photoLightEcho,
  "photography/photo-10": photoRedStage,
  "photography/photo-11": photoMistLake,
  "photography/photo-12": photoSparkSpiral,
  "photography/photo-13": photoWhiteDuck,
  "photography/photo-14": photoLightCorridor,
  "photography/photo-15": photoBirds,
  "photography/photo-16": photoCityLine,
  "photography/photo-17": photoCityClouds,
  "photography/photo-18": photoStorm,
  "photography/photo-19": photoLakeWalk,
  "photography/photo-20": photoStageBlade,
  "photography/photo-21": photoBirdsThroughBranches,
  "photography/photo-22": photoBirdsClose,
  "photography/photo-23": photoBirdsCampus,
  "photography/photo-24": photoLakeWindow,
  "profile/wechat-qr": wechatQr
} satisfies Record<string, ImageMetadata>;

export type LocalMediaKey = keyof typeof localImageAssets;

type MediaMeta = {
  width?: number;
  height?: number;
  alt?: string;
};

export type MediaAsset =
  | ({
      type: "local";
      key: string;
    } & MediaMeta)
  | ({
      type: "public";
      url: string;
    } & MediaMeta)
  | ({
      type: "remote";
      url: string;
      cdnUrl?: string;
      width: number;
      height: number;
    } & MediaMeta);

export type ResolvedMedia = {
  image?: ImageMetadata;
  imageUrl?: string;
  width?: number;
  height?: number;
  alt?: string;
};

export const isLocalMediaKey = (key: string): key is LocalMediaKey =>
  Object.prototype.hasOwnProperty.call(localImageAssets, key);

export const resolveMedia = (asset?: MediaAsset): ResolvedMedia => {
  if (!asset) return {};

  switch (asset.type) {
    case "local": {
      if (!isLocalMediaKey(asset.key)) {
        throw new Error(`Unknown local media key: ${asset.key}`);
      }

      return {
        image: localImageAssets[asset.key],
        width: asset.width,
        height: asset.height,
        alt: asset.alt
      };
    }
    case "public":
    case "remote":
      return {
        imageUrl: asset.type === "remote" ? (asset.cdnUrl ?? asset.url) : asset.url,
        width: asset.width,
        height: asset.height,
        alt: asset.alt
      };
  }
};

export const resolveAssetUrl = (asset?: MediaAsset) => {
  if (!asset || asset.type === "local") return "";
  return asset.type === "remote" ? (asset.cdnUrl ?? asset.url) : asset.url;
};
