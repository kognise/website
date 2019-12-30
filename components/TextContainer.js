export default ({ children }) => <div>
  {children}

  <style jsx>{`
    div {
      margin: 1em auto;
      max-width: 800px;
    }

    div :global(pre), div :global(code) {
      font-family: 'IBM Plex Mono', monospace;
      background: #171717;
      padding: 4px;
    }
  `}</style>
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css?family=IBM+Plex+Mono:400&display=swap');
  `}</style>
</div>