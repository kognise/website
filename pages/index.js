import HomeLayout from '../components/layouts/HomeLayout'
import HomeLinks, { HomeLink } from '../components/sections/HomeLinks'

export default () => <HomeLayout>
  <HomeLinks>
    {/* <HomeLink href='/blog'>Blog</HomeLink> */}
    <HomeLink href='/projects'>Projects</HomeLink>
    <HomeLink href='/about'>About</HomeLink>
  </HomeLinks>
</HomeLayout>