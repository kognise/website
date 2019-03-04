import Highlight from 'react-highlight.js'

export default ({ children }) => (
  <div>
    <Highlight language='json'>
      {children}
    </Highlight>
    <style jsx>{`
      text-align: left;
      width: 100%;
      max-width: 380px;
    `}</style>
  </div>
)