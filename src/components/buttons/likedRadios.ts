import {
	ActionRowBuilder,
	ButtonStyle,
	type MessageComponentInteraction,
} from "discord.js";
import {
	ButtonBuilder,
	EmbedBuilder,
	StringSelectMenuBuilder,
} from "#builders";
import type { SkyndalexClient } from "#classes";

export async function run(
	client: SkyndalexClient,
	interaction: MessageComponentInteraction<"cached">,
) {
	if (interaction.user.id !== interaction?.message?.interaction?.user?.id)
		return interaction.reply({
			content: "You can't use this button!",
			ephemeral: true,
		});
	try {
		const pageId = interaction.customId.split("-")[1];
		const page = Number(pageId.split("_")[1]);
		const radiosPerPage = 15;
		const favourites = await client.prisma.likedRadios.findMany({
			where: {
				userId: interaction.user.id,
			},
			orderBy: {
				id: "desc",
			},
			take: radiosPerPage,
			skip: page * radiosPerPage,
		});

		const totalFavourites = await client.prisma.likedRadios.count({
			where: {
				userId: interaction.user.id,
			},
		});

		const row = new ActionRowBuilder<ButtonBuilder>().setComponents([
			new ButtonBuilder(client, interaction.locale)
				.setCustomId(`favourtiesList-page_${page - 1}`)
				.setLabel("PAGINATION_EMBED_PREVIOUS")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(page <= 0),
			new ButtonBuilder(client, interaction.locale)
				.setCustomId(`favourtiesList-page_${page + 1}`)
				.setLabel("PAGINATION_EMBED_NEXT")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled((page + 1) * radiosPerPage >= totalFavourites),
		]);

		const select =
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				new StringSelectMenuBuilder(client, interaction.locale)
					.setPlaceholder("RADIO_FAVOURTIES_PLAY")
					.setCustomId("playLikedRadio")
					.addOptions(
						favourites.map((favourite) => ({
							label: favourite.radioName,
							value: favourite.radioId,
						})),
					),
			);

		const embed = new EmbedBuilder(client, interaction.locale)
			.setTitle("RADIO_FAVOURTIES_TITLE")
			.setDescription("RADIO_FAVOURTIES_DESCRIPTION")
			.setColor("Blue")
			.addFields([
				{
					name: "FAVOURTIED_EMBED_FIELD",
					value: favourites
						.map(
							(radio) => `\`# ${radio.id}\` → ${radio.radioName}`,
						)
						.join("\n"),
				},
			]);

		await interaction.update({
			embeds: [embed],
			components: [row, select],
		});
	} catch (e) {
		console.error("e", e);
	}
}
