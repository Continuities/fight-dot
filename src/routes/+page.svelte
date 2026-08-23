<script lang="ts">
	import { GameCanvas } from '$lib/components/game-canvas';
	import { PlayerButtonsOverlay } from '$lib/components/player-buttons-overlay';
	import WinnerOverlay from '$lib/components/winner-overlay/winner-overlay.svelte';

	const KEYBINDS = {
		p1: 'ShiftLeft',
		p2: 'ShiftRight'
	};

	let winner: Player | undefined = $state();
</script>

<GameCanvas bind:winner keybinds={KEYBINDS} />
<PlayerButtonsOverlay keybinds={KEYBINDS} />
{#if winner}
	<WinnerOverlay {winner} />
{/if}
