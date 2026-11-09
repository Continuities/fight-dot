interface Colour {
	rgb: [number, number, number];
}

interface ColourFamily {
	default: Colour;
	light: Colour;
	dark: Colour;
}

interface Theme {
	bg: ColourFamily;
	fg: ColourFamily;
	p1: ColourFamily;
	p2: ColourFamily;
}
type ThemeColour = keyof Theme;

type Player = 'p1' | 'p2';
type WinState = Player | 'draw';

type KeyCode = string;
type InputAction = Player | 'next';

type KeyBinds = Record<InputAction, KeyCode>;
type Score = Record<Player, number>;

type Effect = 'p1-hit' | 'p2-hit' | 'pulse';

interface Shine {
	headPosition: number; // [-1, 1]
	tailLength: number; // [0, 1]
	speed: number; // ms to cross screen
}

interface Segment {
	colour: Colour;
	head: number; // [-1, 1]
	length: number; // [0, 1]
	decay: number; // [0, 1]
}
