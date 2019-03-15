export default ({ children }) => (
  <h2>
    {children}
    <style jsx>{`
      font-weight: normal;
      font-size: 1.4em;
      margin: 0;
      opacity: 0.8;
      cursor: default;

      @media only screen and (max-width: 400px) {
        font-size: 1.05em;
      }
    `}</style>
  </h2>
)