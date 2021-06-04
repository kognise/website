import { FC } from 'react'

import Color from './color'
import ExternalLinkIcon from './external-link-icon'

interface MajorProjectCardProps {
	coverName: string,
	name: string,
	author: string,
	link: string,
}

const BookCard: FC<MajorProjectCardProps> = ({ coverName, name, author, link }) => (
	<article>
		<a href={link} target='_blank' rel='noreferrer'>
			<div className='cover'>
				<img src={`/book-covers/${coverName}.png`} />
			</div>

			<div className='content'>
				<h3>{name} <Color color='light'><ExternalLinkIcon /></Color></h3>
				<p>by {author}</p>
			</div>

			<style jsx>{`
				a {
					display: flex;
					flex-direction: row;
					align-items: center;
					text-decoration: none;
					padding: 20px;
					border: 2px solid transparent;
					border-radius: 10px;
					outline: none;
					background: var(--bg-secondary);
					height: 100%;
				}

				a:hover {
					text-decoration: none !important;
				}

				a:focus-visible {
					border: 2px solid var(--fg-normal);
				}

				img {
					width: 80px;
					border-radius: 5px;
					margin-right: 20px;
					user-select: none;
				}

				.content h3 {
					color: var(--fg-strong);
					font-weight: 600;
					margin: 0;
					margin-bottom: 4px;
					font-size: 1rem;
				}

				.content p {
					color: var(--fg-normal);
					margin: 0;
				}

				@media (max-width: 480px) {
					img {
						display: none;
					}
				}
			`}</style>
		</a>
	</article>
)

export default BookCard
