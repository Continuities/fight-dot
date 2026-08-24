<script lang="ts">
	import { GameCanvas } from '$lib/components/game-canvas';
	import { PlayerButtonsOverlay } from '$lib/components/player-buttons-overlay';
	import ScoreOverlay from '$lib/components/score-overlay/score-overlay.svelte';
	import TitleOverlay from '$lib/components/title-overlay/title-overlay.svelte';
	import WinnerOverlay from '$lib/components/winner-overlay/winner-overlay.svelte';
	import { EFFECT_ANIMATION_DURATION, DEFAULT_KEYBINDS } from '$lib/config';

	const keybinds = DEFAULT_KEYBINDS;

	let showingTitle = $state(true);
	let winner: Player | undefined = $state();
	let playerTurn: Player = $state('p1');
	let score: Score = $state({
		p1: 0,
		p2: 0
	});
	let currentEffect: Effect | undefined = $state();

	const onGameWon = (player: Player) => {
		score[player]++;
	};

	let effectTimeout: NodeJS.Timeout;
	const triggerEffect = (effect: Effect) => {
		clearTimeout(effectTimeout);
		currentEffect = effect;
		effectTimeout = setTimeout(() => {
			currentEffect = undefined;
		}, EFFECT_ANIMATION_DURATION);
	};

	const onHit = (player: Player) => {
		triggerEffect(`${player}-hit`);
	};

	const onTarget = () => {
		triggerEffect('pulse');
	};

	const onkeydown = (e: KeyboardEvent) => {
		if (showingTitle && e.code === keybinds.next) {
			showingTitle = false;
		}
	};
</script>

<svelte:window {onkeydown} />

<div class="overflow-hidden bg-(--bg)">
	<div class={currentEffect} style={`--duration:${EFFECT_ANIMATION_DURATION}ms`}>
		<GameCanvas
			bind:playerTurn
			bind:winner
			{keybinds}
			{onGameWon}
			{onHit}
			{onTarget}
			paused={showingTitle}
		/>
		<PlayerButtonsOverlay {winner} {keybinds} {playerTurn} paused={showingTitle} />
		{#if winner}
			<WinnerOverlay {winner} {keybinds} />
		{/if}
		{#if score.p1 > 0 || score.p2 > 0}
			<ScoreOverlay {score} />
		{/if}
		{#if showingTitle}
			<TitleOverlay {keybinds} />
		{/if}
	</div>
</div>

<style>
	@keyframes kapow-clockwise {
		0%,
		100% {
			transform: rotate(0);
			filter: contrast(1);
		}
		0% {
			filter: contrast(0.1);
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
			filter: contrast(1);
		}
		0% {
			filter: contrast(0.1);
		}
		10% {
			transform: rotate(1deg) scale(0.95);
		}
		50% {
			transform: rotate(-3deg) scale(1.1);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
			filter: contrast(1);
		}
		0% {
			filter: contrast(0.9);
		}
		50% {
			transform: scale(1.01);
		}
	}

	.p1-hit {
		animation: kapow-clockwise var(--duration) ease-out;
	}
	.p2-hit {
		animation: kapow-anticlockwise var(--duration) ease-out;
	}
	.pulse {
		animation: pulse var(--duration) ease-out;
	}
</style>
