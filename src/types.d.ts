interface Colour {
	rgb: [number, number, number];
}

interface Theme {
	bg: Colour;
	fg: Colour;
	p1: {
		default: Colour;
		light: Colour;
		dark: Colour;
	};
	p2: {
		default: Colour;
		light: Colour;
		dark: Colour;
	};
}

type Player = 'p1' | 'p2';

type KeyCode = string;

type KeyBinds = Record<Player, KeyCode> & {
	next: KeyCode;
};
type Score = Record<Player, number>;

type Effect = 'p1-hit' | 'p2-hit' | 'pulse';

interface Shine {
	headPosition: number; // [-1, 1]
	tailLength: number; // [0, 1]
	speed: number; // ms to cross screen
}
