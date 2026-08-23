import { DEFAULT_THEME } from './config';

// eslint-disable-next-line prefer-const
export let currentTheme = $state<Theme>(DEFAULT_THEME);
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
