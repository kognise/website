import BlockContent from '@sanity/block-content-to-react'
import PageLayout from '../components/layouts/PageLayout'

import TextContainer from '../components/TextContainer'
import ExternalLink from '../components/ExternalLink'
import Books, { Book } from '../components/sections/Books'
import Tools from '../components/sections/Tools'

import sanity, { serializers } from '../sanity'
import imageUrl from '../imageUrl'

const Page = ({ tools, books, sections }) => <PageLayout
  title='About Me'
  description='I&apos;m a full-stack and mobile developer, and a UI/UX designer on the side. I enjoy working on fun projects, and away from the computer I play cello and compose music.'
>
  {sections.map((section) => <TextContainer key={section._id}>
    <BlockContent
      blocks={section.content}
      serializers={serializers}
      {...sanity.config()}
    />
  </TextContainer>)}

  <Books>
    {books.map((book) => <Book
      key={book._id}
      title={book.title}
      author={book.author}
      coverUrl={imageUrl(book.cover).width(100).url()}
      link={book.link}
    />)}
  </Books>

  <Tools>
    {tools.map((tool) => <li key={tool._id}>
      <ExternalLink href={tool.link}>
        {tool.title}
      </ExternalLink>
    </li>)}
  </Tools>
</PageLayout >

Page.getInitialProps = async () => ({
  tools: await sanity.fetch(`*[_type == 'tool']`),
  books: await sanity.fetch(`*[_type == 'book']`),
  sections: await sanity.fetch(`*[_type == 'aboutSection']|order(index asc)`)
})

export default Page