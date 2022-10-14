import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import ping from 'ping'
import * as dotenv from 'dotenv'
dotenv.config()

export const GET: RequestHandler = async () => {
	if (!process.env.WOL_TARGET_IP) {
		throw error(500, 'Please add WOL_TARGET_IP to your .env file')
	}
	const res = await ping.promise.probe(process.env.WOL_TARGET_IP, { timeout: 1, deadline: 1 })
	return json({ online: res.alive })
}
