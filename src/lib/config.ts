export const SHOW_FPS = false;
export const DOT_SIZE = 0.006; // [0, 1] % of screen width
export const TRACK_THICKNESS = 0.003; // [0, 1] % of screen width
export const GUTTER_SIZE = 130; // px
export const STARTING_DOT_SPEED = 3000; // ms to cross the screen
export const DOT_MAX_SPEED = 1500; // ms to cross the screen
export const SPEEDUP_ON_HIT = 50; // ms of speed gained per hit
export const PROGRESS_WINDOW = 0.3; // [0, 1] % of track width
export const WIN_TIME = 300; // ms range of the edge to win
export const EFFECT_ANIMATION_DURATION = 200; // ms
export const SHINE_DELAY = EFFECT_ANIMATION_DURATION; //ms
export const SHINE_SPEED = 2000; // ms
export const SHINE_SIZE = 0.1; // [0, 1] % of track width
export const SEGMENT_DECAY_SPEED = 300; // ms
export const SEGMENT_FLOAT_DISTANCE = 50; // px
export const GAME_DURATION_SECONDS = 60; // 0 for infinite
export const GAME_DURATION_COUNTDOWN = 10; // display the last X seconds

export const DEFAULT_KEYBINDS: KeyBinds = {
	p1: 'KeyQ',
	p2: 'KeyP',
	next: 'Space'
};

export const DEFAULT_THEME: Theme = {
	bg: {
		default: { rgb: [17, 17, 17] },
		light: { rgb: [17, 17, 17] },
		dark: { rgb: [17, 17, 17] }
	},
	fg: {
		default: { rgb: [233, 216, 166] },
		light: { rgb: [248, 243, 228] },
		dark: { rgb: [23, 22, 17] }
	},
	p1: {
		default: { rgb: [0, 95, 115] },
		light: { rgb: [51, 127, 143] },
		dark: { rgb: [0, 10, 12] }
	},
	p2: {
		default: { rgb: [174, 32, 18] },
		light: { rgb: [190, 77, 65] },
		dark: { rgb: [17, 3, 2] }
	}
};
