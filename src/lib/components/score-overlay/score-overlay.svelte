<script lang="ts">
	import { fade } from 'svelte/transition';

	interface Props {
		score: Score;
	}
	let { score }: Props = $props();
</script>

<div
	transition:fade={{ duration: 200 }}
	class="absolute top-0 flex h-full w-full items-center justify-center gap-12 text-6xl font-thin"
>
	<div class="mt-52 text-(--p1)">{score.p1}</div>
	<div class="mt-52 text-(--p2)">{score.p2}</div>
</div>
