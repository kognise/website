export default {
  name: 'aboutSection',
  title: 'About Page Section',
  type: 'document',
  fields: [
    {
      name: 'content',
      title: 'Content',
      type: 'blockContent'
    },
    {
      name: 'index',
      title: 'Index',
      type: 'number'
    }
  ],

  preview: {
    select: {
      title: 'index'
    }
  }
}