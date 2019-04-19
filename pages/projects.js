import Title from '../components/Title'
import Text from '../components/Text'
import Jumbo from '../components/Jumbo'
import Link from '../components/Link'
import ProjectLinks from '../components/ProjectLinks'
import Navbar from '../components/layout/Navbar'
import Icon from '../components/Icon'
import Subtitle from '../components/Subtitle'
import DownButton from '../components/DownButton'
import GlobeIcon from 'react-ionicons/lib/MdGlobe'
import GithubIcon from 'react-ionicons/lib/LogoGithub'
import TwitterIcon from 'react-ionicons/lib/LogoTwitter'
import PHIcon from 'react-ionicons/lib/MdMegaphone'
import ChatIcon from 'react-ionicons/lib/MdChatboxes'
import NPMIcon from '../components/svgs/NPM'
import NextSEO from 'next-seo'

export default () => (
  <>
    <NextSEO config={{
      title: 'Kognise: Projects',
      canonical: 'https://kognise.dev/projects',
      openGraph: {
        url: 'https://kognise.dev/projects',
        title: 'Projects',
      }
    }} />
    <Jumbo>
      <Navbar />
      <Subtitle>Primarily Maintaining</Subtitle>
      <Title>Water.css</Title>
      <Text>
      I commonly make static websites with important content and ideas that I don't want to spend time writing stylesheets for. Water.css is a css framework that doesn't require any classes. You just include it in your head and forget about it, while it silently makes everything nicer. This is my first successful project, making #3 product of the day on Product Hunt and over 3k stars on GitHub!
      </Text>
      <ProjectLinks>
        <Link href='https://github.com/kognise/water.css'><Icon Icon={GithubIcon} /> Source Code</Link>
        <Link href='https://www.producthunt.com/posts/water-css'><Icon Icon={PHIcon} /> Product Hunt</Link>
        <Link href='https://watercss.netlify.com/'><Icon Icon={GlobeIcon} /> Demo</Link>
      </ProjectLinks>
    </Jumbo>
    <Jumbo background='#f5f5f5'>
      <Subtitle>March 2019</Subtitle>
      <Title>This Website</Title>
      <Text>
        I needed a website to showcase my work and give people an idea of who I am and what I do, so I built it from scratch with React and Next.js. Hint: you're looking at it right now.
      </Text>
      <ProjectLinks>
        <Link href='/'><Icon Icon={GlobeIcon} /> This Site</Link>
        <Link href='https://github.com/kognise/website'><Icon Icon={GithubIcon} /> Source Code</Link>
      </ProjectLinks>
    </Jumbo>
    <Jumbo background='#ffffff'>
      <Subtitle>February 2019</Subtitle>
      <Title>Repl.it API</Title>
      <Text>
        I've fallen in love with the online programming platform <Link href='https://repl.it/' color='#da3fff' nom>Repl.it</Link>! It lets you run code in over 40 programming languages quickly, and provides free web hosting. It's just missing one thing: automation. I wanted to fix that, so I used Chrome's network explorer tab to find all the API endpoints and websocket messages to send and built a Node module to abstract it all. I'm working with Repl.it's founder to make it official.
      </Text>
      <ProjectLinks>
        <Link href='https://github.com/kognise/repl.it-api'><Icon Icon={GithubIcon} /> Source Code</Link>
        <Link href='https://www.npmjs.com/package/repl.it-api'><Icon Icon={NPMIcon} /> Package</Link>
        <Link href='https://twitter.com/amasad/status/1100610559748202496'><Icon Icon={TwitterIcon} /> Twitter Thread</Link>
        <Link href='https://repl.it/talk/announcements/Replit-Node-API/11173'><Icon Icon={ChatIcon} /> Repl.it Talk</Link>
      </ProjectLinks>
    </Jumbo>
    <Jumbo background='#f5f5f5'>
      <Subtitle>February 2019</Subtitle>
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
      <Subtitle>February 2019</Subtitle>
      <Title>RaaS</Title>
      <Text>
        This project began as a joke making fun of all the X as a Services out there. It turned into a project involving an API, a Node client, a CLI, a website, and multiple microservices. Although I never finished a lot of the documentation, the CLI, API, and Node client for said API have every intended feature except for custom domains. Oh, I forgot to mention &mdash; RaaS stands for Rickrolling as a Service.
      </Text>
      <ProjectLinks>
        <Link href='https://raas.now.sh/'><Icon Icon={GlobeIcon} /> Website</Link>
        <Link href='https://github.com/rickrolling-as-a-service'><Icon Icon={GithubIcon} /> GitHub Org</Link>
      </ProjectLinks>
    </Jumbo>
    <Jumbo background='#f5f5f5'>
      <Subtitle>February 2019</Subtitle>
      <Title>bootstrap-next</Title>
      <Text>
        Once I discovered Next.js, I started using it in almost every project of mine. Over time I found that I had to configure a lot of the same things over and over manually and popular bootstrappers didn't fit how I code, so I built my own bootstrapper that can generate a Next.js project with a file structure, linting rules, and a readme already set up.
      </Text>
      <ProjectLinks>
        <Link href='https://github.com/kognise/bootstrap-next'><Icon Icon={GithubIcon} /> Source Code</Link>
        <Link href='https://www.npmjs.com/package/bootstrap-next'><Icon Icon={NPMIcon} /> Package</Link>
      </ProjectLinks>
    </Jumbo>
    <Jumbo background='#ffffff'>
      <Subtitle>February 2019</Subtitle>
      <Title>NYT.cx</Title>
      <Text>
        NYT.cx is a fairly simple url shortener, with a twist: you can "mask" one url with another, which replaces the opengraph tags of the website you're redirecting to with the opengraph tags of a website of your choice. Although it isn't the most useful thing I've ever made I got more experience in building APIs with Express and got insight into how link shorteners work.
      </Text>
      <ProjectLinks>
        <Link href='https://nyt.cx/'><Icon Icon={GlobeIcon} /> Website</Link>
      </ProjectLinks>
    </Jumbo>
    <Jumbo background='#f5f5f5'>
      <Subtitle>January 2019</Subtitle>
      <Title>Project Liam</Title>
      <Text>
        You may have heard that Google has discontinued their much-loved Inbox service that a lot of people (including me) rely on to organize their email. A few friends and I decided to build an email service with the best features of Inbox included. Although a good idea, proved to be too ambitious.
      </Text>
      <ProjectLinks>
        <Link href='https://liam.now.sh/'><Icon Icon={GlobeIcon} /> Preview</Link>
      </ProjectLinks>
      <DownButton />
    </Jumbo>
    <Jumbo background='#ffffff'>
      <Subtitle>January 2019</Subtitle>
      <Title>Digital.gov Workflow React</Title>
      <Text>
        I was invited to help with the Digital.gov Workflow project by <Link href='https://jeremyzilar.com/' color='#da3fff' nom>Jeremy Zilar</Link>. It's a site for openly managing their editorial workflows. I took this opportunity to learn React and build my first Next.js app, which is a full remake of the old Jekyll app focusing on speed, future-proofing, and accessibility. I also learned GraphQL to build a backend with it, which drasticaly improves loading times.
      </Text>
      <ProjectLinks>
        <Link href='https://digitalgov-workflow.netlify.com/'><Icon Icon={GlobeIcon} /> Website</Link>
        <Link href='https://github.com/kognise/digitalgov-workflow-react'><Icon Icon={GithubIcon} /> Frontend Code</Link>
        <Link href='https://github.com/kognise/digitalgov-workflow-graphql'><Icon Icon={GithubIcon} /> Backend Code</Link>
      </ProjectLinks>
    </Jumbo>
    <Jumbo background='#f5f5f5'>
      <Subtitle>August 2018</Subtitle>
      <Title>Sherlock</Title>
      <Text>
        Once upon a time, I was offline and wanted to find a file with a certain content on my computer. I wrote a Python script to search through everything, but it was taking ages. I gradually expanded upon it and added multithreading and such. Although it isn't <em>that</em> performant, it was a pretty good learning experience.
      </Text>
      <ProjectLinks>
        <Link href='https://github.com/kognise/sherlock'><Icon Icon={GithubIcon} /> Source Code</Link>
      </ProjectLinks>
    </Jumbo>
    <Jumbo background='#ffffff'>
      <Subtitle>August 2018</Subtitle>
      <Title>Encryptico</Title>
      <Text>
        I discovered <Link href='https://www.emberjs.com/' color='#da3fff' nom>Ember</Link> and at the same time was trying to find a simple tool to encrypt and decrypt strings. I decided to build one and teach myself Ember in the process. I now realize I didn't take advantage of a lot, but still learned a ton. This knowledge also helped me progress to React later on.
      </Text>
      <ProjectLinks>
        <Link href='https://github.com/kognise/encryptico'><Icon Icon={GithubIcon} /> Source Code</Link>
      </ProjectLinks>
    </Jumbo>
    <Jumbo background='#f5f5f5'>
      <Subtitle>Before that...</Subtitle>
      <Title>... there was nothing</Title>
      <Text>
        Once upon a time I was still learning the basics, and didn't know how magical Git is. In other words, basically nothing of the past is open source. It's a shame! I worked on an ebook program and various other fairly interesting things.
      </Text>
    </Jumbo>
  </>
)