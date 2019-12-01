import PageLayout from '../../components/layouts/PageLayout'

import BlogPost from '../../components/sections/BlogPost'
import SubscribeForm from '../../components/SubscribeForm'

import sanity from '../../sanity'

const Page = ({ posts }) => <PageLayout
  title='My Blog'
  description='Some assorted writings and thoughts. I just started this so it&apos;s pretty empty for now.'
>
  <BlogPost {...posts[0]} />
  <SubscribeForm />
  {posts.slice(1).map((post) => <BlogPost
    id={post._id}
    title={post.title}
    description={post.description}
    slug={post.slug}
  />)}
</PageLayout>

Page.getInitialProps = async () => ({
  posts: await sanity.fetch(`
    *[_type == 'post' && publishedAt < now()]|order(publishedAt desc)
  `)
})

export default Page