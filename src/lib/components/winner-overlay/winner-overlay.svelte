<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	interface Props {
		winner: Player;
	}

	let { winner }: Props = $props();
</script>

<div
	class="pointer-events-none absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center text-9xl leading-none text-(--winner) backdrop-blur"
	style={`--winner:var(--${winner})`}
>
	{m.winner({ name: winner.toUpperCase() })}
</div>
