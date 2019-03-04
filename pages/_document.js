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
              margin: 0;
            }
            html {
              scroll-behavior: smooth;
            }
          `}</style>
          <link rel='stylesheet' href='https://highlightjs.org/static/demo/styles/ocean.css' />
          <link href='https://fonts.googleapis.com/css?family=Fira+Mono' rel='stylesheet' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}