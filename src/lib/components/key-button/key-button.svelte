<script lang="ts">
	import { onDestroy } from 'svelte';
	import { DEFAULT_KEYBINDS } from '$lib/config';
	import Input, { updateState } from '$lib/input.svelte';
	import { currentTheme } from '$lib/theme.svelte';

	interface Props {
		action: InputAction;
		colour: ThemeColour;
		active?: boolean;
	}
	let { action, colour, active }: Props = $props();
	const code = $derived(DEFAULT_KEYBINDS[action]);
	const label = $derived(code.startsWith('Key') ? code.substring(3) : code);
	const pressed = $derived(Input[action].current);
	const bg = $derived(currentTheme[colour].default);
	const fg = $derived(currentTheme[colour].light);
	const text = $derived(currentTheme[colour === 'fg' ? 'bg' : 'fg'].default);

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
	style={`--text:rgb(${text.rgb.join(',')});--dark:rgb(${bg.rgb.join(',')});--light:rgb(${(pressed ? bg : fg).rgb.join(',')})`}
	class={`w-25 rounded border-b-4 border-(--dark) bg-(--light) px-4 py-2 text-sm font-medium tracking-wider text-(--text) ${
		!active ? 'opacity-50' : ''
	} left-4`}>{label}</button
>
