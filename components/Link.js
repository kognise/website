import Link from 'next/link'
import { withRouter } from 'next/router'

export default withRouter(({ router, href = '#', children, color, nom }) => (
  <Link href={href}>
    <a>
      {children}
      <style jsx>{`
        color: ${color || 'inherit'};
        opacity: ${router.pathname === href ? 1 : 0.8 };
        transition: all 0.2s ease;
        text-decoration: none;
        display: inline-block;
        border-bottom: 1px solid transparent;
        margin-bottom: ${nom ? '0' : '10px'};

        :hover {
          opacity: 1;
          border-bottom: 1px solid;
        }

        .icon {
          position: relative;
          top: 5px;
        }
      `}</style>
    </a>
  </Link>
))