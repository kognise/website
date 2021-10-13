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

import doggoNinjaIcon from '../public/project-icons/doggo-ninja.png'
import pwnsquadIcon from '../public/project-icons/pwnsquad.png'
import watercssIcon from '../public/project-icons/watercss.png'
import webjamIcon from '../public/project-icons/webjam.png'

import atomicDesignCover from '../public/book-covers/atomic-design.png'
import fallCover from '../public/book-covers/fall.png'
import gameEngineBbCover from '../public/book-covers/game-engine-bb.png'
import goingPostalCover from '../public/book-covers/going-postal.png'
import lifeInCodeCover from '../public/book-covers/life-in-code.png'
import rebelCodeCover from '../public/book-covers/rebel-code.png'

const IndexPage: FC = () => {
	const stuffRef = useRef<HTMLElement>(null)

	return (
		<main>
			<IndexHero>
				<h1>Hi. I&apos;m a programmer and side-project extraordinaire.</h1>
				<p>
					Right now I&apos;m running a hackathon and preparing a product launch.
					My favorite technologies are <Color color='very-strong'>TypeScript, Rust, and Next.js</Color>.
				</p>
				<p>
					I spend a lot of time online. When I&apos;m not, you can find me <Color color='very-strong'>reading, flying planes, and making music</Color>. I&apos;ve played cello for 10 years!
				</p>
				<div className='button-group'>
					<Button role='link' onClick={() => window.open('https://github.com/kognise')}>
						GitHub{' '}
						<Color color='light'><ExternalLinkIcon /></Color>
					</Button>
					<Button role='link' onClick={() => window.open('https://polywork.com/kognise')}>
						Polywork{' '}
						<Color color='light'><ExternalLinkIcon /></Color>
					</Button>
				</div>
			</IndexHero>

			<PageSection bg='secondary'>
				<Grid gap={50} rowGap={60} columnSize={600}>
					<MajorProjectCard name='Doggo.Ninja' icon={doggoNinjaIcon} link='https://doggo.ninja/'>
						A privacy-friendly service for file sharing, computer backups, and more.
						Currently a private alpha, ideally launching publicly in Q1 2022.
					</MajorProjectCard>
					<MajorProjectCard name='WebJam NYC' icon={webjamIcon} link='https://webjam.nyc/'>
						The first in-person hackathon in New York since the pandemic.
						Our goal is to bring together students interested in building for the web.
					</MajorProjectCard>
					<MajorProjectCard name='Water.css' icon={watercssIcon} link='https://watercss.kognise.dev/'>
						A tiny classless CSS framework for developing website prototypes, with over 6,500 stars
						on GitHub and #3 product of the day on Product Hunt.
					</MajorProjectCard>
					<MajorProjectCard name='PwnSquad' icon={pwnsquadIcon} link='https://pwnsquad.net/'>
						An inclusive Discord-based programming and pentesting community for anyone interested,
						both experienced and inexperienced.
					</MajorProjectCard>
				</Grid>
			</PageSection>

			<PageSection bg='primary'>
				<Grid gap={30} columnSize={340}>
					<MinorProjectCard name='Punct'>
						In-development novel email client built to prioritize UX and design.
					</MinorProjectCard>
					<MinorProjectCard name='ZephyrWave'>
						Offline-first syncronized music streaming and radio web app I built on a train.
					</MinorProjectCard>
					<MinorProjectCard name='S1'>
						A tiny hosted key-value store and dashboard used by many hobby projects.
					</MinorProjectCard>
					<MinorProjectCard name='Crypticat'>
						Semi-decentralized encrypted chat platform as a progressive web app.
					</MinorProjectCard>
					
					<MinorProjectCard name='Flight Plan Converter'>
						Tool to convert between flight sim and IRL flight plans.
					</MinorProjectCard>
					<MinorProjectCard name='Yobmef'>
						Toy chess engine built I built in one week with some friends.
					</MinorProjectCard>
					<MinorProjectCard name='FontKey'>
						Font discovery, pairing, and preview tool that won the Replit Space Jam.
					</MinorProjectCard>
					<MinorProjectCard name='Obsidian Aviation'>
						FAA FAR/AIM and more as an automatically linked Obsidian fault.
					</MinorProjectCard>
					
					<MinorProjectCard name='Taut'>
						Highly configurable selfbot for Slack with lots of commands.
					</MinorProjectCard>
					<MinorProjectCard name='Coronabot'>
						The first COVID-19 tracking Discord bot, and an early verified bot.
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

					<MinorProjectCard name='P2PSC'>
						The predecessor to Crypticat, a slightly insecure point-to-point CLI chat tool.
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

					<MinorProjectCard name='RaaS'>
						&quot;Rickrolling as a Service,&quot; a joke service and toolsetfor generating links to memes.
					</MinorProjectCard>
					<MinorProjectCard name='Vidregator'>
						A proof-of-concept video aggregation and searching platform for self-hosting.
					</MinorProjectCard>
					<MinorProjectCard name='Sherlock'>
						A hacky Python script to efficiently perform multithreaded file searching.
					</MinorProjectCard>
					<MinorProjectCard name='Encryptico'>
						My first foray into web development with an attempt to simplify encryption and signing.
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
				<DescribedData title='Here are some books I love'>
					<Grid gap={20} columnSize={390}>
						<BookCard
							name='Going Postal'
							author='Terry Pratchett'
							cover={goingPostalCover}
							link='https://www.amazon.com/Going-Postal-Discworld-Book-33-ebook/dp/B000W965QM/'
						/>
						<BookCard
							name='Atomic Design'
							author='Brad Frost'
							cover={atomicDesignCover}
							link='https://shop.bradfrost.com/'
						/>
						<BookCard
							name='Life in Code: A Personal History of Technology'
							author='Ellen Ullman'
							cover={lifeInCodeCover}
							link='https://www.amazon.com/Life-Code-Personal-History-Technology-ebook/dp/B01N4P12XJ/'
						/>
						<BookCard
							name='Fall; or, Dodge in Hell'
							author='Neal Stephenson'
							cover={fallCover}
							link='https://www.amazon.com/Fall-Dodge-Hell-Neal-Stephenson/dp/006245871X/'
						/>
						<BookCard
							name='Game Engine Black Book: Wolfenstein 3D'
							author='Fabien Sanglard'
							cover={gameEngineBbCover}
							link='https://www.amazon.com/Game-Engine-Black-Book-Wolfenstein-ebook/dp/B0768B3PWV/'
						/>
						<BookCard
							name='Rebel Code: Linux And The Open Source Revolution'
							author='Glyn Moody'
							cover={rebelCodeCover}
							link='https://www.amazon.com/Rebel-Code-Linux-Source-Revolution/dp/0738206709'
						/>
					</Grid>
				</DescribedData>

				<DescribedData title='My links'>
					<ul>
						<li><a href='https://kognise.instatus.com/' target='_blank' rel='noreferrer'>Status page</a></li>
						<li><a href='https://github.com/kognise' target='_blank' rel='noreferrer'>GitHub</a></li>
						<li><a href='https://polywork.com/kognise' target='_blank' rel='noreferrer'>Polywork</a></li>
						<li><a href='https://twitter.com/kognise' target='_blank' rel='noreferrer'>Twitter</a> (currently suspended, working with support to fix)</li>
						<li><a href='https://replit.com/@Kognise' target='_blank' rel='noreferrer'>Replit</a></li>
						<li><a href='https://dash.s1.kognise.dev/' target='_blank' rel='noreferrer'>S1 dashboard</a></li>
						<li><a href='https://fontkey.design/' target='_blank' rel='noreferrer'>FontKey</a></li>
						<li><a href='https://mail.punct.app/' target='_blank' rel='noreferrer'>Punct</a></li>
					</ul>
				</DescribedData>
			</PageSection>
		</main>
	)
}

export default IndexPage
