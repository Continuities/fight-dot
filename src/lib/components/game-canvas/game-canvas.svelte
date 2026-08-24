<script lang="ts">
	import { onMount } from 'svelte';
	import { currentTheme } from '$lib/theme.svelte';
	import { lerp, lerpColour } from '$lib/lerp';
	import {
		GUTTER_SIZE,
		PROGRESS_WINDOW,
		STARTING_DOT_SPEED,
		SPEEDUP_ON_HIT,
		TRACK_THICKNESS,
		DOT_SIZE,
		SHOW_FPS,
		WIN_TIME,
		DOT_MAX_SPEED
	} from '$lib/config';

	interface Props {
		winner: Player | undefined;
		playerTurn: Player;
		keybinds: KeyBinds;
		paused?: boolean;
		onGameWon?: (winner: Player) => void;
		onHit?: (hitter: Player) => void;
		onTarget?: () => void;
	}

	let {
		winner = $bindable(),
		playerTurn = $bindable('p1'),
		keybinds,
		paused,
		onGameWon,
		onHit,
		onTarget
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let fps = $state(0);
	let windowHeight = $state(0);
	let windowWidth = $state(0);
	let border = $state(0); // [-1, 1]
	let dotPos = $state(1); // [-1, 1]
	let inTarget = $state(false); // is the ball in the target window

	let isActive = $derived(!winner && !paused);
	let background = $derived(
		lerpColour(currentTheme.p2.dark, currentTheme.p1.dark, (border + 1) / 2)
	);

	let dotSpeed = $state(STARTING_DOT_SPEED);
	let winRange = $derived(WIN_TIME / dotSpeed);

	const resetGame = () => {
		border = 0;
		dotPos = -1;
		playerTurn = 'p1';
		winner = undefined;
		dotSpeed = STARTING_DOT_SPEED;
	};

	const triggerWin = (forPlayer: Player) => {
		winner = forPlayer;
		if (onGameWon) {
			onGameWon(forPlayer);
		}
	};

	const onkeydown = (e: KeyboardEvent) => {
		if (winner) {
			if (e.code === keybinds.next) {
				resetGame();
			}
			return;
		}
		if (!isActive || e.code !== keybinds[playerTurn]) {
			return;
		}
		if (inTarget) {
			if (onHit) {
				onHit(playerTurn);
			}
			border = dotPos;
			dotSpeed = Math.max(dotSpeed - SPEEDUP_ON_HIT, DOT_MAX_SPEED);
			if (border <= winRange - 1) {
				triggerWin('p2');
			} else if (border >= 1 - winRange) {
				triggerWin('p1');
			}
		}
		dotPos = playerTurn === 'p1' ? -1 : 1;
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
			dotPos += (dir * delta * 2) / dotSpeed;
			const wasInTarget = inTarget;
			inTarget =
				dir < 0 ? dotPos <= target && dotPos > border : dotPos >= target && dotPos < border;
			if (dotPos > 1) {
				dotPos = 1;
				playerTurn = 'p1';
			} else if (dotPos < -1) {
				dotPos = -1;
				playerTurn = 'p2';
			}
			if (!wasInTarget && inTarget && onTarget) {
				onTarget();
			}

			if (ctx) {
				const blamAmount = !inTarget ? 0 : Math.abs(dotPos - border) / PROGRESS_WINDOW;
				ctx.fillStyle = `rgb(${background.rgb.join(',')})`;
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
					gutterLength + trackLength / 2 + dotPos * (trackLength / 2 - DOT_SIZE * trackLength),
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
