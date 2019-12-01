import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'

import blockContent from './blockContent'
import post from './post'
import aboutSection from './aboutSection'
import project from './project'
import book from './book'
import tool from './tool'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    post,
    aboutSection,
    project,
    book,
    tool,
    blockContent
  ])
})
