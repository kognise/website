const description = 'Hey! I\'m a 13 year old developer, designer, and cellist. This is my website where you can find out more about me and see the projects I\'ve worked on.'

export default {
  title: 'Kognise',
  description,
  canonical: 'https://kognise.dev/',
  openGraph: {
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
  },
  twitter: {
    handle: '@kognise',
    site: '@kognise',
    cardType: 'summary_large_image'
  }
}