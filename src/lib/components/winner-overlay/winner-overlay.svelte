<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { currentTheme } from '$lib/theme.svelte';
	import { fade } from 'svelte/transition';
	import KeyButton from '../key-button/key-button.svelte';
	interface Props {
		winner: Player;
	}

	let { winner }: Props = $props();
</script>

<div
	transition:fade={{ duration: 100 }}
	class="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center text-9xl leading-none font-thin tracking-widest text-(--winner) backdrop-blur"
	style={`--winner:var(--${winner})`}
>
	{m.winner({ name: winner.toUpperCase() })}
</div>

<div class="absolute bottom-1/4 flex w-full justify-center">
	<KeyButton
		action="next"
		active
		fg={currentTheme[winner].light}
		bg={currentTheme[winner].default}
	/>
</div>
