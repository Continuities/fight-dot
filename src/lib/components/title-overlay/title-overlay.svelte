<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { fade } from 'svelte/transition';
	import KeyButton from '../key-button/key-button.svelte';
	import Input from '$lib/input.svelte';

	interface Props {
		close: () => void;
	}

	let { close }: Props = $props();

	$effect(() => {
		if (Input.next.current) {
			close();
		}
	});
</script>

<div
	transition:fade={{ duration: 100 }}
	class="absolute top-0 flex h-full w-full items-center justify-center text-xl font-thin tracking-widest text-(--fg) backdrop-blur-2xl md:text-6xl xl:text-8xl"
>
	{m.title()}
</div>

<div class="absolute top-1/2 flex w-full justify-center pt-22">
	<KeyButton active action="next" colour="fg" />
</div>
