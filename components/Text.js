export default ({ children }) => (
  <p>
    {children}
    <style jsx>{`
      font-size: 1.2em;
      max-width: 800px;
      line-height: 1.6;
    `}</style>
  </p>
)