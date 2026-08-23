<script lang="ts">
	import { GameCanvas } from '$lib/components/game-canvas';
	import { PlayerButtonsOverlay } from '$lib/components/player-buttons-overlay';
	import ScoreOverlay from '$lib/components/score-overlay/score-overlay.svelte';
	import WinnerOverlay from '$lib/components/winner-overlay/winner-overlay.svelte';

	const KEYBINDS = {
		p1: 'ShiftLeft',
		p2: 'ShiftRight'
	};

	let winner: Player | undefined = $state();
	let playerTurn: Player = $state('p1');
	let score: Score = $state({
		p1: 0,
		p2: 0
	});

	const onGameWon = (player: Player) => {
		score[player]++;
	};
</script>

<GameCanvas bind:playerTurn bind:winner keybinds={KEYBINDS} {onGameWon} />
<PlayerButtonsOverlay keybinds={KEYBINDS} {playerTurn} />
{#if winner}
	<WinnerOverlay {winner} />
{/if}
<ScoreOverlay {score} />
