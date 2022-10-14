import type { Actions, PageServerData, PageServerLoad } from './$types'
import { invalid, error } from '@sveltejs/kit'
import ping from 'ping'
import wol from 'wol'
import * as dotenv from 'dotenv'
dotenv.config()

export const actions: Actions = {
	default: async ({ request }) => {
		if (!process.env.WOL_PASSPHRASE) {
			return invalid(500, { missing: true })
		}
		if (!process.env.WOL_TARGET_MAC) {
			return invalid(500, { missing: true })
		}

		const data = await request.formData()
		const passphrase = data.get('passphrase')

		if (passphrase === process.env.WOL_PASSPHRASE) {
			const res = await wol.wake(process.env.WOL_TARGET_MAC)
			if (res) {
				return { success: true }
			}
			return invalid(500, { success: false })
		}
		return invalid(403, { incorrect: true })
	}
}

export const load: PageServerLoad = async (): PageServerData => {
	if (!process.env.WOL_TARGET_IP) {
		throw error(500, 'Please add WOL_TARGET_IP to your .env file')
	}
	if (!process.env.WOL_TARGET_MAC) {
		throw error(500, 'Please add WOL_TARGET_MAC to your .env file')
	}
	if (!process.env.WOL_PASSPHRASE) {
		return error(500, 'Please add WOL_PASSPHRASE to your .env file')
	}
	if (process.env.WOL_PASSPHRASE.length < 8) {
		return error(500, 'Please make WOL_PASSPHRASE longer')
	}

	const res = await ping.promise.probe(process.env.WOL_TARGET_IP, { timeout: 1, deadline: 1 })

	return { online: res.alive }
}
