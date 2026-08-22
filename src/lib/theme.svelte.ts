// eslint-disable-next-line prefer-const
export let currentTheme = $state<Theme>({
	bg: { rgb: [0, 18, 25] },
	fg: { rgb: [233, 216, 166] },
	p1: { rgb: [0, 95, 115] },
	p2: { rgb: [155, 34, 38] }
});

export function themeToVars(theme: Theme): string {
	return Object.entries(theme)
		.map(([k, v]: [string, Colour]) => `--${k}:rgb(${v.rgb.join(',')});`)
		.join('');
}
