export default ({ title, description }) => <section>
  <h1>{title}</h1>
  <p>{description}</p>

  <style jsx>{`
      section {
        text-align: center;
        max-width: 400px;
        margin: 0 auto;
        margin-top: 140px;
        margin-bottom: 92px;
      }

      h1, p {
        margin: 0;
      }

      h1 {
        font-size: 2em;
        margin-bottom: 18px;
      }

      p {
        color: #505050;
      }
    `}</style>
</section>