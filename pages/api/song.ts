import { NextApiHandler } from 'next'

export interface SongResponse {
	name: string,
	artist: string,
	album: string,
	images: string[],
	nowPlaying: boolean,
	url: string,
}

const handler: NextApiHandler<SongResponse> = async (req, res) => {
	const fetchRes = await fetch(`https://ws.audioscrobbler.com/2.0/?user=kognise&api_key=${process.env.LASTFM_API_KEY}&format=json&method=user.getrecenttracks&limit=1`)
	const track = (await fetchRes.json()).recenttracks.track[0]

	res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=10')
	res.json({
		name: track.name,
		artist: track.artist['#text'],
		album: track.album['#text'],
		images: track.image.map((image: { '#text': string }) => image['#text']),
		nowPlaying: track['@attr']?.nowplaying === 'true',
		url: track.url,
	})
}

export default handler
