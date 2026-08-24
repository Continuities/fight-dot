<script lang="ts">
	import { currentTheme } from '$lib/theme.svelte';
	import KeyButton from '../key-button/key-button.svelte';

	interface Props {
		playerTurn: Player;
		winner?: Player;
	}

	let { playerTurn, winner }: Props = $props();
	const keyButton = 'absolute top-1/2 -translate-y-1/2';
</script>

<div class={`${keyButton} left-4`}>
	<KeyButton
		action="p1"
		fg={currentTheme[winner ?? 'p1'].light}
		bg={currentTheme[winner ?? 'p1'].default}
		active={playerTurn === 'p1'}
	/>
</div>

<div class={`${keyButton} right-4`}>
	<KeyButton
		action="p2"
		fg={currentTheme[winner ?? 'p2'].light}
		bg={currentTheme[winner ?? 'p2'].default}
		active={playerTurn === 'p2'}
	/>
</div>
