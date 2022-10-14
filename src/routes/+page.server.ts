import type { Actions, PageServerData, PageServerLoad } from './$types'
import { invalid, error } from '@sveltejs/kit'
import ping from 'ping'

export const actions: Actions = {
	default: async ({ request }) => {
		if (!import.meta.env.VITE_PASSPHRASE) {
			return invalid(500, { missing: true })
		}

		const data = await request.formData()
		const passphrase = data.get('passphrase')

		if (passphrase === import.meta.env.VITE_PASSPHRASE) {
			// TODO: implement WOL
			return { success: true }
		}
		return invalid(403, { incorrect: true })
	}
}

export const load: PageServerLoad = async (): PageServerData => {
	if (!import.meta.env.VITE_TARGET_IP) {
		throw error(500, 'Please add VITE_TARGET_IP to your .env file')
	}
	if (!import.meta.env.VITE_PASSPHRASE) {
		return error(500, 'Please add VITE_PASSPHRASE to your .env file')
	}
	if (import.meta.env.VITE_PASSPHRASE.length < 8) {
		return error(500, 'Please make VITE_PASSPHRASE longer')
	}

	const online = await ping.promise.probe(import.meta.env.VITE_TARGET_IP, { timeout: 2 })

	// TODO ping machine
	return { online }
}
