export default ({ children }) => (
  <div className='start-links'>
    {children}
    <style jsx>{`
      flex: 1;
    `}</style>
    <style jsx global>{`
      .start-links > * {
        margin-left: 16px;
      }
    `}</style>
  </div>
)