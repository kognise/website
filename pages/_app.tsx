import 'styles/global.css'
import 'styles/open-sauce.css'
import 'styles/theme.css'

import { AppProps } from 'next/app'
import { DefaultSeo as DefaultSEO } from 'next-seo'
import Head from 'next/head'
import React, { FC, useEffect } from 'react'
import ReactGA from 'react-ga'

const description = `
I'm a young person who's interested in programming, aviation, and music. I'm currently working on several projects including Water.css, Punct, and Doggo.Ninja. 
`.trim()

const App: FC<AppProps> = ({ Component, pageProps }) => {
	useEffect(() => {
		ReactGA.initialize('UA-116663597-5')
		ReactGA.set({ page: window.location.pathname })
		ReactGA.pageview(window.location.pathname)
	}, [])

	return (
		<>
			<Head>
				<title>Kognise</title>
				<link rel='icon' href='https://media.kognise.dev/logos/pfp.png' />
				<link rel='preconnect' href='https://fonts.gstatic.com' />
				<link href='https://fonts.googleapis.com/css2?family=Syne:wght@800&display=swap' rel='stylesheet' />

				<DefaultSEO
					title='Kognise'
					description={description}
					canonical='https://kognise.dev/'
					additionalMetaTags={[
						{
							name: 'keywords',
							content: 'kognise,website,personal,portfolio,projects,about,contact,info,developer,designer,resume',
						},
						{
							name: 'theme-color',
							content: '#0e7dde',
						},
					]}
					openGraph={{
						type: 'website',
						locale: 'en_US',
						url: 'https://kognise.dev/',
						title: 'Kognise',
						description,
						images: [
							{
								url: 'https://branding.kognise.dev/logos/banner.png',
								width: 1500,
								height: 500,
								alt: 'Kognise: Development and Design',
							},
						],
						site_name: 'Kognise',
					}}
					twitter={{
						handle: '@kognise',
						site: '@kognise',
						cardType: 'summary_large_image',
					}}
				/>
			</Head>

			<Component {...pageProps} />
		</>
	)
}

export default App
