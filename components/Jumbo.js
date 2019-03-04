export default ({ children, background = '#000000' }) => (
  <section>
    {children}
    <style jsx>{`
      width: 100%;
      height: 100vh;
      background: ${background};
      color: ${parseInt(background.substr(1), 16) < 8388608 ? '#ffffff' : '#000000'};
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    `}</style>
  </section>
)