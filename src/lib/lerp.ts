export function lerp(a: number, b: number, t: number): number {
	if (t <= 0) {
		return a;
	}
	if (t >= 1) {
		return b;
	}
	return a + (b - a) * t;
}

export function lerpColour(start: Colour, end: Colour, amount: number /* [0,1] */): Colour {
	if (amount <= 0) {
		return start;
	}
	if (amount >= 1) {
		return end;
	}
	return {
		rgb: [
			lerp(start.rgb[0], end.rgb[0], amount),
			lerp(start.rgb[1], end.rgb[1], amount),
			lerp(start.rgb[2], end.rgb[2], amount)
		]
	};
}
