<script lang="ts">
	import { currentTheme } from '$lib/theme.svelte';
	import KeyButton from '../key-button/key-button.svelte';

	interface Props {
		keybinds: KeyBinds;
		playerTurn: Player;
		paused?: boolean;
		winner?: Player;
	}

	let { keybinds, playerTurn, paused, winner }: Props = $props();

	let p1down = $state(false);
	let p2down = $state(false);

	const keyButton = 'absolute top-1/2 -translate-y-1/2';

	const onkeydown = (e: KeyboardEvent) => {
		if (paused) {
			return;
		}
		if (e.code === keybinds.p1) {
			p1down = true;
		} else if (e.code === keybinds.p2) {
			p2down = true;
		}
	};
	const onkeyup = (e: KeyboardEvent) => {
		if (e.code === keybinds.p1) {
			p1down = false;
		} else if (e.code === keybinds.p2) {
			p2down = false;
		}
	};
</script>

<svelte:window {onkeydown} {onkeyup} />

<div class={`${keyButton} left-4`}>
	<KeyButton
		code={keybinds.p1}
		fg={currentTheme[winner ?? 'p1'].light}
		bg={currentTheme[winner ?? 'p1'].default}
		pressed={p1down}
		active={playerTurn === 'p1'}
	/>
</div>

<div class={`${keyButton} right-4`}>
	<KeyButton
		code={keybinds.p2}
		fg={currentTheme[winner ?? 'p2'].light}
		bg={currentTheme[winner ?? 'p2'].default}
		pressed={p2down}
		active={playerTurn === 'p2'}
	/>
</div>
