import { NextApiHandler } from 'next'

export interface StatusResponse {
	up: boolean,
}

const handler: NextApiHandler<StatusResponse> = async (req, res) => {
	const fetchRes = await fetch('https://kognise.instatus.com/summary.json')
	const up = (await fetchRes.json()).page.status === 'UP'

	res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=60')
	res.json({ up })
}

export default handler
