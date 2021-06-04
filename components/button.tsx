import { FC } from 'react'

interface ButtonProps {
	onClick?: () => void,
	role?: string,
}

const Button: FC<ButtonProps> = ({ children, onClick, role }) => (
	<button onClick={onClick} role={role}>
		{children}

		<style jsx>{`
			button {
				background: none;
				border: 2px solid var(--fg-very-light);
				color: var(--fg-normal);
				font-weight: 600;
				font-family: inherit;
				font-size: 1.125rem;
				padding: 16px 44px;
				height: 58px;
				border-radius: 29px;
				transition: 200ms all;
				cursor: pointer;
				outline: none;
				user-select: none;
			}

			button:hover, button:focus {
				color: var(--fg-strong);
				background: var(--bg-secondary);
			}

			button:focus-visible {
				border-color: var(--fg-normal);
			}
		`}</style>
	</button>
)

export default Button
