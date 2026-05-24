/// <reference types="astro/client" />

declare module "*.JPG" {
  import type { ImageMetadata } from "astro";

  const metadata: ImageMetadata;
  export default metadata;
}

declare module "pannellum" {
  export type ViewerConfig = {
    type: "equirectangular" | "cubemap" | "multires";
    panorama?: string;
    autoLoad?: boolean;
    autoRotate?: number;
    compass?: boolean;
    hfov?: number;
    yaw?: number;
    pitch?: number;
    preview?: string;
    showControls?: boolean;
  };

  export function viewer(container: string | HTMLElement, config: ViewerConfig): unknown;
}
