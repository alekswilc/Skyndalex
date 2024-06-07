import { ButtonBuilder } from "#builders";
import {
	ActionRowBuilder,
	ButtonStyle,
	type ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import type { SkyndalexClient } from "../../../classes/Client.js";
import type { HuggingFaceText } from "../../../types/structures.js";

export async function run(
	client: SkyndalexClient,
	interaction: ChatInputCommandInteraction,
) {
	await interaction.deferReply();
	const model = "meta-llama/Meta-Llama-3-8B-Instruct";
	const prompt = interaction.options.getString("prompt");

	const data = {
		inputs: prompt,
	};

	const response = await fetch(
		`https://api-inference.huggingface.co/models/${model}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.HF_TOKEN}`,
			},
			body: JSON.stringify(data),
		},
	);
	const json = (await response.json()) as HuggingFaceText[];

	const button = new ButtonBuilder(client, interaction.locale)
		.setLabel("BUTTON_CONTINUE")
		.setStyle(ButtonStyle.Primary)
		.setCustomId("continue");

	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

	const embed = new EmbedBuilder()
		.setDescription(`${json[0].generated_text}`)
		.setColor("Blue");

	return interaction.editReply({
		embeds: [embed],
		components: [row],
	});
}
export const data = new SlashCommandSubcommandBuilder()
	.setName("text")
	.setDescription("Generate text")
	.addStringOption((option) =>
		option
			.setName("prompt")
			.setDescription("Prompt for the AI")
			.setRequired(true),
	);