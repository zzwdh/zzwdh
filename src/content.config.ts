import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const mediaMeta = {
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  alt: z.string().optional()
};

const localMediaAsset = z
  .object({
    type: z.literal("local"),
    key: z.string().min(1),
    ...mediaMeta
  })
  .strict();

const publicMediaAsset = z
  .object({
    type: z.literal("public"),
    url: z.string().min(1),
    ...mediaMeta
  })
  .strict();

const remoteMediaAsset = z
  .object({
    type: z.literal("remote"),
    url: z.string().url(),
    cdnUrl: z.string().url().optional(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    alt: z.string().optional()
  })
  .strict();

const mediaAsset = z.discriminatedUnion("type", [localMediaAsset, publicMediaAsset, remoteMediaAsset]);

const detailMeta = z.object({
  label: z.string(),
  value: z.string()
});

const works = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/works" }),
  schema: z.object({
    title: z.string(),
    category: z.enum(["photography", "drone"]),
    image: mediaAsset.optional(),
    alt: z.string(),
    description: z.string(),
    label: z.string(),
    layout: z.enum(["wide", "tall"]).optional(),
    featured: z.boolean().default(false),
    featuredOrder: z.number().int().positive().optional(),
    archive: z.boolean().default(true),
    archiveOrder: z.number().int().positive().optional(),
    storyStatus: z.enum(["draft", "ready", "hidden"]).default("draft"),
    detail: z.object({
      style: z.enum(["line", "story", "technical", "poetic", "series"]),
      eyebrow: z.string().optional(),
      headline: z.string().optional(),
      paragraphs: z.array(z.string()).default([]),
      meta: z.array(detailMeta).default([])
    }),
    tags: z.array(z.string()).default([])
  })
});

const videos = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/videos" }),
  schema: z.object({
    title: z.string(),
    image: mediaAsset.optional(),
    alt: z.string(),
    description: z.string(),
    label: z.string(),
    placeholder: z.string().optional(),
    externalUrl: z.string().url().optional(),
    order: z.number().int().positive().optional()
  })
});

const panoramas = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/panoramas" }),
  schema: z.object({
    title: z.string(),
    panorama: mediaAsset,
    preview: mediaAsset,
    alt: z.string(),
    description: z.string(),
    initialYaw: z.number().default(0),
    initialPitch: z.number().default(0),
    order: z.number().int().positive().optional()
  })
});

const settings = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/settings" }),
  schema: z.object({
    title: z.string(),
    navTitle: z.string(),
    name: z.string(),
    role: z.string(),
    eyebrow: z.string(),
    email: z.string(),
    wechat: z.string(),
    icpNumber: z.string().optional(),
    icpUrl: z.string().url().optional(),
    socials: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        href: z.string().optional()
      })
    ),
    heroImage: mediaAsset,
    heroAlt: z.string(),
    heroCopy: z.string(),
    aboutTitle: z.string(),
    aboutCopy: z.string(),
    wechatQr: mediaAsset
  })
});

export const collections = {
  works,
  videos,
  panoramas,
  settings
};
