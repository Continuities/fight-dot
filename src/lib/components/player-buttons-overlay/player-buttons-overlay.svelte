<script lang="ts">
	import KeyButton from '../key-button/key-button.svelte';

	interface Props {
		playerTurn: Player;
		winner?: Player;
	}

	let { playerTurn, winner }: Props = $props();
	const keyButton = 'absolute top-1/2 -translate-y-1/2';
</script>

<div class={`${keyButton} left-4`}>
	<KeyButton action="p1" colour={winner ?? 'p1'} active={playerTurn === 'p1'} />
</div>

<div class={`${keyButton} right-4`}>
	<KeyButton action="p2" colour={winner ?? 'p2'} active={playerTurn === 'p2'} />
</div>
