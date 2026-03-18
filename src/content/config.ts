// src/content/config.ts — Astro Content Collections
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string().max(60),
    description: z.string().min(120).max(160),
    pubDate:     z.coerce.date(),
    keywords:    z.array(z.string()).default([]),
    author:      z.string().default('Lịch Vạn Niên AI'),
    ogImage:     z.string().optional(),
    draft:       z.boolean().default(false),
  }),
});

export const collections = { blog };
