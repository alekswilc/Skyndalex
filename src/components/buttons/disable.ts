import { ActionRowBuilder, type MessageComponentInteraction } from "discord.js";
import { EmbedBuilder, StringSelectMenuBuilder } from "#builders";
import type { SkyndalexClient } from "#classes";
export async function run(
	client: SkyndalexClient,
	interaction: MessageComponentInteraction<"cached">,
) {
	try {
		const option = interaction.customId.split("-")[1];

		await client.prisma.settings.upsert({
			where: {
				guildId: interaction.guild.id,
			},
			create: {
				guildId: interaction.guild.id,
				[option]: null,
			},
			update: {
				[option]: null,
			},
		});

		const availableSettings = await client.prisma.settings.findMany({
			where: {
				guildId: interaction.guild.id,
			},
		});

		const fields = Object.keys(availableSettings[0])
			.map((key, index) => {
				const value = Object.values(availableSettings[0])[index];
				return {
					name: key,
					value: value,
					inline: true,
				};
			})
			.filter((field) => !!field.value);

		const select = new StringSelectMenuBuilder(client, interaction.locale)
			.setPlaceholder("CONFIG_GUILD_SELECT_PLACEHOLDER")
			.setCustomId("config")
			.addOptions(
				Object.keys(availableSettings[0])
					.map((key) => {
						return {
							label: key,
							value: key,
						};
					})
					.filter(
						(option) =>
							option.label !== "guildId" &&
							!option.label.endsWith("Id"),
					),
			);

		const embed = new EmbedBuilder(client, interaction.locale)
			.setTitle("CONFIG_GUILD_TITLE")
			.setColor("Blurple")
			.setFields(
				fields
					.map((field) => ({
						...field,
						value: field.name.endsWith("Channel")
							? `<#${field.value}>`
							: `\`${field.value}\``,
					}))
					.filter((field) => field.name !== "guildId"),
			);

		return interaction.update({
			embeds: [embed],
			components: [
				new ActionRowBuilder<StringSelectMenuBuilder>({
					components: [select],
				}),
			],
		});
	} catch (e) {
		console.error("e", e);
	}
}
