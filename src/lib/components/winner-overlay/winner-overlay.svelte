<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { fade } from 'svelte/transition';
	import KeyButton from '../key-button/key-button.svelte';
	interface Props {
		winner: WinState;
	}

	let { winner }: Props = $props();
	let colour: ThemeColour = $derived(winner === 'draw' ? 'fg' : winner);
</script>

<div
	transition:fade={{ duration: 100 }}
	class="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center text-6xl leading-none font-thin tracking-widest text-(--winner) backdrop-blur md:text-8xl"
	style={`--winner:var(--${colour})`}
>
	{#if winner === 'draw'}
		{m.draw()}
	{:else}
		{m.winner({ name: winner.toUpperCase() })}
	{/if}
</div>

<div class="absolute top-1/2 flex w-full justify-center pt-22">
	<KeyButton action="next" active {colour} />
</div>
