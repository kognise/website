import Link from 'next/link'

export const NavLink = ({ href, target, children }) => <Link href={href}>
  <a target={target}>
    {children}

    <style jsx>{`
      a {
        color: #505050;
        text-decoration: none;
      }

      a:hover {
        color: #fff;
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