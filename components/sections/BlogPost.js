import Link from 'next/link'

export default ({ title, description, slug }) => <Link href={`/blog/${slug.current}`}>
  <a>
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>

    <style jsx>{`
      h2, p {
        margin: 0;
      }

      a {
        display: block;
        max-width: 520px;

        margin: 0 auto;
        margin-bottom: 32px;

        color: #505050;
        text-decoration: none;
      }

      a:hover {
        color: #fff;
        text-decoration: underline;
      }

      h2 {
        color: #fff;
        font-size: 1.25em;
        margin-bottom: 12px;
      }
    `}</style>
  </a>
</Link>