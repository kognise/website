import App, { Container } from 'next/app'
import React from 'react'
import { PageTransition } from 'next-page-transitions'

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <PageTransition timeout={300} classNames="page-transition">
          <Component {...pageProps} />
        </PageTransition>
        <style jsx global>{`
          .page-transition-enter > section > *:not(nav) {
            opacity: 0;
          }
          .page-transition-enter-active > section > *:not(nav) {
            opacity: initial;
            transition: opacity 0.2s ease;
          }
          .page-transition-exit > section > *:not(nav) {
            opacity: initial;
          }
          .page-transition-exit-active > section > *:not(nav) {
            opacity: 0;
            transition: opacity 0.2s ease;
          }
        `}</style>
      </Container>
    )
  }
}