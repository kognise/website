import Text from '../Text'
import Link from '../Link'
import JSONBlock from '../JSONBlock'
import { useState, useEffect } from 'react'

export default ({ initialAge }) => {
  const [ age, setAge ] = useState(initialAge)
  useEffect(() => {
    const interval = setInterval(() => setAge((Date.now() - 1114056000000) / 365 / 24 / 60 / 60 / 1000), 100)
    return () => window.clearInterval(interval)
  })

  return (
    <div>
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
  }
}
      `.trim()}</JSONBlock>
      <Text className='fallback'>
        Hi! If you were wondering, my full name is Felix Mattick, and you can contact me at <Link href='mailto:felix.mattick@gmail.com' color='#da3fff' nom>felix.mattick@gmail.com</Link>. I'm super familiar with languages like JavaScript, CSS, and HTML as well as technologies such as Node, React, and Sass. By the way, you'll be able to see a lot more about me on a taller screen!
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
    </div>
  )
}