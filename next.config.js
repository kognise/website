module.exports = {
	headers: async () => [
		{
			source: '/:anything*',
			headers: [
				{
					key: 'X-Clacks-Overhead',
					value: 'GNU Terry Pratchett',
				},
			],
		},
	],
	redirects: async () => [
		{
			source: '/about',
			destination: '/',
			permanent: true,
		},
		{
			source: '/projects',
			destination: '/',
			permanent: true,
		},
	],
	future: {
		webpack5: true,
	},
}
