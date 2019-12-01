export default () => <div className='outer'>
  <div className='inner' />
  <div className='inner' />

  <style jsx>{`
    .outer {
      display: block;
      margin: 40px auto;
      position: relative;
      width: 64px;
      height: 64px;
    }

    .inner {
      position: absolute;
      border: 4px solid #000000;
      opacity: 1;
      border-radius: 50%;
      animation: ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    }
    
    .inner:nth-child(2) {
      animation-delay: -0.5s;
    }

    @keyframes ripple {
      from {
        top: 28px;
        left: 28px;
        width: 0;
        height: 0;
        opacity: 1;
      }

      to {
        top: -1px;
        left: -1px;
        width: 58px;
        height: 58px;
        opacity: 0;
      }
    }
  `}</style>
</div>