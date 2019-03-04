import Title from '../components/Title'
import JSONBlock from '../components/JSONBlock'
import Jumbo from '../components/Jumbo'
import Navbar from '../components/layout/Navbar'
import Text from '../components/Text'
import Link from '../components/Link'
import { useState, useEffect } from 'react'

function getAge() {
  return (Date.now() - 1114056000000) / 365 / 24 / 60 / 60 / 1000
}

const Page = ({ initialAge }) => {
  const [ age, setAge ] = useState(initialAge)
  useEffect(() => {
    const interval = setInterval(() => setAge(getAge()), 100)
    return () => window.clearInterval(interval)
  })

  return (
    <>
      <Jumbo>
        <Navbar />
        <Title>About Me</Title>
        <JSONBlock className='block'>{`
{
  "title": "Kognise",
  "name": "Felix Mattick",
  "age": ${age},
  "email": "felix.mattick@gmail.com",
  "discord": "Kognise#6356",
  "interests": [
    "web development",
    "ui/ux design",
    "learning new things",
    "cello and composition",
    "overusing json"
  ],
  "languageKnowledgeOutOf10": {
    "javascript": 10,
    "css": 9,
    "html": 9,
    "python": 7,
    "java": 6,
    "go": 2,
    "c": 2
  },
  "technologyKnowledgeOutOf10": {
    "node": 10,
    "react": 9,
    "scssAndSass": 9,
    "ember": 7
  },
  "codeStyle": {
    "quotes": "single",
    "semicolons": false,
    "es6": true,
    "accessible": true
  }
}
        `.trim()}</JSONBlock>
        <Text className='fallback'>
          Hi! If you were wondering, my full name is Felix Mattick, and you can contact me at <Link href='mailto:felix.mattick@gmail.com' color='#da3fff' nom>felix.mattick@gmail.com</Link>. I'm super familiar with languages like JavaScript, CSS, and HTML as well as technologies such as Node, React, and Sass. By the way, you'll be able to see a lot more about me on a bigger screen!
        </Text>
        <style jsx global>{`
          .fallback {
            display: none;
          }

          @media only screen and (max-height: 750px) {
            .block {
              display: none;
            }

            .fallback {
              display: block;
            }
          }
        `}</style>
      </Jumbo>
    </>
  )
}

Page.getInitialProps = () => ({
  initialAge: getAge()
})

export default Page