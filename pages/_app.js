import ReactGA from 'react-ga'
import App from 'next/app'
import Head from 'next/head'
import { DefaultSeo as DefaultSEO } from 'next-seo'

const description = 'I\'m a 13 year old developer, designer, and cellist. This is my website where you can find out more about me, see the projects I\'ve worked on, and read my blog.'

export default class CustomApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return { pageProps }
  }

  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      ReactGA.initialize('UA-116663597-5')
      window.GA_INITIALIZED = true
    }

    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <link rel='shortcut icon' href='https://branding.kognise.dev/logos/pfp.png' />
        </Head>
        <DefaultSEO
          title='Kognise'
          description={description}
          canonical='https://kognise.dev/'
          additionalMetaTags={[
            {
              name: 'keywords',
              content: 'kognise,website,personal,portfolio,projects,about,contact,info,developer,designer,resume'
            },
            {
              name: 'theme-color',
              content: '#000000'
            }
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
                alt: 'Kognise: Development and Design'
              }
            ],
            site_name: 'Kognise'
          }}
          twitter={{
            handle: '@kognise',
            site: '@kognise',
            cardType: 'summary_large_image',
          }}
        />
        <Component {...pageProps} />
      </>
    )
  }
}