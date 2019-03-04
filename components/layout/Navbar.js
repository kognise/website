import Link from '../Link'
import HomeLink from '../HomeLink'
import LinkContainer from '../LinkContainer'
import StartLinks from '../StartLinks'
import EndLinks from '../EndLinks'
import Icon from '../Icon'
import GitHubIcon from 'react-ionicons/lib/LogoGithub'
import TwitterIcon from 'react-ionicons/lib/LogoTwitter'

export default () => (
  <LinkContainer>
    <StartLinks>
      <HomeLink />
      <Link href='/projects'>Projects</Link>
      <Link>About</Link>
    </StartLinks>
    <EndLinks>
      <Link href='https://twitter.com/kognise'><Icon Icon={TwitterIcon} /> Twitter</Link>
      <Link href='https://github.com/kognise'><Icon Icon={GitHubIcon} /> GitHub</Link>
    </EndLinks>
  </LinkContainer>
)