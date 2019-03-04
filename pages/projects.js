import Title from '../components/Title'
import Text from '../components/Text'
import Jumbo from '../components/Jumbo'
import Link from '../components/Link'
import ProjectLinks from '../components/ProjectLinks'
import Navbar from '../components/layout/Navbar'
import Icon from '../components/Icon'
import GlobeIcon from 'react-ionicons/lib/MdGlobe'
import GithubIcon from 'react-ionicons/lib/LogoGithub'
import TwitterIcon from 'react-ionicons/lib/LogoTwitter'
import ChatIcon from 'react-ionicons/lib/MdChatboxes'
import NPMIcon from '../components/svgs/NPM'

export default () => (
  <>
    <Jumbo>
      <Navbar />
      <Title>This Website</Title>
      <Text>
        I'm currently working on designing and creating the website you're looking at right now. I want to showcase my work and give people an idea of who I am and what I do.
      </Text>
      <ProjectLinks>
        <Link href='/'><Icon Icon={GlobeIcon} /> Literally this site</Link>
      </ProjectLinks>
    </Jumbo>
    <Jumbo background='#ffffff'>
      <Title>Repl.it API</Title>
      <Text>
        I've fallen in love with the online programming platform <Link href='https://repl.it/' color='#da3fff' nom>Repl.it</Link>! It lets you run in over 40 programming languages quickly, and provides free web hosting. It's just missing one thing: automation. I wanted to fix that, so I used Chrome's network explorer tab to find all the API endpoints and websocket messages to send and built a Node module to abstract it all. I'm working with Repl.it's founder to make it official.
      </Text>
      <ProjectLinks>
        <Link href='https://github.com/kognise/repl.it-api'><Icon Icon={GithubIcon} /> Source Code</Link>
        <Link href='https://www.npmjs.com/package/repl.it-api'><Icon Icon={NPMIcon} /> Package</Link>
        <Link href='https://twitter.com/amasad/status/1100610559748202496'><Icon Icon={TwitterIcon} /> Twitter Thread</Link>
        <Link href='https://repl.it/talk/announcements/Replit-Node-API/11173'><Icon Icon={ChatIcon} /> Repl.it Talk</Link>
      </ProjectLinks>
    </Jumbo>
    <Jumbo background='#f5f5f5'>
      <Title>P2PSC</Title>
      <Text>
        I wanted to build a point to point chat program so I could chat with friends at a summer camp I go to. It needed to not rely on a central server because we don't have internet access there. Thus, P2PSC was born, standing for point to point secure chat. It's a super lightweight and easy to use decentralized chat platform that runs on the command-line.
      </Text>
      <ProjectLinks>
        <Link href='https://p2psc.js.org/'><Icon Icon={GlobeIcon} /> Website</Link>
        <Link href='https://github.com/kognise/p2psc'><Icon Icon={GithubIcon} /> Source Code</Link>
        <Link href='https://www.npmjs.com/package/p2psc'><Icon Icon={NPMIcon} /> Package</Link>
      </ProjectLinks>
    </Jumbo>
    <Jumbo background='#ffffff'>
      <Title>RaaS</Title>
      <Text>
        This project began as a joke making fun of all the X as a Services out there. It turned into a project involving an API, a Node client, a CLI, a website, and multiple microservices. Although I never finished a lot of the documentation, the CLI, API, and Node client for said API have every intended feature except for custom domains. Oh, I forgot to mention &mdash; RaaS stands for Rickrolling as a Service.
      </Text>
      <ProjectLinks>
        <Link href='https://raas.now.sh/'><Icon Icon={GlobeIcon} /> Website</Link>
        <Link href='https://github.com/rickrolling-as-a-service'><Icon Icon={GithubIcon} /> GitHub Org</Link>
      </ProjectLinks>
    </Jumbo>
  </>
)