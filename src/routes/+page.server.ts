import { env } from '$env/dynamic/private'
import { error, fail } from '@sveltejs/kit'
import ping from 'ping'
import wol from 'wol'

export const actions = {
	default: async ({ request }) => {
		if (!env.WOL_PASSPHRASE) {
			return fail(500, { missing: true })
		}
		if (!env.WOL_TARGET_MAC) {
			return fail(500, { missing: true })
		}

		const data = await request.formData()
		const passphrase = data.get('passphrase')

		if (passphrase === env.WOL_PASSPHRASE) {
			const res = await wol.wake(env.WOL_TARGET_MAC)
			if (res) {
				return { success: true }
			}
			return fail(500, { success: false })
		}
		return fail(403, { incorrect: true })
	},
}

export const load = async () => {
	if (!env.WOL_TARGET_IP) {
		throw error(500, 'Please add WOL_TARGET_IP to your .env file')
	}
	if (!env.WOL_TARGET_MAC) {
		throw error(500, 'Please add WOL_TARGET_MAC to your .env file')
	}
	if (!env.WOL_PASSPHRASE) {
		throw error(500, 'Please add WOL_PASSPHRASE to your .env file')
	}
	if (env.WOL_PASSPHRASE.length < 8) {
		throw error(500, 'Please make WOL_PASSPHRASE longer')
	}

	const res = await ping.promise.probe(env.WOL_TARGET_IP, { timeout: 1, deadline: 1 })

	return { online: res.alive }
}
