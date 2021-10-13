import { FC } from 'react'
import Image from 'next/image'

import Color from './color'
import ExternalLinkIcon from './external-link-icon'

interface MajorProjectCardProps {
	icon: StaticImageData,
	name: string,
	link: string,
}

const MajorProjectCard: FC<MajorProjectCardProps> = ({ children, icon, name, link }) => (
	<article>
		<a href={link} target='_blank' rel='noreferrer'>
			<div className='icon'>
				<Image
					src={icon}
					sizes='140w, (max-width: 740px) 110w'
					layout='fill'
					alt={`${name} icon`}
					priority
				/>
			</div>

			<div className='content'>
				<h3>{name} <Color color='light'><ExternalLinkIcon /></Color></h3>
				<p>{children}</p>
			</div>

			<style jsx>{`
				a {
					display: flex;
					flex-direction: row;
					align-items: center;
					text-decoration: none;
					padding: 10px;
					border: 2px solid transparent;
					border-radius: 10px;
					outline: none;
				}

				a:focus-visible {
					background: var(--bg-primary);
					border: 2px solid var(--fg-normal);
				}

				.icon {
					min-width: 140px;
					min-height: 140px;
					border-radius: 30%;
					margin-right: 34px;
					user-select: none;
					position: relative;
					overflow: hidden;
				}

				.content h3 {
					color: var(--fg-strong);
					font-weight: 600;
					margin: 0;
					margin-bottom: 10px;
					font-size: 1.5rem;
				}

				.content p {
					color: var(--fg-normal);
					margin: 0;
				}

				@media (max-width: 740px) {
					.icon {
						min-width: 110px;
						min-height: 110px;
						margin-right: 24px;
					}
				}

				@media (max-width: 480px) {
					a {
						flex-direction: column;
						align-items: flex-start;
					}

					.icon {
						margin-right: 0;
						margin-bottom: 14px;
					}
				}
			`}</style>
		</a>
	</article>
)

export default MajorProjectCard
