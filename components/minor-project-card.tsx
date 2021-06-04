import { FC } from 'react'

interface MinorProjectCardProps {
	name: string,
}

const MinorProjectCard: FC<MinorProjectCardProps> = ({ children, name }) => (
	<article>
		<h3>{name}</h3>
		<p>{children}</p>

		<style jsx>{`
			h3 {
				color: var(--fg-strong);
				font-size: 1rem;
				font-weight: 600;
				margin: 0;
				margin-bottom: 4px;
			}

			p {
				color: var(--fg-normal);
				margin: 0;
			}
		`}</style>
	</article>
)

export default MinorProjectCard
