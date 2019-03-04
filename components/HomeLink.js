import Link from 'next/link'
import Link2 from './Link'
import SmallLightSvg from './svgs/SmallLight'

export default () => (
  <>
    <Link href='/'>
      <a className='home'>
        <SmallLightSvg />
        <style jsx>{`
          a {
            opacity: 0.8;
            transition: all 0.2s ease;
            display: inline-block;
            position: relative;
            top: 2px;
            transform: scale(1.4);
          }

          a:hover {
            opacity: 1;
            border-bottom: 1px solid #ffffff;
          }
        `}</style>
      </a>
    </Link>
    <Link2 href='/' className='home-alt'>Go Home</Link2>
  </>
)