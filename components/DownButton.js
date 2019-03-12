import DownIcon from 'react-ionicons/lib/IosArrowDown'

function scroll() {
  window.scroll({
    top: window.innerHeight,
    left: 0,
    behavior: 'smooth'
  })
}

export default () => (
  <div>
    <DownIcon
      onClick={scroll}
      color='#ffffff'
      fontSize='2.6em'
    />
    <style jsx>{`
      position: absolute;
      bottom: 0;
      cursor: pointer;
      opacity: 0.8;
      transition: all 0.2s ease;

      :hover {
        opacity: 1;
      }
    `}</style>
  </div>
)