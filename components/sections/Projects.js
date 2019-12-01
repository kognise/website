export const Project = ({ title, link, description }) => <a href={link} target='_blank'>
  <article>
    <h2>{title}</h2>
    <p>{description}</p>
  </article>

  <style jsx>{`
    h2, p {
      margin: 0;
    }

    a {
      color: #505050;
      background: #f5f5f5;
      text-decoration: none;
      
      padding: 20px;
      display: block;
    }

    a:hover {
      color: #000000;
      text-decoration: underline;
    }

    h2 {
      color: #000000;
      font-size: 1.25em;
      margin-bottom: 12px;
    }
  `}</style>
</a>

export default ({ children }) => <section>
  {children}

  <style jsx>{`
    section {
      max-width: 800px;
      margin: 0 auto;
      margin-bottom: 32px;
      
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      grid-column-gap: 40px;
      grid-row-gap: 40px;
    }
  `}</style>
</section>