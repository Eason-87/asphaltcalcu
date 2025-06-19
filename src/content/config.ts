import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    image: z.string(),
    subtitle: z.string(),
    tag: z.string(),
  }),
});

export const collections = {
  blog: blogCollection,
};
