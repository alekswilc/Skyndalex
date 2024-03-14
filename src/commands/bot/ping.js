import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("ping").setDescription("Bot ping"),

  async execute(client, interaction) {
    console.log("chuj");

    await interaction.reply({
      content: `Ping: \`${client.ws.ping}\``,
    });
  },
};
