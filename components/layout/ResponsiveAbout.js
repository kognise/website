import Text from '../Text'
import Link from '../Link'
import JSONBlock from '../JSONBlock'
import { useState, useEffect } from 'react'

export default ({ initialAge }) => {
  const [ age, setAge ] = useState(initialAge)
  useEffect(() => {
    const interval = setInterval(() => {
      const ageNow = (Date.now() - 1145592000000) / 365.25 / 24 / 60 / 60 / 1000
      setAge(ageNow)
    }, 80)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div>
      <JSONBlock className='block'>{`
{
  "title": "Kognise",
  "name": "Felix Mattick",
  "email": "hi@kognise.dev",
  "discord": "Kognise#6356",
  "age": ${age.toFixed(15)},
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
    "go": 6,
    "java": 3,
    "c": 2
  },
  "technologyKnowledgeOutOf10": {
    "node": 10,
    "react": 9,
    "scssAndSass": 9,
    "svelte": 5,
    "ember": 5
  }
}
      `.trim()}</JSONBlock>
      <Text className='fallback'>
        Hi! If you were wondering, my full name is Felix Mattick, I'm {age.toFixed(4)} years old, and you can contact me at <Link href='mailto:hi@kognise.dev' color='#da3fff' nom>hi@kognise.dev</Link>. I'm super familiar with languages like JavaScript, CSS, and HTML as well as technologies such as Node, React, and Sass. By the way, you'll be able to see a lot more about me on a taller screen!
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