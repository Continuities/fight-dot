<script lang="ts">
	import { fade } from 'svelte/transition';

	interface Props {
		secondsRemaining: number;
	}
	let { secondsRemaining }: Props = $props();
</script>

<div
	transition:fade={{ duration: 200 }}
	class="pointer-events-none absolute top-1/2 flex w-full items-center justify-center gap-12 text-6xl font-thin"
>
	{secondsRemaining}
</div>
