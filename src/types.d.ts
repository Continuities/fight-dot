interface Colour {
	rgb: [number, number, number];
}

interface Theme {
	bg: Colour;
	fg: Colour;
	p1: Colour;
	p2: Colour;
}

type Player = 'p1' | 'p2';
