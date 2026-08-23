<script lang="ts">
	import { GameCanvas } from '$lib/components/game-canvas';
	import { PlayerButtonsOverlay } from '$lib/components/player-buttons-overlay';
	import ScoreOverlay from '$lib/components/score-overlay/score-overlay.svelte';
	import TitleOverlay from '$lib/components/title-overlay/title-overlay.svelte';
	import WinnerOverlay from '$lib/components/winner-overlay/winner-overlay.svelte';

	const HIT_ANIMATION_DURATION = 200; // ms
	const KEYBINDS = {
		p1: 'ShiftLeft',
		p2: 'ShiftRight',
		next: 'Space'
	};

	let showingTitle = $state(true);
	let winner: Player | undefined = $state();
	let playerTurn: Player = $state('p1');
	let score: Score = $state({
		p1: 0,
		p2: 0
	});
	let lastHit: Player | undefined = $state();
	let hitClass = $derived(
		lastHit === 'p1' ? 'kapow-p1' : lastHit === 'p2' ? 'kapow-p2' : undefined
	);

	const onGameWon = (player: Player) => {
		score[player]++;
	};

	let hitTimeout: NodeJS.Timeout;
	const onHit = (player: Player) => {
		clearTimeout(hitTimeout);
		lastHit = player;
		hitTimeout = setTimeout(() => {
			lastHit = undefined;
		}, HIT_ANIMATION_DURATION);
	};

	const onkeydown = (e: KeyboardEvent) => {
		if (showingTitle && e.code === KEYBINDS.next) {
			showingTitle = false;
		}
	};
</script>

<svelte:window {onkeydown} />

<div class="overflow-hidden bg-(--bg)">
	<div class={hitClass} style={`--duration:${HIT_ANIMATION_DURATION}ms`}>
		<GameCanvas
			bind:playerTurn
			bind:winner
			keybinds={KEYBINDS}
			{onGameWon}
			{onHit}
			paused={showingTitle}
		/>
		<PlayerButtonsOverlay keybinds={KEYBINDS} {playerTurn} />
		{#if winner}
			<WinnerOverlay {winner} keybinds={KEYBINDS} />
		{/if}
		{#if score.p1 > 0 || score.p2 > 0}
			<ScoreOverlay {score} />
		{/if}
		{#if showingTitle}
			<TitleOverlay keybinds={KEYBINDS} />
		{/if}
	</div>
</div>

<style>
	@keyframes kapow-clockwise {
		0%,
		100% {
			transform: rotate(0);
		}
		10% {
			transform: rotate(-1deg) scale(0.95);
		}
		50% {
			transform: rotate(3deg) scale(1.1);
		}
	}

	@keyframes kapow-anticlockwise {
		0%,
		100% {
			transform: rotate(0);
		}
		10% {
			transform: rotate(1deg) scale(0.95);
		}
		50% {
			transform: rotate(-3deg) scale(1.1);
		}
	}

	.kapow-p1 {
		animation: kapow-clockwise var(--duration) ease-out;
	}
	.kapow-p2 {
		animation: kapow-anticlockwise var(--duration) ease-out;
	}
</style>
