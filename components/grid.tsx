import { FC } from 'react'

interface GridProps {
	gap: number,
	rowGap?: number,
	columnSize: number,
}

const Grid: FC<GridProps> = ({ children, gap, rowGap, columnSize }) => (
	<div>
		{children}

		<style jsx>{`
			div {
				display: grid;
				justify-content: center;
  				grid-template-columns: repeat(auto-fit, minmax(0, ${columnSize}px));
				gap: ${gap}px;
				row-gap: ${rowGap || gap}px;
			}
		`}</style>
	</div>
)

export default Grid
