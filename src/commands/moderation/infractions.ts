import {
	type ChatInputCommandInteraction,
	SlashCommandBuilder,
	ActionRowBuilder,
} from "discord.js";
import { EmbedBuilder, StringSelectMenuBuilder } from "#builders";
import type { SkyndalexClient } from "#classes";
export async function run(
	client: SkyndalexClient,
	interaction: ChatInputCommandInteraction<"cached">,
) {
	const user = interaction.options.getUser("user");

	const select = new StringSelectMenuBuilder(client, interaction.locale)
		.setPlaceholder("INFRACTIONS_SELECT_PLACEHOLDER")
		.setCustomId(`infractions-${user.id}`)
		.addOptions([
			{
				label: "INFRACTIONS_SELECT_OPTION_WARNS",
				value: "warn",
			},
			{
				label: "INFRACTIONS_SELECT_OPTION_MUTES",
				value: "timeout",
			},
			{
				label: "INFRACTIONS_SELECT_OPTION_KICKS",
				value: "kick",
			},
			{
				label: "INFRACTIONS_SELECT_OPTION_BANS",
				value: "ban",
			},
		]);

	const embed = new EmbedBuilder(client, interaction.locale)
		.setTitle("INFRACTIONS_EMBED_TITLE")
		.setColor("Blurple")
		.setDescription("INFRACTIONS_EMBED_DESCRIPTION")
		.setFooter({
			text: "INFRACTIONS_EMBED_FOOTER",
		});

	const warns = await client.prisma.cases.findMany({
		where: {
			userId: user.id,
			guildId: interaction.guild.id,
			type: "warn",
		},
	});

	if (warns.length > 0) {
		embed.addFields([
			{
				name: "INFRACTIONS_EMBED_FIELD_TITLE",
				value: warns.map((warn) => `• ${warn.reason} <t:${warn.date}:R> (<@${warn.moderator}>) ||\`[${warn.moderator}]\`||`).join("\n"),
			},
		]);
	}

	await interaction.reply({
		embeds: [embed],
		components: [
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				select,
			),
		],
	});
}
export const data = {
	...new SlashCommandBuilder()
		.setName("infractions")
		.setDescription("List all infractions of a user.")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The user to warn.")
				.setRequired(true),
		),
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};
