export default ({ children }) => (
  <div>
    {(children.map ? children : [ children ]).map((child, index) => {
      const child0 = React.cloneElement(child.props.children[0], {
        color: '#da3fff',
        key: 0
      })
      return React.cloneElement(child, {
        key: index
      }, [ child0, child.props.children[1] ])
    })}
    <style jsx>{`
      color: #da3fff;
      display: flex;
      flex-direction: column;
      align-items: center;
    `}</style>
  </div>
)