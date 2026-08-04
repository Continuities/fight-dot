interface Color {
	rgb: [number, number, number];
}

interface Theme {
	bg: Color;
	fg: Color;
	p1: Color;
	p2: Color;
}

type Player = 'p1' | 'p2';
