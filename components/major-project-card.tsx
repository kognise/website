import { FC } from 'react'

import Color from './color'
import ExternalLinkIcon from './external-link-icon'

interface MajorProjectCardProps {
	iconName: string,
	name: string,
	link: string,
}

const MajorProjectCard: FC<MajorProjectCardProps> = ({ children, iconName, name, link }) => (
	<article>
		<a href={link} target='_blank' rel='noreferrer'>
			<img src={`/project-icons/${iconName}.png`} />

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

				img {
					width: 140px;
					height: 140px;
					border-radius: 30%;
					margin-right: 34px;
					user-select: none;
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
					img {
						width: 110px;
						height: 110px;
						margin-right: 24px;
					}
				}

				@media (max-width: 480px) {
					a {
						flex-direction: column;
						align-items: flex-start;
					}

					img {
						margin-right: 0;
						margin-bottom: 14px;
					}
				}
			`}</style>
		</a>
	</article>
)

export default MajorProjectCard
