import { defineCollection, z } from 'astro:content';

export const collections = {
  firewood: defineCollection({
    schema: z.object({
      title: z.string(),
      editDate: z.date().transform((date) => new Date(date)),
      woodTypes: z.array(z.string()),
      dryWoods: z.array(z.string()),
      wetWoods: z.array(z.string()),
      humidity: z.number(),
      logLength: z.array(z.string()),
      logThickness: z.array(z.string()),
      packaging: z.object({
        truck: z.array(z.number()),
        summer: z.array(z.number()),
        winter: z.array(z.number()),
      }),
      dimensions: z.object({
        length: z.number(),
        height: z.number(),
        width: z.number(),
        excess: z.number(),
      }),
    }),
  }),
  pellet: defineCollection({
    schema: z.object({
      title: z.string(),
      woodType: z.object({
        name: z.string(),
        percentage: z.string()
      }).array().optional(),
      ashPercentage: z.string(),
      caloricValue: z.string(),
      humidity: z.string(),
      diameter: z.string(),
      packaging: z.object({
        quantity: z.number(),
        weight: z.string()
      }).array()
    })
  }),
  briquette: defineCollection({
    schema: z.object({
      title: z.string(),
      length: z.string(),
      width: z.string(),
      height: z.string(),
      caloricValue: z.string(),
      packaging: z.object({
        quantity: z.string(),
        weight: z.string()
      }).array(),
      composition: z.array(z.string()),
      woodTypes: z.object({
        name: z.string(),
        woods: z.array(z.string())
      }).array()
    }),
  }),
  parquette : defineCollection({
    schema : z.object({
      title: z.string(),
      woodType: z.string(),
      thickness: z.array(z.string()),
      lengthWidth : z.array(z.string()),
    })
  }),
};
