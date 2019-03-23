export default ({ children, className }) => (
  <p className={className}>
    {children}
    <style jsx>{`
      font-size: 1.2em;
      max-width: 800px;
      line-height: 1.6;
      padding: 0 18px;
    `}</style>
  </p>
)