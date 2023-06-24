import rateLimit from './lib/rateLimit'
import type { Handle } from '@sveltejs/kit'

const limiter = rateLimit({
	interval: 60 * 1000, // usage period is 1 minute
	uniqueTokenPerInterval: 500, // max 500 distinct IPs (to avoid using too much memory)
})

export const handle: Handle = async ({ event, resolve }) => {
	// limit to 100 requests per minute
	const { isRateLimited, limit, remaining } = limiter.check(100, event.getClientAddress())
	let response = new Response('rate limited')
	if (!isRateLimited) {
		response = await resolve(event)
	}
	response.headers.set('X-RateLimit-Limit', `${limit}`)
	response.headers.set('X-RateLimit-Remaining', `${remaining}`)

	return response
}
