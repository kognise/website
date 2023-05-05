import { z, defineCollection } from 'astro:content'

export const collections = {
	writing: defineCollection({
		schema: z.object({
			title: z.string(),
			abstract: z.string(),
			date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
			banner: z.object({
				url: z.string(),
				alt: z.string(),
				width: z.number(),
				height: z.number()
			}).optional(),
			draft: z.boolean().optional(),
			'tab-size': z.number().optional()
		})
	})
}
