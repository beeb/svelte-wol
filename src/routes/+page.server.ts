import type { Actions } from './$types'
import { invalid } from '@sveltejs/kit'

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
