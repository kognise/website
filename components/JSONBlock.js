import Highlight from 'react-highlight.js'

export default ({ children, className }) => (
  <div>
    <Highlight language='json' className={className}>
      {children}
    </Highlight>
    <style jsx>{`
      text-align: left;
      width: 100%;
      max-width: 380px;
    `}</style>
    <style jsx global>{`
      .hljs {
        font-family: 'Fira Mono', monospace;
        font-size: 0.86em;
        cursor: default;
        background: #000000;
      }
    `}</style>
  </div>
)