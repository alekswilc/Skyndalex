import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
export default {
  data: new SlashCommandBuilder().setName("work").setDescription("Work"),

  async execute(client, interaction) {
    const money = Math.floor(Math.random() * (1000 + 1));
    const actions = ["Win", "Lose"];
    const action = actions[Math.floor(Math.random() * actions.length)];

    const user = await client.prisma.economy.findFirst({
      where: { uid: interaction.user.id },
    });

    await client.cooldowns.set(interaction, 60000, interaction.user.id);

    if (action === "Win") {
      const win = await client.sentences.getRandomSentences(
        interaction,
        "win",
        money,
      );

      if (!win) return;

      await client.economyBalance.updateWallet(
        interaction,
        interaction.user.id,
        +money,
      );
      const embedSuccess = new EmbedBuilder()
        .setDescription(`${win}`)
        .setColor("DarkGreen");
      await interaction?.reply({ embeds: [embedSuccess] });
    } else {
      const lose = await client.sentences.getRandomSentences(
        interaction,
        "lose",
        money,
      );

      if (!lose) return;

      await client.economyBalance.updateWallet(
        interaction,
        interaction.user.id,
        -money,
      );
      const embedFail = new EmbedBuilder()
        .setDescription(`${lose}`)
        .setColor("DarkRed");
      await interaction?.reply({ embeds: [embedFail] });
    }
  },
};
