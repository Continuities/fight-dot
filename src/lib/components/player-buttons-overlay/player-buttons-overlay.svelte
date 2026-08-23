<script lang="ts">
	interface Props {
		keybinds: KeyBinds;
		playerTurn: Player;
	}

	let { keybinds, playerTurn }: Props = $props();

	let p1down = $state(false);
	let p2down = $state(false);

	const keyButton =
		'absolute top-1/2 text-sm w-25 bg-(--light) text-(--fg) font-bold py-2 px-4 border-b-4 border-(--dark) rounded -translate-y-1/2';

	const onkeydown = (e: KeyboardEvent) => {
		if (e.code === keybinds.p1) {
			p1down = true;
		} else if (e.code === keybinds.p2) {
			p2down = true;
		}
	};
	const onkeyup = (e: KeyboardEvent) => {
		if (e.code === keybinds.p1) {
			p1down = false;
		} else if (e.code === keybinds.p2) {
			p2down = false;
		}
	};
</script>

<svelte:window {onkeydown} {onkeyup} />

<button
	style={`--dark:var(--p1);--light:var(--p1${p1down ? '' : '-light'});`}
	class={`${keyButton} ${playerTurn !== 'p1' ? 'opacity-50' : ''} left-4`}>{keybinds.p1}</button
>
<button
	style={`--dark:var(--p2);--light:var(--p2${p2down ? '' : '-light'});`}
	class={`${keyButton} ${playerTurn !== 'p2' ? 'opacity-50' : ''} right-4`}>{keybinds.p2}</button
>
