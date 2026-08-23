interface Colour {
	rgb: [number, number, number];
}

interface Theme {
	bg: Colour;
	fg: Colour;
	p1: {
		default: Colour;
		light: Colour;
	};
	p2: {
		default: Colour;
		light: Colour;
	};
}

type Player = 'p1' | 'p2';

type KeyCode = string;

type KeyBinds = Record<Player, KeyCode> & {
	next: KeyCode;
};
type Score = Record<Player, number>;
