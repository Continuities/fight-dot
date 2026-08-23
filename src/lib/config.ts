export const SHOW_FPS = false;
export const DOT_SIZE = 0.006; // [0, 1] % of screen width
export const TRACK_THICKNESS = 0.003; // [0, 1] % of screen width
export const GUTTER_SIZE = 0.08; // [0, 1] % of screen width
export const DOT_SPEED = 2000; // ms to cross the screen
export const PROGRESS_WINDOW = 0.2; // [0, 1] % of track width
export const WIN_TIME = 300; // ms range of the edge to win
export const WIN_RANGE = WIN_TIME / DOT_SPEED;
export const HIT_ANIMATION_DURATION = 200; // ms
export const DEFAULT_KEYBINDS: KeyBinds = {
	p1: 'ShiftLeft',
	p2: 'ShiftRight',
	next: 'Space'
};
export const DEFAULT_THEME: Theme = {
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
};
