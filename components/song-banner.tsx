import { FC } from 'react'
import { SongResponse } from 'pages/api/song'
import { fetcher } from 'lib/fetcher'
import useSWR from 'swr'

const SongBanner: FC = () => {
	const { data } = useSWR<SongResponse>('/api/song', fetcher, { refreshInterval: 120000 })
	
	return (
		<header style={{ opacity: data ? 1 : 0 }}>
			<a href={data?.url} target='_blank' rel='noopener noreferrer'>
				<div className='status'>
					{data?.nowPlaying ? 'What am I currently listening to?' : 'What was the last song I listened to?'}
				</div>
			
				<div className='meta'>
					<div className='song'>{data?.name}</div>
					<div>{data?.artist}<span className='album'> &middot; {data?.album}</span></div>
					<img src={data?.images[1]} />
				</div>
			</a>

			<style jsx>{`
				header {
					width: 100%;
					user-select: none;
				}

				a {
					background: #0b7285;
					color: #adc5c7;
					text-decoration: none;
					padding: 10px 30px;
				}

				a, .meta {
					display: flex;
					flex-direction: row;
					align-items: center;
					gap: 16px;
				}

				img {
					--size: 40px;
					display: block;
					border-radius: 10px;
					width: var(--size);
					height: var(--size);
					pointer-events: none;
				}

				.song {
					color: #ffffff;
					font-weight: 600;
				}

				.status {
					flex: 1;
				}

				@media (max-width: 1300px) {
					.album {
						display: none;
					}
				}

				@media (max-width: 900px) {
					a {
						flex-direction: column;
						align-items: flex-start;
						gap: 10px;
					}

					img {
						display: none;
					}
				}

				@media (max-width: 400px) {
					.meta {
						flex-direction: column;
						align-items: flex-start;
						gap: 10px;
					}
				}
			`}</style>
		</header>
	)
}

export default SongBanner
