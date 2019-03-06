import Link from '../Link'
import HomeLink from '../HomeLink'
import LinkContainer from '../LinkContainer'
import StartLinks from '../StartLinks'
import EndLinks from '../EndLinks'
import Icon from '../Icon'
import GitHubIcon from 'react-ionicons/lib/LogoGithub'
import TwitterIcon from 'react-ionicons/lib/LogoTwitter'
import DribbbleIcon from 'react-ionicons/lib/LogoDribbble'

export default () => (
  <LinkContainer className='container'>
    <StartLinks>
      <HomeLink />
      <Link href='/projects'>Projects</Link>
      <Link href='/about'>About</Link>
    </StartLinks>
    <EndLinks>
      <Link href='https://dribbble.com/kognise'><Icon Icon={DribbbleIcon} /><span className='mbt'> Dribbble</span></Link>
      <Link href='https://twitter.com/kognise'><Icon Icon={TwitterIcon} /><span className='mbt'> Twitter</span></Link>
      <Link href='https://github.com/kognise'><Icon Icon={GitHubIcon} /><span className='mbt'> GitHub</span></Link>
    </EndLinks>
    <style jsx global>{`
      .home-alt {
        display: none;
      }

      .mbt {
        display: none;
      }

      @media only screen and (max-width: 465px) {
        .container {
          flex-direction: column !important;
        }

        .container > div {
          display: flex;
          flex-direction: row;
        }

        .container > div > a {
          flex: 1;
          margin-left: 0;
          text-align: center;
        }

        .home {
          display: none !important;
        }

        .home-alt {
          display: block;
        }

        .mbt {
          display: inline;
        }
      }
    `}</style>
  </LinkContainer>
)