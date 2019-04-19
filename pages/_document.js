import Document, { Head, Main, NextScript } from 'next/document'

export default class extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <html lang='en'>
        <Head>
          <style>{`
            body {
              background: #000000;
              margin: 0;
              padding: 0;
            }

            ::selection {
              background-color: #da3fff;
              color: #ffffff;
              opacity: 1;
            }

            @media only screen and (max-height: 650px) {
              body {
                font-size: 0.84em;
              }
            }
          `}</style>
          <link rel='stylesheet' href='https://highlightjs.org/static/demo/styles/ocean.css' />
          <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Fira+Mono' />
          <link rel='shortcut icon' href='https://branding.kognise.dev/logos/pfp.png' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta name='theme-color' content='#000000' />
          <meta name='keywords' content='kognise,website,personal,portfolio,projects,about,contact,info,developer,designer' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
