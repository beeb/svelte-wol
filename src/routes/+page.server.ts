import type { Actions, PageServerData, PageServerLoad } from './$types'
import { invalid, error } from '@sveltejs/kit'
import ping from 'ping'
import wol from 'wol'

export const actions: Actions = {
	default: async ({ request }) => {
		if (!import.meta.env.VITE_PASSPHRASE) {
			return invalid(500, { missing: true })
		}
		if (!import.meta.env.VITE_TARGET_MAC) {
			return invalid(500, { missing: true })
		}

		const data = await request.formData()
		const passphrase = data.get('passphrase')

		if (passphrase === import.meta.env.VITE_PASSPHRASE) {
			const res = await wol.wake(import.meta.env.VITE_TARGET_MAC)
			if (res) {
				return { success: true }
			}
			return invalid(500, { success: false })
		}
		return invalid(403, { incorrect: true })
	}
}

export const load: PageServerLoad = async (): PageServerData => {
	if (!import.meta.env.VITE_TARGET_IP) {
		throw error(500, 'Please add VITE_TARGET_IP to your .env file')
	}
	if (!import.meta.env.VITE_TARGET_MAC) {
		throw error(500, 'Please add VITE_TARGET_MAC to your .env file')
	}
	if (!import.meta.env.VITE_PASSPHRASE) {
		return error(500, 'Please add VITE_PASSPHRASE to your .env file')
	}
	if (import.meta.env.VITE_PASSPHRASE.length < 8) {
		return error(500, 'Please make VITE_PASSPHRASE longer')
	}

	const res = await ping.promise.probe(import.meta.env.VITE_TARGET_IP, { timeout: 1, deadline: 1 })

	return { online: res.alive }
}
