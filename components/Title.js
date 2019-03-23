export default ({ children }) => (
  <h1>
    {children}
    <style jsx>{`
      font-weight: 600;
      font-size: 3.4em;
      margin: 0;

      @media only screen and (max-height: 650px) {
        font-size: 2.6em;
      }
    `}</style>
  </h1>
)