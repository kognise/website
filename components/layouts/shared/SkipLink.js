export default () => <a href='#content'>
  Skip to content

  <style jsx>{`
    a {
      color: #0e7dde;
      text-decoration: none;
      display: inline-block;
      padding: 10px;
      background: #ffffff;
      position: absolute;
      top: -40px;
      left: 0;
      z-index: 9999;
    }

    a:hover {
      color: #07579c;
      text-decoration: underline;
    }

    a:focus {
      top: 0;
    }
  `}</style>
</a>