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
		DOT_MAX_SPEED,
		SHINE_SIZE,
		SHINE_SPEED,
		SHINE_DELAY
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

	let shines: Shine[] = [];

	const getNextPosition = (pos: number, speed: number, delta: number, dir: 1 | -1 = 1) => {
		return pos + (dir * delta * 2) / speed;
	};

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
			const newShine = {
				headPosition: border,
				speed: (playerTurn === 'p1' ? 1 : -1) * SHINE_SPEED,
				tailLength: SHINE_SIZE
			};
			setTimeout(() => {
				shines.push(newShine);
			}, SHINE_DELAY);
			border = dotPos;
			dotSpeed = Math.max(dotSpeed - SPEEDUP_ON_HIT, DOT_MAX_SPEED);
			if (border <= winRange - 1) {
				border = -1;
				triggerWin('p2');
			} else if (border >= 1 - winRange) {
				border = 1;
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
			const delta = Date.now() - lastFrame;
			fps = Math.round(1000 / (Date.now() - lastFrame));
			lastFrame = Date.now();

			const gutterLength = GUTTER_SIZE * canvas.width;
			const trackLength = canvas.width - gutterLength * 2;
			const dir = playerTurn === 'p1' ? -1 : 1;
			const target = border - dir * PROGRESS_WINDOW;
			const wasInTarget = inTarget;
			const barToScreenPosition = (pos: number) => {
				return gutterLength + trackLength / 2 + pos * (trackLength / 2);
			};

			if (isActive) {
				dotPos = getNextPosition(dotPos, dotSpeed, delta, dir);
			}
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
				if (isActive) {
					ctx.beginPath();
					ctx.arc(
						barToScreenPosition(dotPos),
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

				const shouldDrawShine = (shine: Shine) => {
					if (shine.speed > 0) {
						// moving right
						return shine.headPosition - shine.tailLength < border;
					}
					// moving left
					return shine.headPosition + shine.tailLength > border;
				};

				// Draw shiny thingsa
				shines = shines
					.map<Shine>((shine) => {
						const newPos = getNextPosition(shine.headPosition, shine.speed, delta);
						ctx.beginPath();
						if (shine.speed > 0) {
							// moving right
							const tailPosition = Math.max(-1, shine.headPosition - shine.tailLength);
							const headDistance = Math.abs(-1 - shine.headPosition);
							const tailRemaining =
								shine.headPosition < border ? shine.tailLength : border - tailPosition;
							const trimmedTail = Math.min(shine.tailLength, headDistance, tailRemaining);
							ctx.fillStyle = `rgb(${currentTheme.p1.light.rgb.join(',')})`;
							ctx.roundRect(
								barToScreenPosition(tailPosition),
								canvas.height / 2 - (canvas.width * TRACK_THICKNESS) / 2,
								(trackLength * trimmedTail) / 2,
								canvas.width * TRACK_THICKNESS,
								(TRACK_THICKNESS * canvas.width) / 4
							);
						} else {
							// moving left
							const tailPosition = Math.min(1, shine.headPosition + shine.tailLength);
							const headDistance = Math.abs(1 - shine.headPosition);
							const tailRemaining =
								shine.headPosition > border ? shine.tailLength : tailPosition - border;
							const trimmedTail = Math.min(shine.tailLength, headDistance, tailRemaining);
							ctx.fillStyle = `rgb(${currentTheme.p2.light.rgb.join(',')})`;
							ctx.roundRect(
								barToScreenPosition(Math.max(border, shine.headPosition)),
								canvas.height / 2 - (canvas.width * TRACK_THICKNESS) / 2,
								(trackLength * trimmedTail) / 2,
								canvas.width * TRACK_THICKNESS,
								(TRACK_THICKNESS * canvas.width) / 4
							);
						}
						ctx.fill();
						return {
							...shine,
							headPosition: newPos
						};
					})
					.filter(shouldDrawShine);
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
