import type { APIRoute } from 'astro'

export const POST: APIRoute = async (ctx) => {
	try {
		const url = new URL(ctx.request.url)
		
		const source = url.searchParams.get('source') || null
		const email = url.searchParams.get('email')
		if (!email || !/^.+\@.+\..+$/.test(email)) {
			throw new Error('Invalid email address')
		}

		const res = await fetch(`https://s1.kognise.dev/db/${encodeURIComponent(email)}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${import.meta.env.NEWSLETTER_S1_TOKEN}`
			},
			body: JSON.stringify({
				email,
				source,
				timestamp: new Date().toISOString()
			})
		})
		if (!res.ok) {
			console.error(await res.text())
			throw new Error('Unexpected database error')
		}
		return new Response('OK')
	} catch (error) {
		console.error(error)
		return new Response(error.message, { status: 400 })
	}
}
