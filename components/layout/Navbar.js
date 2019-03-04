import Link from '../Link'
import HomeLink from '../HomeLink'
import LinkContainer from '../LinkContainer'
import StartLinks from '../StartLinks'
import EndLinks from '../EndLinks'
import Icon from '../Icon'
import GitHubIcon from 'react-ionicons/lib/LogoGithub'
import TwitterIcon from 'react-ionicons/lib/LogoTwitter'

export default () => (
  <LinkContainer className='container'>
    <StartLinks>
      <HomeLink />
      <Link href='/projects'>Projects</Link>
      <Link href='/about'>About</Link>
    </StartLinks>
    <EndLinks>
      <Link href='https://twitter.com/kognise'><Icon Icon={TwitterIcon} /> Twitter</Link>
      <Link href='https://github.com/kognise'><Icon Icon={GitHubIcon} /> GitHub</Link>
    </EndLinks>
    <style jax global>{`
      .container > div > .home-alt {
        display: none;
      }

      @media only screen and (max-width: 440px) {
        .container {
          flex-direction: column;
        }

        .container > div > a:not(.home) {
          display: block !important;
          margin-left: 0;
        }

        .container > div > .home {
          display: none;
        }

        .container > div > .home-alt {
          display: block;
        }
      }
    `}</style>
  </LinkContainer>
)