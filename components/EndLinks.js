export default ({ children }) => (
  <div className='end-links'>
    {children}
    <style jsx global>{`
      .end-links > * {
        margin-left: 16px;
      }
    `}</style>
  </div>
)