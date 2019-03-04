import Title from '../components/Title'
import JSONBlock from '../components/JSONBlock'
import Jumbo from '../components/Jumbo'
import Navbar from '../components/layout/Navbar'
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
        <JSONBlock>{`
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
    "python": 7,
    "java": 6,
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
    "es6": true
  }
}
        `.trim()}</JSONBlock>
      </Jumbo>
    </>
  )
}

Page.getInitialProps = () => ({
  initialAge: getAge()
})

export default Page