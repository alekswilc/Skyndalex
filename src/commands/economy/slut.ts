import { randomBytes } from "node:crypto";
import { EmbedBuilder } from "../../classes/builders/EmbedBuilder.js";
import {
	type ChatInputCommandInteraction,
	SlashCommandBuilder,
} from "discord.js";
import type { SkyndalexClient } from "../../classes/Client.js";
import { updateWallet } from "#utils";
export async function run(
	client: SkyndalexClient,
	interaction: ChatInputCommandInteraction,
) {
	const randomValue = randomBytes(1)[0] % 100;
	const updateUser = await updateWallet(
		client,
		interaction.guild.id,
		interaction.user.id,
		+randomValue,
	);

	const embed = new EmbedBuilder(client, interaction.locale)
		.setTitle("ECONOMY_SLUT_TITLE")
		.setDescription("ECONOMY_SLUT_DESCRIPTION", {
			earned: randomValue,
			balance: updateUser.wallet,
		})
		.setColor("Green");

	return interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
	.setName("slut")
	.setDescription("Slut");