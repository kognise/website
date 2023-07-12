import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import rehypeExternalLinks from 'rehype-external-links'
import rehypePresetMinify from 'rehype-preset-minify'
import react from '@astrojs/react'
import vercelServerless from '@astrojs/vercel/serverless'

const rehypeExternalLinksConfig = [
	rehypeExternalLinks,
	{ target: '_blank', rel: ['noopener', 'noreferrer'] }
]

export default defineConfig({
	site: 'https://kognise.dev/',
	trailingSlash: 'never',
	output: 'server',
	adapter: vercelServerless({ analytics: true }),
	server: {
		port: parseInt(process.env.PORT || '3000')
	},
	integrations: [
		mdx({
			rehypePlugins: [ rehypeExternalLinksConfig, rehypePresetMinify ]
		}),
		sitemap({
			filter: (page) => !page.includes('--delist')
		}),
		react()
	],
	markdown: {
		smartypants: true,
		rehypePlugins: [ rehypeExternalLinksConfig ],
		shikiConfig: {
			theme: 'one-dark-pro'
		}
	}
});
