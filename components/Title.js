export default ({ children }) => (
  <h1>
    {children}
    <style jsx>{`
      font-weight: 600;
      font-size: 3.4em;
      margin: 0;

      @media only screen and (max-width: 400px) {
        font-size: 2.4em;
      }
    `}</style>
  </h1>
)