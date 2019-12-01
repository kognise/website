import PageLayout from '../components/layouts/PageLayout'
import Projects, { Project } from '../components/sections/Projects'

import sanity from '../sanity'

const Page = ({ projects }) => <PageLayout
  title='My Projects'
  description='A collection of the favorite things I&apos;m working on, people I&apos;m working with, and finished projects. I&apos;ve worked on other things but I&apos;m most proud of these.'
>
  <Projects>
    {projects.map((project) => <Project
      key={project._id}
      title={project.title}
      link={project.link}
      description={project.description}
    />)}
  </Projects>
</PageLayout>

Page.getInitialProps = async () => ({
  projects: await sanity.fetch(`*[_type == 'project']`)
})

export default Page