<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { currentTheme } from '$lib/theme.svelte';
	import KeyButton from '../key-button/key-button.svelte';
	interface Props {
		winner: Player;
		keybinds: KeyBinds;
	}

	let { winner, keybinds }: Props = $props();
</script>

<div
	class="pointer-events-none absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center text-9xl leading-none text-(--winner) backdrop-blur"
	style={`--winner:var(--${winner})`}
>
	{m.winner({ name: winner.toUpperCase() })}
	<div class="absolute bottom-1/4">
		<KeyButton
			code={keybinds.next}
			active
			fg={currentTheme[winner].light}
			bg={currentTheme[winner].default}
		/>
	</div>
</div>
