import { browser } from '$app/env';
import { on } from 'svelte/events';
import { DEFAULT_KEYBINDS } from './config';

const INPUT_KEYS = new Map(
	Object.entries(DEFAULT_KEYBINDS).map(([k, v]) => [v, k] as [KeyCode, InputAction])
);

const state = $state({
	next: { current: false, last: false },
	p1: { current: false, last: false },
	p2: { current: false, last: false }
});

export const updateState = (action: InputAction, active: boolean) => {
	for (const a of Object.keys(state) as InputAction[]) {
		state[a].last = state[a].current;
		if (a === action) {
			state[a].current = active;
		}
	}
};

const handleKey = (pos: 'up' | 'down', code: KeyCode) => {
	const action = INPUT_KEYS.get(code);
	if (action) {
		updateState(action, pos === 'down');
	}
};

const cleanup = browser
	? [
			on(window, 'keydown', (e) => {
				if (!e.repeat) {
					handleKey('down', e.code);
				}
			}),
			on(window, 'keyup', (e) => {
				if (!e.repeat) {
					handleKey('up', e.code);
				}
			})
		]
	: [];

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		cleanup.forEach((c) => c());
	});
}

export default state;
