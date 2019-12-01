import sanityClient from '@sanity/client'
import ExternalLink from './components/ExternalLink'

export default sanityClient({
  projectId: 'w6lrupf4',
  dataset: 'production',
  useCdn: true
})

export const serializers = {
  types: {
    code: ({ node }) => <pre data-language={node.language}>
      <code>{node.code}</code>
    </pre>
  },
  marks: {
    link: ({ mark: { href }, children }) => <ExternalLink href={href}>
      {children}
    </ExternalLink>
  }
}