<script lang="ts">
	import { GameCanvas } from '$lib/components/game-canvas';
	import WinnerOverlay from '$lib/components/winner-overlay/winner-overlay.svelte';
	let winner: Player | undefined = $state();
</script>

<GameCanvas bind:winner />
{#if winner}
	<WinnerOverlay {winner} />
{/if}
