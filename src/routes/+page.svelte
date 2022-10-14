<script lang="ts">
	import '../app.css'
	import type { ActionData } from './$types'
	import { enhance } from '$app/forms'

	export let form: ActionData

	let pass = ''

	$: disabled = pass.length < 3
</script>

<div class="flex justify-center items-center min-h-screen min-w-screen p-8">
	<div class="card flex flex-col w-full max-w-md p-6 gap-4">
		<h1 class="text-2xl font-bold text-center">Remote Wake-on-LAN</h1>
		{#if form?.success}
			<div class="text-lg success p-2 rounded-lg text-center">
				The request was sent. Please wait for the computer to wake up.
			</div>
		{/if}
		{#if form?.missing}
			<div class="text-lg error p-2 rounded-lg text-center">
				Please add <span class="font-mono">VITE_PASSPHRASE</span> to .env
			</div>
		{/if}
		<div class="flex items-center gap-4 text-lg">
			<div>Device status:</div>
			<div class="text-success">online</div>
			<div class="text-error">offline</div>
		</div>
		<form class="flex flex-col gap-4" method="post" use:enhance>
			<div class="flex items-center gap-4 flex-wrap">
				<label class="text-lg" class:text-error={form?.incorrect} for="passphrase">Passphrase:</label>
				<input
					class={`grow rounded-lg text-lg p-2 border border-slate-300 ${form?.incorrect ? 'border-[#d20f39]' : ''}`}
					type="password"
					id="passphrase"
					name="passphrase"
					bind:value={pass}
				/>
				{#if form?.incorrect}
					<div class="text-error grow text-center">Wrong credentials</div>
				{/if}
			</div>
			<div class="flex justify-center">
				<button
					class="primary p-3 rounded-lg text-lg uppercase disabled:opacity-50 disabled:cursor-not-allowed"
					type="submit"
					{disabled}>Wake up!</button
				>
			</div>
		</form>
	</div>
</div>

<svelte:head>
	<title>Remote Wake-on-LAN</title>
</svelte:head>

<style>
	.card {
		border-radius: 24px;
		background: #dce0e8;
		box-shadow: 14px 14px 28px #c4c7ce, -14px -14px 28px #f4f9ff;
	}
	.primary {
		@apply bg-[#7287fd] text-white;
	}
	.success {
		@apply bg-[#40a02b] text-white;
	}
	.error {
		@apply bg-[#d20f39] text-white;
	}
	.text-error {
		@apply text-[#d20f39];
	}
	.text-success {
		@apply text-[#40a02b];
	}
</style>
