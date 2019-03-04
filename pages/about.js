import Title from '../components/Title'
import Jumbo from '../components/Jumbo'
import Navbar from '../components/layout/Navbar'
import ResponsiveAbout from '../components/layout/ResponsiveAbout'
import NextSEO from 'next-seo'

const Page = ({ initialAge }) => {
  return (
    <>
      <NextSEO config={{
        title: 'Kognise: About',
        canonical: 'https://kognise.dev/about',
        openGraph: {
          url: 'https://kognise.dev/about',
          title: 'About',
        }
      }} />
      <Jumbo>
        <Navbar />
        <Title>About Me</Title>
        <ResponsiveAbout initialAge={initialAge} />
      </Jumbo>
    </>
  )
}

Page.getInitialProps = () => ({
  initialAge: (Date.now() - 1114056000000) / 365 / 24 / 60 / 60 / 1000
})

export default Page