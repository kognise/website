export default ({ children }) => <section>
  <h2>Here are a few cool resources/tools I love</h2>
  <ul>
    {children}
  </ul>

  <style jsx>{`
    h2 {
      font-size: 1.5em;
    }

    section {
      max-width: 800px;
      margin: 0 auto;
      margin-top: 100px;
      margin-bottom: 32px;
    }
  `}</style>
</section>