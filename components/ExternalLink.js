export default ({ href, children }) => <a href={href} target='_blank'>
  {children}

  <style jsx>{`
    a {
      color: #0e7dde;
      text-decoration: none;
    }

    a:hover {
      color: #07579c;
      text-decoration: underline;
    }
  `}</style>
</a>