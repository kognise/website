import Link from 'next/link'

export const HomeLink = ({ href, target, children }) => <Link href={href}>
  <a target={target}>
    {children}

    <style jsx>{`
      a {
        color: #b1b1b1;
        text-decoration: none;
      }

      a:hover {
        color: #ffffff;
        text-decoration: underline;
      }
    `}</style>
  </a>
</Link>

export default ({ children }) => <nav>
  {children}

  <style jsx>{`
    nav :global(a:not(:last-child)) {
      margin-right: 18px;
    }
  `}</style>
</nav>