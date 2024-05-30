import { GlobalFonts, createCanvas, loadImage } from "@napi-rs/canvas";
import {
	type ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import { getLines } from "utils/getLines";
import type { SkyndalexClient } from "../../../classes/Client";

const canvas = createCanvas(724, 219);

const ctx = canvas.getContext("2d");

export async function run(
	client: SkyndalexClient,
	interaction: ChatInputCommandInteraction,
) {
	await interaction.deferReply();
	const imagePath = new URL(
		"../../../../assets/images/FactorioAdvancement.jpg",
		import.meta.url,
	).pathname;
	GlobalFonts.registerFromPath(
		new URL(
			"../../../../assets/fonts/TitilliumWeb-SemiBold.ttf",
			import.meta.url,
		).pathname,
	);

	const img = await loadImage(imagePath);
	const icon = await loadImage(
		"https://wiki.factorio.com/images/Getting-on-track-achievement.png",
	);
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Load background
	ctx.drawImage(icon, 10, 10, 200, 200); // Load icon

	// Title
	ctx.fillStyle = "#96ca88";
	ctx.font = "20px 'Titillium Web'";
	const title = interaction.options.getString("title");
	ctx.fillText(title, 230, 50);

	// Description
	const maxWidth = 400;
	const lineHeight = 22;
	const description = interaction.options.getString("description");
	const lines = getLines(ctx, description, maxWidth);
	let startY = 80;

	ctx.fillStyle = "white";
	for (const line of lines) {
		ctx.fillText(line, 230, startY);
		startY += lineHeight;
	}

	const image = await canvas.encode("png");

	await interaction.editReply({
		files: [Buffer.from(image)],
	});
}

export const data = new SlashCommandSubcommandBuilder()
	.setName("factorio")
	.setDescription("Generate factorio advancement")
	.addStringOption((option) =>
		option
			.setName("title")
			.setDescription("Factorio advancement title")
			.setRequired(true)
			.setMaxLength(30)
			.setMinLength(1),
	)
	.addStringOption((option) =>
		option
			.setName("description")
			.setDescription("Factorio advancement description")
			.setRequired(true)
			.setMaxLength(200)
			.setMinLength(1),
	);
