export default ({ children, className }) => (
  <nav className={className}>
    {children}
    <style jsx>{`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 10px 20vw;
      display: flex;
      flex-direction: row;
      text-align: left;

      @media only screen and (max-width: 686px) {
        padding: 10px;
      }
    `}</style>
  </nav>
)