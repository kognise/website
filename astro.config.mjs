export default {
	devOptions: {
		port: parseInt(process.env.PORT || '3000')
	},
	buildOptions: {
		site: 'https://kognise.dev/',
		sitemap: true
	},
	markdownOptions: {
		render: [
			'@astrojs/markdown-remark',
			{
				remarkPlugins: [ 'remark-smartypants' ],
				rehypePlugins: [
					[ 'rehype-external-links', { rel: [ 'noopener', 'noreferrer' ] } ],
					'rehype-slug'
				]
			}
		]
	}
}
