import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import ping from 'ping'

export const GET: RequestHandler = async () => {
	if (!import.meta.env.VITE_TARGET_IP) {
		throw error(500, 'Please add VITE_TARGET_IP to your .env file')
	}
	const res = await ping.promise.probe(import.meta.env.VITE_TARGET_IP, { timeout: 1, deadline: 1 })
	return json({ online: res.alive })
}
