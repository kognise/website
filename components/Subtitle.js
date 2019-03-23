export default ({ children }) => (
  <h2>
    {children}
    <style jsx>{`
      font-weight: normal;
      font-size: 1.4em;
      margin: 0;
      opacity: 0.8;
      cursor: default;
    `}</style>
  </h2>
)