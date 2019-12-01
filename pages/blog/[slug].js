import BlockContent from '@sanity/block-content-to-react'
import BlogLayout from '../../components/layouts/BlogLayout'
import sanity, { serializers } from '../../sanity'
import Error from '../_error'

const Page = ({ title, description, slug, body = [] }) => {
  if (!title) {
    return <Error statusCode={404} />
  } else {
    return <BlogLayout
      title={title || 'Not Found'}
      description={description || ''}
      canonical={`/blog/${slug}`}
    >
      <BlockContent
        blocks={body}
        imageOptions={{ w: 420, h: 240, fit: 'max' }}
        serializers={serializers}
        {...sanity.config()}
      />
    </BlogLayout>
  }
}

Page.getInitialProps = async ({ query }) => {
  const { slug = '' } = query
  return await sanity.fetch(`
    *[_type == 'post' && slug.current == $slug][0]
  `, { slug })
}

export default Page