import type { SKRSContext2D } from "@napi-rs/canvas";

export function getLines(ctx: SKRSContext2D, text: string, maxWidth: number) {
	const words = text.split(" ");
	const lines = [];
	let currentLine = "";

	for (let word of words) {
		while (ctx.measureText(word).width > maxWidth) {
			let partialWord = "";
			for (const char of word) {
				if (ctx.measureText(partialWord + char).width < maxWidth) {
					partialWord += char;
				} else {
					if (currentLine) {
						lines.push(currentLine);
						currentLine = "";
					}
					lines.push(partialWord);
					word = word.substring(partialWord.length);
					partialWord = "";
				}
			}
			word = partialWord;
		}
		if (ctx.measureText(`${currentLine} ${word}`).width < maxWidth) {
			if (currentLine.length > 0) {
				currentLine += " ";
			}
			currentLine += word;
		} else {
			if (currentLine) {
				lines.push(currentLine);
			}
			currentLine = word;
		}
	}

	if (currentLine) {
		lines.push(currentLine);
	}
	return lines;
}
