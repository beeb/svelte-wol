import { env } from '$env/dynamic/private'
import { error, json } from '@sveltejs/kit'
import ping from 'ping'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
	if (!env.WOL_TARGET_IP) {
		throw error(500, 'Please add WOL_TARGET_IP to your .env file')
	}
	const res = await ping.promise.probe(env.WOL_TARGET_IP, { timeout: 1, deadline: 1 })
	return json({ online: res.alive })
}
