import { FC } from 'react'

interface ColorProps {
	color: 'very-light' | 'light' | 'normal' | 'strong' | 'very-strong',
}

const Color: FC<ColorProps> = ({ children, color }) => (
	<span>
		{children}

		<style jsx>{`
			span {
				color: var(--fg-${color});
			}
		`}</style>
	</span>
)

export default Color
