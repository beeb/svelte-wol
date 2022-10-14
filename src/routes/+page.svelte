<script lang="ts">
	import '../app.css'
	import { onMount } from 'svelte'
	import type { ActionData, PageServerData } from './$types'
	import { enhance } from '$app/forms'

	export let form: ActionData
	export let data: PageServerData

	let pass = ''

	$: disabled = pass.length < 8 || data.online

	onMount(() => {
		const interval = setInterval(async () => {
			const response = await fetch('/alive')
			const result = await response.json()
			console.log(result)
			data.online = result.online
		}, 2500)
		return () => clearInterval(interval)
	})
</script>

<div class="flex justify-center items-center min-h-screen min-w-screen p-8">
	<div class="card flex flex-col w-full max-w-md p-6 gap-4">
		<h1 class="text-2xl font-bold text-center">Remote Wake-on-LAN</h1>
		{#if form?.success && !data.online}
			<div class="text-lg success p-2 rounded-lg text-center">
				The request was sent. Please wait for the computer to wake up.
			</div>
		{/if}
		{#if form?.missing}
			<div class="text-lg error p-2 rounded-lg text-center">Please make sure your .env file is correct.</div>
		{/if}
		<div class="flex items-center gap-4 text-lg">
			<div>Device status:</div>
			{#if data.online}
				<div class="text-success">online</div>
			{:else}
				<div class="text-error">offline</div>
				{#if form?.success}
					<div class="loader" />
				{/if}
			{/if}
		</div>
		<form class="flex flex-col gap-4" method="post" use:enhance>
			<div class="flex items-center gap-4 flex-wrap">
				<label class="text-lg" class:text-error={form?.incorrect} for="passphrase">Passphrase:</label>
				<input
					class={`grow rounded-lg text-lg p-2 border border-slate-300 ${form?.incorrect ? 'border-[#d20f39]' : ''}`}
					type="password"
					id="passphrase"
					name="passphrase"
					disabled={data.online}
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
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	.loader {
		height: 1.2rem;
		width: 1.2rem;
		border-radius: 9999px;
		border-width: 2px;
		animation: spin 2s linear infinite;
		border-top-color: transparent;
		border-left-color: transparent;
		border-bottom-color: #4c4f69;
		border-right-color: #4c4f69;
	}
</style>
