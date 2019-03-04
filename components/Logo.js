import FullLightSvg from './svgs/FullLight'

export default () => (
  <div>
    <FullLightSvg height={80} />
    <style jsx>{`
      opacity: 0.8;
      transition: all 0.2s ease;

      :hover {
        opacity: 1;
      }
    `}</style>
  </div>
)