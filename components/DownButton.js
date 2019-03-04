import DownIcon from 'react-ionicons/lib/IosArrowDown'

function scroll() {
  window.scrollTo(0, window.innerHeight)
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
    `}</style>
  </div>
)