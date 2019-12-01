import { NextSeo as NextSEO } from 'next-seo'
import { useRouter } from 'next/router'

import SkipLink from './shared/SkipLink'
import Nav from './shared/Nav'
import MetaBlock from './shared/MetaBlock'

import sharedStyles from '../../sharedStyles'

export default ({ title, description, children }) => {
  const router = useRouter()
  const canonical = `https://kognise.dev${router.pathname}`
  
  return <>
    <SkipLink />
    <Nav />

    <NextSEO
      title={`${title} | Kognise`}
      description={description}
      canonical={canonical}
      openGraph={{
        title,
        description: description,
        url: canonical
      }}
    />

    <main id='content'>
      <MetaBlock
        title={title}
        description={description}
      />

      {children}
    </main>

    <style jsx global>{sharedStyles}</style>
  </>
}