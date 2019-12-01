import NavLogo from './NavLogo'
import NavLinks, { NavLink } from './NavLinks'

export default () => <header>
  <nav>
    <div><NavLogo /></div>

    <NavLinks>
      {/* <NavLink href='/blog'>Blog</NavLink> */}
      <NavLink href='/projects'>Projects</NavLink>
      <NavLink href='/about'>About</NavLink>
    </NavLinks>
  </nav>

  <style jsx>{`
    div {
      flex: 1;
    }

    header {
      background: #ffffff;
      padding: 20px;

      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 999;
    }

    nav {
      max-width: 800px;
      margin: 0 auto;
    }

    nav, div {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  `}</style>
</header>