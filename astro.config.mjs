import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import rehypeExternalLinks from 'rehype-external-links'
import rehypePresetMinify from 'rehype-preset-minify'
import react from '@astrojs/react'
import vercelStatic from '@astrojs/vercel/static'

const rehypeExternalLinksConfig = [
	rehypeExternalLinks,
	{ target: '_blank', rel: ['noopener', 'noreferrer'] }
]

export default defineConfig({
	site: 'https://kognise.dev/',
	output: 'static',
	adapter: vercelStatic(),
	server: {
		port: parseInt(process.env.PORT || '3000')
	},
	integrations: [
		mdx({
			smartypants: true,
			rehypePlugins: [ rehypeExternalLinksConfig, rehypePresetMinify ]
		}),
		sitemap(),
		react()
	],
	markdown: {
		smartypants: true,
		rehypePlugins: [ rehypeExternalLinksConfig ]
	}
});
