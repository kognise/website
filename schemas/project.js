export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'string',
      options: {
        maxLength: 250
      }
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
      subtitle: 'link'
    }
  }
}
