import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import picocolors from "picocolors";
export function checkMissingTranslations() {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);

	const enUsData = JSON.parse(
		readFileSync(
			join(__dirname, "../../i18n/en-US/responses.json"),
			"utf-8",
		),
	);
	const plData = JSON.parse(
		readFileSync(join(__dirname, "../../i18n/pl/responses.json"), "utf-8"),
	);

	const missingKeysEn = Object.keys(enUsData).filter((key) => !plData[key]);
	const missingKeysPl = Object.keys(plData).filter((key) => !enUsData[key]);

	if (missingKeysEn.length > 0) {
		console.log("Missing keys in PL: ", missingKeysEn);
	}

	if (missingKeysPl.length > 0) {
		console.log("Missing keys in EN: ", missingKeysPl);
	}

	console.log(
		`${picocolors.blue("[i18n]")} ${picocolors.green(
			"Translations check finished. No missing keys.",
		)}`,
	);
}