<script lang="ts">
	import { onDestroy } from 'svelte';
	import { DEFAULT_KEYBINDS } from '$lib/config';
	import Input, { updateState } from '$lib/input.svelte';

	interface Props {
		action: InputAction;
		fg: Colour;
		bg: Colour;
		active?: boolean;
	}
	let { action, fg, bg, active }: Props = $props();
	const code = $derived(DEFAULT_KEYBINDS[action]);
	const pressed = $derived(Input[action].current);

	const onpointerdown = () => {
		updateState(action, true);
	};
	const onpointerup = () => {
		updateState(action, false);
	};

	onDestroy(() => {
		updateState(action, false);
	});
</script>

<button
	{onpointerdown}
	{onpointerup}
	style={`--dark:rgb(${bg.rgb.join(',')});--light:rgb(${(pressed ? bg : fg).rgb.join(',')})`}
	class={`w-25 rounded border-b-4 border-(--dark) bg-(--light) px-4 py-2 text-sm font-medium tracking-wider text-(--fg) ${
		!active ? 'opacity-50' : ''
	} left-4`}>{code}</button
>
