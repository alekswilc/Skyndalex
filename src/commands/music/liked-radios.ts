import {
	ActionRowBuilder,
	ButtonStyle,
	type ChatInputCommandInteraction,
	SlashCommandBuilder,
} from "discord.js";
import {
	ButtonBuilder,
	EmbedBuilder,
	StringSelectMenuBuilder,
} from "#builders";
import type { SkyndalexClient } from "#classes";

export async function run(
	client: SkyndalexClient,
	interaction: ChatInputCommandInteraction,
) {
	const radiosPerPage = 15;

	const likedRadios = await client.prisma.likedRadios.findMany({
		where: {
			userId: interaction.user.id,
		},
		orderBy: {
			id: "desc",
		},
		take: radiosPerPage,
	});

	if (likedRadios.length <= 0) {
		return interaction.reply({
			content: "No favourties found",
			ephemeral: true,
		});
	}

	const totalPages = Math.ceil(likedRadios.length / radiosPerPage);
	const currentPage = 1;

	const select =
		new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
			new StringSelectMenuBuilder(client, interaction.locale)
				.setPlaceholder("RADIO_FAVOURTIES_PLAY")
				.setCustomId("playLikedRadio")
				.addOptions(
					likedRadios
						.slice(
							(currentPage - 1) * radiosPerPage,
							currentPage * radiosPerPage,
						)
						.map((likedRadio) => ({
							label: likedRadio.radioName,
							value: likedRadio.radioId,
						})),
				),
		);

	const paginationButtons =
		new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder(client, interaction.locale)
				.setCustomId(`likedRadios-page_${currentPage - 1}`)
				.setLabel("PAGINATION_EMBED_PREVIOUS")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(currentPage === 1),
			new ButtonBuilder(client, interaction.locale)
				.setCustomId(`likedRadios-page_${currentPage + 1}`)
				.setLabel("PAGINATION_EMBED_NEXT")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(currentPage === totalPages),
		);

	const embed = new EmbedBuilder(client, interaction.locale)
		.setTitle("RADIO_FAVOURTIES_TITLE")
		.setDescription("RADIO_FAVOURTIES_DESCRIPTION")
		.setFooter({
			text: "SUPPORT_INVITE_FOOTER",
			iconURL: client.user.displayAvatarURL(),
		})
		.setColor("Blue")
		.addFields([
			{
				name: "FAVOURTIED_EMBED_FIELD",
				value: likedRadios
					.slice(
						(currentPage - 1) * radiosPerPage,
						currentPage * radiosPerPage,
					)
					.map((radio) => `\`# ${radio.id}\` → ${radio.radioName}`)
					.join("\n"),
			},
		]);

	return interaction.reply({
		embeds: [embed],
		components: [paginationButtons, select],
		ephemeral: true,
	});
}
export const data = new SlashCommandBuilder()
	.setName("liked-radios")
	.setDescription("Show your liked radios");
