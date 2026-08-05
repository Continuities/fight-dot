<script lang="ts">
	import { onMount } from 'svelte';

	const SHOW_FPS = true;
	const THEME: Theme = {
		bg: { rgb: [0, 18, 25] },
		fg: { rgb: [233, 216, 166] },
		p1: { rgb: [0, 95, 115] },
		p2: { rgb: [155, 34, 38] }
	};
	const DOT_SIZE = 0.005; // [0, 1] % of screen width
	const TRACK_THICKNESS = 0.003; // [0, 1] % of screen width
	const GUTTER_SIZE = 0.01; // [0, 1] % of screen width
	const DOT_SPEED = 2000; // ms to cross the screen
	const PROGRESS_WINDOW = 0.2; // [0, 1] % of track width
	const WIN_TIME = 300; // ms range of the edge to win
	const WIN_RANGE = WIN_TIME / DOT_SPEED;

	let canvas: HTMLCanvasElement;
	let fps = $state(0);
	let windowHeight = $state(0);
	let windowWidth = $state(0);
	let playerTurn = $state<Player>('p1');
	let border = $state(0); // [-1, 1]
	let ballPos = $state(1); // [-1, 1]
	let inTarget = $state(false); // is the ball in the target window
	let winner = $state<Player>();

	const onclick = () => {
		if (winner) {
			border = 0;
			ballPos = -1;
			playerTurn = 'p1';
			winner = undefined;
			return;
		}
		if (inTarget) {
			border = ballPos;
			if (border <= WIN_RANGE - 1) {
				winner = 'p2';
			} else if (border >= 1 - WIN_RANGE) {
				winner = 'p1';
			}
		}
		ballPos = playerTurn === 'p1' ? -1 : 1;
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
			const delta = Date.now() - lastFrame;
			fps = Math.round(1000 / delta);
			lastFrame = Date.now();

			if (!winner) {
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
					ctx.fillStyle = `rgb(${THEME.bg.rgb.join(',')})`;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					ctx.fillStyle = `rgb(${THEME.fg.rgb.join(',')})`;
					ctx.lineWidth = TRACK_THICKNESS * canvas.width;

					// Draw p1 territory
					ctx.fillStyle = `rgb(${THEME.p1.rgb.join(',')})`;
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
					ctx.fillStyle = `rgb(${THEME.p2.rgb.join(',')})`;
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
						canvas.width / 2 + ballPos * (canvas.width / 2 - DOT_SIZE * canvas.width),
						canvas.height / 2,
						DOT_SIZE * canvas.width * (inTarget ? 2 : 1),
						0,
						Math.PI * 2
					);
					// ctx.strokeStyle = `rgb(${THEME.fg.rgb.join(',')})`;
					// ctx.stroke();
					if (playerTurn === 'p1') {
						ctx.fillStyle = `rgb(${THEME.p1.rgb.join(',')})`;
					} else {
						ctx.fillStyle = `rgb(${THEME.p2.rgb.join(',')})`;
					}
					ctx.fill();
				}
			}
			requestAnimationFrame(draw);
		})();
	});
</script>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />

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
