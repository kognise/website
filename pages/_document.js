import Document, { Head, Main, NextScript } from 'next/document'

export default class extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <html>
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}