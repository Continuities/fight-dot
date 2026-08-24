<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { currentTheme } from '$lib/theme.svelte';
	import { fade } from 'svelte/transition';
	import KeyButton from '../key-button/key-button.svelte';

	interface Props {
		keybinds: KeyBinds;
		close: () => void;
	}

	let { keybinds, close }: Props = $props();
</script>

<svelte:window {onkeydown} />

<div
	transition:fade={{ duration: 100 }}
	class="absolute top-0 flex h-full w-full items-center justify-center text-8xl font-thin tracking-widest text-(--fg) backdrop-blur-2xl"
>
	{m.title()}
</div>

<div class="absolute bottom-1/3 flex w-full justify-center">
	<KeyButton
		active
		code={keybinds.next}
		fg={currentTheme.p1.light}
		bg={currentTheme.p1.default}
		onclick={close}
	/>
</div>
