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
	const INITIAL_DOT_SPEED = 5000; // ms to cross the screen

	let canvas: HTMLCanvasElement;
	let fps = $state(0);
	let windowHeight = $state(0);
	let windowWidth = $state(0);
	let playerTurn = $state<Player>('p1');

	onMount(() => {
		windowHeight = window.innerHeight;
		windowWidth = window.innerWidth;
		window.addEventListener('resize', () => {
			windowHeight = window.innerHeight;
			windowWidth = window.innerWidth;
		});
		const ctx = canvas.getContext('2d');
		let lastFrame = Date.now();
		let ballPos = 0; // [-1, 1]
		(function draw() {
			const delta = Date.now() - lastFrame;
			fps = Math.round(1000 / delta);
			lastFrame = Date.now();

			const dir = playerTurn === 'p1' ? 1 : -1;
			ballPos += (dir * delta * 2) / INITIAL_DOT_SPEED;
			if (ballPos > 1) {
				ballPos = 1;
				playerTurn = 'p2';
			} else if (ballPos < -1) {
				ballPos = -1;
				playerTurn = 'p1';
			}

			if (ctx) {
				ctx.fillStyle = `rgb(${THEME.bg.rgb.join(',')})`;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = `rgb(${THEME.fg.rgb.join(',')})`;
				ctx.beginPath();
				ctx.roundRect(
					GUTTER_SIZE * canvas.width,
					canvas.height / 2 - (canvas.width * TRACK_THICKNESS) / 2,
					canvas.width - GUTTER_SIZE * 2 * canvas.width,
					canvas.width * TRACK_THICKNESS,
					(TRACK_THICKNESS * canvas.width) / 4
				);
				ctx.arc(
					canvas.width / 2 + ballPos * (canvas.width / 2 - DOT_SIZE * canvas.width),
					canvas.height / 2,
					DOT_SIZE * canvas.width,
					0,
					Math.PI * 2
				);
				ctx.fill();
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
<canvas class="h-screen w-screen" bind:this={canvas} height={windowHeight} width={windowWidth}
></canvas>
