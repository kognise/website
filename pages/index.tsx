import { FC, useRef } from 'react'

import BookCard from 'components/book-card'
import Button from 'components/button'
import Color from 'components/color'
import DescribedData from 'components/described-data'
import ExternalLinkIcon from 'components/external-link-icon'
import Grid from 'components/grid'
import IndexHero from 'components/index-hero'
import MajorProjectCard from 'components/major-project-card'
import MinorProjectCard from 'components/minor-project-card'
import PageSection from 'components/page-section'

const IndexPage: FC = () => {
	const stuffRef = useRef<HTMLElement>(null)

	return (
		<main>
			<IndexHero>
				<h1>Hi. I&apos;m a young person and I make cool things.</h1>
				<p>My main interests are <Color color='very-strong'>tech, music, and aviation</Color>.</p>
				<p>
					I&apos;m currently studying for my <Color color='very-strong'>Private Pilot License</Color> and building various projects.
					My favorite programming technologies are <Color color='very-strong'>Rust, TypeScript, and Next.js</Color>.
				</p>
				<div className='button-group'>
					<Button role='link' onClick={() => window.open('https://github.com/kognise')}>
						GitHub{' '}
						<Color color='light'><ExternalLinkIcon /></Color>
					</Button>
					<Button role='link' onClick={() => stuffRef.current?.scrollIntoView({ behavior: 'smooth' })}>
						Stuff I Like
					</Button>
				</div>
			</IndexHero>

			<PageSection bg='secondary'>
				<Grid gap={50} rowGap={60} columnSize={600}>
					<MajorProjectCard name='Doggo.Ninja' iconName='doggo-ninja' link='https://doggo.ninja/'>
						A privacy-friendly Google Drive alternative for storing, uploading, and sharing files.
						Currently a private alpha with around 100 invited users.
					</MajorProjectCard>
					<MajorProjectCard name='PwnSquad' iconName='pwnsquad' link='https://pwnsquad.net/'>
						An inclusive Discord-based programming and pentesting community for anyone interested,
						both experienced and inexperienced.
					</MajorProjectCard>
					<MajorProjectCard name='Water.css' iconName='watercss' link='https://watercss.kognise.dev/'>
						A tiny classless CSS framework for developing website prototypes, with over 6,000 stars
						on GitHub and #3 product of the day on Product Hunt.
					</MajorProjectCard>
					<MajorProjectCard name='Punct' iconName='punct' link='https://punct.app/'>
						An in-development novel email client built to have a beautiful and elegant design and
						get email over with faster, without a compromising pricing plan.
					</MajorProjectCard>
				</Grid>
			</PageSection>

			<PageSection bg='primary'>
				<Grid gap={30} columnSize={340}>
					<MinorProjectCard name='Flight Plan Converter'>
						Tool to convert between flight sim and IRL flight plans.
					</MinorProjectCard>
					<MinorProjectCard name='Yobmef'>
						Toy chess engine built I built in one week with some friends.
					</MinorProjectCard>
					<MinorProjectCard name='Taut'>
						Highly configurable selfbot for Slack with lots of commands.
					</MinorProjectCard>
					<MinorProjectCard name='Obsidian Aviation'>
						FAA FAR/AIM and more as an automatically linked Obsidian fault.
					</MinorProjectCard>
					
					<MinorProjectCard name='FontKey'>
						Font discovery, pairing, and preview tool that won the Replit Space Jam.
					</MinorProjectCard>
					<MinorProjectCard name='Crypticat'>
						Semi-decentralized encrypted chat platform as a progressive web app.
					</MinorProjectCard>
					<MinorProjectCard name='Volcano'>
						Reverse-engineered plugin loader for the note taking program Obsidian.
					</MinorProjectCard>
					<MinorProjectCard name='Digital.gov Workflow'>
						Prototype modernized React open editing site for Digital.gov.  
					</MinorProjectCard>

					<MinorProjectCard name='Stacc Analytics'>
						Lightweight privacy-first analytics service that won best design at BridgeHacks.
					</MinorProjectCard>
					<MinorProjectCard name='NYU VIP Smart Cities Sensors'>
						Sensors, data infrastructure, and display dashboards built for NYU.
					</MinorProjectCard>
					<MinorProjectCard name='Pot'>
						Small SSH honeypot designed to trick bots with a realistic Bash clone.
					</MinorProjectCard>
					<MinorProjectCard name='Neocel'>
						Joke command-line tool to deploy web projects to Neocities.
					</MinorProjectCard>

					<MinorProjectCard name='Coronabot'>
						The first COVID-19 tracking Discord bot, and an early verified bot.
					</MinorProjectCard>
					<MinorProjectCard name='VSCode UPM'>
						The first and only Replit UPM plugin for Visual Studio Code.
					</MinorProjectCard>
					<MinorProjectCard name='Among JS'>
						Parser and some documentation for the Among Us UDP protocol.
					</MinorProjectCard>
					<MinorProjectCard name='WonderMap'>
						JSON-inspired note taking app that won best design at Node Knockout.
					</MinorProjectCard>

					<MinorProjectCard name='Bored'>
						Tiny optionally-anonymous message board for sharing text posts.
					</MinorProjectCard>
					<MinorProjectCard name='Frozone'>
						Toy server-rendered React framework for javaScript-less websites.
					</MinorProjectCard>
					<MinorProjectCard name='MPLighting'>
						Beat Saber mod that enables varied lighting effects in multiplayer. 
					</MinorProjectCard>
					<MinorProjectCard name='Replit Mobile'>
						Prototype React Native mobile app for the Replit cloud IDE.
					</MinorProjectCard>
				</Grid>
			</PageSection>

			<PageSection bg='secondary'>
				<DescribedData title='Get in touch'>
					<p>
						Feel free to reach out for literally any reason, I am always happy to talk!
						I can be reached via email at <Color color='very-strong'>hi@kognise.dev</Color> or Discord at <Color color='very-strong'>Kognise#6356</Color>.
					</p>
					<p>
						Want to work with me? I have a lot of experience with <Color color='very-strong'>frontend and backend development</Color>,
						especially around JavaScript/TypeScript, CSS/Sass/PostCSS, React/Next.js, Express, MongoDB, and more.
						I also do <Color color='very-strong'>some UI/UX design</Color> on the side.
					</p>
				</DescribedData>
			</PageSection>

			<PageSection bg='primary' ref={stuffRef}>
				<DescribedData title='Here are some books I recommend'>
					<Grid gap={20} columnSize={390}>
						<BookCard
							name='Going Postal'
							author='Terry Pratchett'
							coverName='going-postal'
							link='https://www.amazon.com/Going-Postal-Discworld-Book-33-ebook/dp/B000W965QM/'
						/>
						<BookCard
							name='Atomic Design'
							author='Brad Frost'
							coverName='atomic-design'
							link='https://shop.bradfrost.com/'
						/>
						<BookCard
							name='Life in Code: A Personal History of Technology'
							author='Ellen Ullman'
							coverName='life-in-code'
							link='https://www.amazon.com/Life-Code-Personal-History-Technology-ebook/dp/B01N4P12XJ/'
						/>
						<BookCard
							name='Fall; or, Dodge in Hell'
							author='Neal Stephenson'
							coverName='fall'
							link='https://www.amazon.com/Fall-Dodge-Hell-Neal-Stephenson/dp/006245871X/'
						/>
						<BookCard
							name='Writing An Interpreter In Go'
							author='Thorsten Ball'
							coverName='interpreter-book'
							link='https://www.amazon.com/Writing-Interpreter-Go-Thorsten-Ball-ebook/dp/B01N2T1VD2/'
						/>
						<BookCard
							name='Game Engine Black Book: Wolfenstein 3D'
							author='Fabien Sanglard'
							coverName='game-engine-bb'
							link='https://www.amazon.com/Game-Engine-Black-Book-Wolfenstein-ebook/dp/B0768B3PWV/'
						/>
					</Grid>
				</DescribedData>

				<DescribedData title='Here are a few cool resources/tools I love'>
					<ul>
						<li><a href='https://now.sh/' target='_blank' rel='noreferrer'>Vercel serverless deployment platform</a></li>
						<li><a href='https://deta.sh/' target='_blank' rel='noreferrer'>Deta cloud database</a></li>
						<li><a href='https://www.figma.com/' target='_blank' rel='noreferrer'>Figma for web design</a></li>
						<li><a href='https://developer.mozilla.org/' target='_blank' rel='noreferrer'>MDN web documentation</a></li>
						<li><a href='https://picular.co/' target='_blank' rel='noreferrer'>Picular image search engine</a></li>
						<li><a href='https://repl.it/' target='_blank' rel='noreferrer'>Repl.it in-browser code execution IDE</a></li>
						<li><a href='https://brave.com/' target='_blank' rel='noreferrer'>Brave web browser</a></li>
						<li><a href='https://www.gitkraken.com/git-client' target='_blank' rel='noreferrer'>GitKraken Git GUI</a></li>
						<li><a href='https://undraw.co/' target='_blank' rel='noreferrer'>Undraw illustrations</a></li>
						<li><a href='https://tailwindcss.com/' target='_blank' rel='noreferrer'>Tailwind CSS framework</a></li>
						<li><a href='https://webframe.xyz/' target='_blank' rel='noreferrer'>Webframe screenshot gallery</a></li>
					</ul>
				</DescribedData>
			</PageSection>
		</main>
	)
}

export default IndexPage
