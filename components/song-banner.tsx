import { FC } from 'react'
import { SongResponse } from 'pages/api/song'
import { fetcher } from 'lib/fetcher'
import useSWR from 'swr'

const SongBanner: FC = () => {
	const { data } = useSWR<SongResponse>('/api/song', fetcher)
	
	return (
		<header style={{ opacity: data ? 1 : 0 }}>
			<a href={data?.url} target='_blank' rel='noopener noreferrer'>
				<div className='status'>
					{data?.nowPlaying ? 'What am I currently listening to?' : 'What was the last song I listened to?'}
				</div>
			
				<div className='song'>{data?.name}</div>
				<div>{data?.artist} &middot; {data?.album}</div>
				<img src={data?.images[1]} />
			</a>

			<style jsx>{`
				header {
					position: fixed;
					bottom: 0;
					left: 0;
					width: 100%;
					z-index: 9;
					transition: opacity 1s ease-in-out;
					user-select: none;
				}

				a {
					background: #0b7285;
					color: #adc5c7;
					text-decoration: none;
					padding: 10px 30px;
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
			`}</style>
		</header>
	)
}

export default SongBanner
