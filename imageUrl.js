import sanity from './sanity'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(sanity)
export default (source) => builder.image(source)