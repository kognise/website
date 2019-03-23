import FullLightSvg from './svgs/FullLight'

export default () => (
  <div>
    <FullLightSvg height={80} className='svg' />
    <style jsx>{`
      opacity: 0.8;
      transition: all 0.2s ease;

      :hover {
        opacity: 1;
      }

      @media only screen and (max-width: 480px) {
        :global(.svg) {
          width: 100%;
        }
      }
    `}</style>
  </div>
)