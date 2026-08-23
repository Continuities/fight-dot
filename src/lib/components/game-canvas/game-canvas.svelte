<script lang="ts">
	import { onMount } from 'svelte';
	import { currentTheme } from '$lib/theme.svelte';
	import { lerp, lerpColour } from '$lib/lerp';

	interface Props {
		winner: Player | undefined;
		playerTurn: Player;
		keybinds: KeyBinds;
		paused?: boolean;
		onGameWon?: (winner: Player) => void;
	}

	const SHOW_FPS = true;
	const DOT_SIZE = 0.006; // [0, 1] % of screen width
	const TRACK_THICKNESS = 0.003; // [0, 1] % of screen width
	const GUTTER_SIZE = 0.08; // [0, 1] % of screen width
	const DOT_SPEED = 2000; // ms to cross the screen
	const PROGRESS_WINDOW = 0.2; // [0, 1] % of track width
	const WIN_TIME = 300; // ms range of the edge to win
	const WIN_RANGE = WIN_TIME / DOT_SPEED;

	let {
		winner = $bindable(),
		playerTurn = $bindable('p1'),
		keybinds,
		paused,
		onGameWon
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let fps = $state(0);
	let windowHeight = $state(0);
	let windowWidth = $state(0);
	let border = $state(0); // [-1, 1]
	let ballPos = $state(1); // [-1, 1]
	let inTarget = $state(false); // is the ball in the target window

	let isActive = $derived(!winner && !paused);

	const resetGame = () => {
		border = 0;
		ballPos = -1;
		playerTurn = 'p1';
		winner = undefined;
	};

	const triggerWin = (forPlayer: Player) => {
		winner = forPlayer;
		if (onGameWon) {
			onGameWon(forPlayer);
		}
	};

	const onkeydown = (e: KeyboardEvent) => {
		if (winner) {
			resetGame();
			return;
		}
		if (!isActive || e.code !== keybinds[playerTurn]) {
			return;
		}
		if (inTarget) {
			border = ballPos;
			if (border <= WIN_RANGE - 1) {
				triggerWin('p2');
			} else if (border >= 1 - WIN_RANGE) {
				triggerWin('p1');
			}
		}
		ballPos = playerTurn === 'p1' ? -1 : 1;
	};

	const onclick = () => {
		if (winner) {
			resetGame();
		}
	};

	onMount(() => {
		windowHeight = window.innerHeight;
		windowWidth = window.innerWidth;
		window.addEventListener('resize', () => {
			windowHeight = window.innerHeight;
			windowWidth = window.innerWidth;
		});
		const ctx = canvas.getContext('2d');
		let lastFrame = Date.now();
		(function draw() {
			const delta = !isActive ? 0 : Date.now() - lastFrame;
			fps = Math.round(1000 / (Date.now() - lastFrame));
			lastFrame = Date.now();

			const gutterLength = GUTTER_SIZE * canvas.width;
			const trackLength = canvas.width - gutterLength * 2;
			const dir = playerTurn === 'p1' ? -1 : 1;
			const target = border - dir * PROGRESS_WINDOW;
			ballPos += (dir * delta * 2) / DOT_SPEED;
			inTarget =
				dir < 0 ? ballPos <= target && ballPos > border : ballPos >= target && ballPos < border;
			if (ballPos > 1) {
				ballPos = 1;
				playerTurn = 'p1';
			} else if (ballPos < -1) {
				ballPos = -1;
				playerTurn = 'p2';
			}

			if (ctx) {
				const blamAmount = !inTarget ? 0 : Math.abs(ballPos - border) / PROGRESS_WINDOW;
				ctx.fillStyle = `rgb(${lerpColour(currentTheme.bg, currentTheme.fg, blamAmount).rgb.join(',')})`;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = `rgb(${currentTheme.fg.rgb.join(',')})`;
				ctx.lineWidth = TRACK_THICKNESS * canvas.width;

				// Draw p1 territory
				ctx.fillStyle = `rgb(${currentTheme.p1.default.rgb.join(',')})`;
				ctx.beginPath();
				ctx.roundRect(
					gutterLength,
					canvas.height / 2 - (canvas.width * TRACK_THICKNESS) / 2,
					trackLength / 2 + border * (trackLength / 2),
					canvas.width * TRACK_THICKNESS,
					(TRACK_THICKNESS * canvas.width) / 4
				);
				ctx.fill();

				// Draw p2 territory
				ctx.fillStyle = `rgb(${currentTheme.p2.default.rgb.join(',')})`;
				ctx.beginPath();
				ctx.roundRect(
					gutterLength + trackLength / 2 + (trackLength / 2) * border,
					canvas.height / 2 - (canvas.width * TRACK_THICKNESS) / 2,
					trackLength / 2 - border * (trackLength / 2),
					canvas.width * TRACK_THICKNESS,
					(TRACK_THICKNESS * canvas.width) / 4
				);
				ctx.fill();

				// Draw the ball
				ctx.beginPath();
				ctx.arc(
					gutterLength + trackLength / 2 + ballPos * (trackLength / 2 - DOT_SIZE * trackLength),
					canvas.height / 2,
					DOT_SIZE * canvas.width * lerp(1, 3, blamAmount),
					0,
					Math.PI * 2
				);
				if (playerTurn === 'p1') {
					ctx.fillStyle = `rgb(${currentTheme.p1.default.rgb.join(',')})`;
				} else {
					ctx.fillStyle = `rgb(${currentTheme.p2.default.rgb.join(',')})`;
				}
				ctx.fill();
			}
			requestAnimationFrame(draw);
		})();
	});
</script>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} {onkeydown} />

{#if SHOW_FPS}
	<div class="absolute top-0 left-0 m-2 text-white">
		FPS: {fps}
	</div>
{/if}
<canvas
	{onclick}
	class="h-screen w-screen"
	bind:this={canvas}
	height={windowHeight}
	width={windowWidth}
></canvas>
