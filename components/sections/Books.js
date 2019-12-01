import ExternalLink from '../ExternalLink'

export const Book = ({ title, author, coverUrl, link }) => <a href={link} target='_blank'>
  <article>
    <img src={coverUrl} alt={`${title} Cover`} />
    <div>
      <h3>{title}</h3>
      <p>by {author}</p>
    </div>
  </article>

  <style jsx>{`
    a {
      background: #f5f5f5;
      color: #505050;

      text-decoration: none;
      padding: 20px;

      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    a:hover {
      color: #000000;
      text-decoration: underline;
    }

    article {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    h3, p {
      margin: 0;
    }

    h3 {
      color: #000000;
      font-size: 1em;
      margin-bottom: 4px;
    }

    img {
      width: 100px;
    }

    div {
      flex: 1;
      margin-left: 18px;
    }
  `}</style>
</a>

export default ({ children }) => <section>
  <h2>Here are some books I recommend</h2>
  <p>If you think I'm cool you could <ExternalLink href='https://read.gift/u/kognise'>buy me a new one</ExternalLink> 😊</p>
  <div>{children}</div>

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

    div {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      grid-column-gap: 40px;
      grid-row-gap: 40px;
    }
  `}</style>
</section>