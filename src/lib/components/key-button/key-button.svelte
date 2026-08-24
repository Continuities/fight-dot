<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	interface Props {
		code: KeyCode;
		fg: Colour;
		bg: Colour;
		active?: boolean;
		pressed?: boolean;
		onclick?: MouseEventHandler<HTMLButtonElement>;
	}
	let { code, fg, bg, active, pressed, onclick }: Props = $props();
</script>

<button
	{onclick}
	style={`--dark:rgb(${bg.rgb.join(',')});--light:rgb(${(pressed ? bg : fg).rgb.join(',')})`}
	class={`w-25 rounded border-b-4 border-(--dark) bg-(--light) px-4 py-2 text-sm font-medium tracking-wider text-(--fg) ${
		!active ? 'opacity-50' : ''
	} left-4`}>{code}</button
>
