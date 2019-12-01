import PageLayout from '../components/layouts/PageLayout'

const Error = ({ statusCode = 500 }) => <PageLayout
  title={`Error ${statusCode}`}
  description={statusCode === 404
    ? 'This page couldn\'t be found.'
    : 'An error occurred when trying to load this page! Please try again later, in case I fix it.'
  }
>
  <img src='/scream.gif' />
  <style jsx>{`
    img {
      width: 100%;
      max-width: 540px;
      margin: 0 auto;
      display: block;
    }
  `}</style>
</PageLayout>

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error