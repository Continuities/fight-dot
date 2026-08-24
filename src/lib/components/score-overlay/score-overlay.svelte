<script lang="ts">
	import { fade } from 'svelte/transition';

	interface Props {
		score: Score;
	}
	let { score }: Props = $props();
</script>

<div
	transition:fade={{ duration: 200 }}
	class="pointer-events-none absolute top-1/2 -mt-30 flex w-full items-center justify-center gap-12 text-6xl font-thin"
>
	<div class="text-(--p1)">{score.p1}</div>
	<div class="text-(--p2)">{score.p2}</div>
</div>
