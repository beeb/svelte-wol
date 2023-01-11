import type { Handle } from '@sveltejs/kit'
import rateLimit from './lib/rateLimit'

const limiter = rateLimit({
	interval: 10 * 1000, // usage period is 10 seconds
	uniqueTokenPerInterval: 10 // max 10 users concurrently
})

export const handle: Handle = async ({ event, resolve }) => {
	let { isRateLimited, limit, remaining } = limiter.check(10, event.getClientAddress())
	let response = new Response('rate limited')
	if (!isRateLimited) {
		response = await resolve(event)
	}
	response.headers.set('X-RateLimit-Limit', `${limit}`)
	response.headers.set('X-RateLimit-Remaining', `${remaining}`)

	return response
}
