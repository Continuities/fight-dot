// eslint-disable-next-line prefer-const
export let currentTheme = $state<Theme>({
	bg: { rgb: [0, 18, 25] },
	fg: { rgb: [233, 216, 166] },
	p1: {
		default: { rgb: [0, 95, 115] },
		light: { rgb: [10, 147, 150] }
	},
	p2: {
		default: { rgb: [174, 32, 18] },
		light: { rgb: [186, 62, 3] }
	}
});
type ThemeEntries = {
	[K in keyof Theme]: [K, Theme[K]];
}[keyof Theme];

export function themeToVars(theme: Theme): string {
	return (Object.entries(theme) as ThemeEntries[])
		.map(([k, v]) => {
			switch (k) {
				case 'bg':
				case 'fg':
					return `--${k}:rgb(${v.rgb.join(',')});`;
				case 'p1':
				case 'p2':
					return `--${k}:rgb(${v.default.rgb.join(',')});--${k}-light:rgb(${v.light.rgb.join(',')});`;
			}
		})
		.join('');
}
