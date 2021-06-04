import { ForwardRefRenderFunction, ReactNode, forwardRef } from 'react'

interface PageSectionProps {
	bg: 'primary' | 'secondary',
	children?: ReactNode,
}

const PageSection: ForwardRefRenderFunction<HTMLElement, PageSectionProps> = ({ children, bg }, ref) => (
	<section ref={ref}>
		{children}

		<style jsx>{`
			section {
				display: flex;
				flex-direction: column;
				background: var(--bg-${bg});
				padding: 120px;
				gap: 80px;
			}

			@media (max-width: 760px) {
				section {
					padding: 120px 40px;
				}
			}
		`}</style>
	</section>
)

export default forwardRef(PageSection)
