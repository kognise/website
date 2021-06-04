import { FC } from 'react'

interface DescribedDataProps {
	title: string,
}

const DescribedData: FC<DescribedDataProps> = ({ children, title }) => (
	<div>
		<h2>{title}</h2>

		{children}

		<style jsx>{`
			div {
				width: 100%;
				max-width: 800px;
				align-self: center;
				display: flex;
				flex-direction: column;
				gap: 20px;
			}

			h2 {
				color: var(--fg-strong);
				font-size: 1.5rem;
				font-weight: 600;
				margin: 0;
				margin-bottom: 10px;
			}

			div :global(p) {
				margin: 0;
			}

			div :global(ul) {
				margin: 0;
				list-style-type: circle;
			}

			div :global(a) {
				color: var(--fg-link);
				text-decoration: none;
			}

			div :global(a:hover) {
				text-decoration: underline;
			}
		`}</style>
	</div>
)

export default DescribedData
