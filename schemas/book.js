export default {
  name: 'book',
  title: 'Book',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string'
    },
    {
      name: 'cover',
      title: 'Cover',
      type: 'image'
    },
    {
      name: 'link',
      title: 'Link',
      type: 'url'
    }
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'author',
      media: 'cover'
    }
  }
}
