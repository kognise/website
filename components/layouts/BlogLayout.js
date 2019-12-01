import { NextSeo as NextSEO } from 'next-seo'
import { useRouter } from 'next/router'

import SkipLink from './shared/SkipLink'
import Nav from './shared/Nav'
import MetaBlock from './shared/MetaBlock'
import SubscribeForm from '../SubscribeForm'

import sharedStyles from '../../sharedStyles'

export default ({ title, description, children }) => {
  const router = useRouter()
  const canonical = `https://kognise.dev${router.pathname}`

  return <>
    <SkipLink />
    <Nav />

    <NextSEO
      title={`${title} | Kognise Blog`}
      description={description}
      canonical={canonical}
      openGraph={{
        title,
        description,
        url: canonical,
        site_name: 'Kognise Blog'
      }}
    />

    <div id='content'>
      <MetaBlock
        title={title}
        description={description}
      />

      <main className='main'>{children}</main>

      <SubscribeForm />
    </div>

    <style jsx>{`
      .main {
        margin: 0 auto;
        max-width: 800px;
        margin-bottom: 80px;
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: 1.1rem;
      }

      .main :global(h2) {
        font-size: 1.75em;
      }

      .main :global(h3) {
        font-size: 1.25em;
      }

      .main :global(h4) {
        font-size: 1em;
      }

      .main :global(p),
      .main :global(ul),
      .main :global(ol),
      .main :global(figure),
      .main :global(blockquote),
      .main :global(pre) {
        margin: 10px 0;
      }

      .main :global(h2),
      .main :global(h3),
      .main :global(h4) {
        margin: 20px 0;
      }

      .main :global(img){
        max-width: 100%;
      }

      .main :global(pre), .main :global(code) {
        font-family: 'IBM Plex Mono', monospace;
        background: #ececec;
        padding: 4px;
      }
    `}</style>
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,400i,800,800i|IBM+Plex+Mono:400&display=swap');
    `}</style>
    <style jsx global>{sharedStyles}</style>
  </>
}