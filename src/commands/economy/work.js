import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("work").setDescription("Work"),

  async execute(client, interaction) {
    const money = Math.floor(Math.random() * (1000 + 1));
    const actions = ["Win", "Lose"];
    const action = actions[Math.floor(Math.random() * actions.length)];

    const user = client.prisma.economy.findFirst({
      where: { uid: interaction.user.id },
    });

    const settings = client.prisma.economy.findFirst({
      where: { guildId: interaction.guild.id },
    });

    const getSentences = async (actionType) => {
      const sentences = await client.prisma.economySettings.findMany({
        where: {
          guildId: interaction.guild.id,
          type: "work",
          action: actionType,
        },
      });
      return sentences.map((x) => x.sentence);
    };

    const listWinSentences = await getSentences("win");
    const listLoseSentences = await getSentences("lose");

    const getRandomSentence = (sentenceList) =>
      sentenceList[Math.floor(Math.random() * sentenceList.length)];

    const replaceStrWin = getRandomSentence(listWinSentences)
      .replace(/{user}/g, interaction.user.tag)
      .replace(/{userid}/g, interaction.user.id)
      .replace(/{usersOnGuild}/g, interaction.guild.members.cache.size)
      .replace(/{money}/g, money)
      .replace(/{currency}/g, settings?.currency || "🌈");

    const replaceStrLose = getRandomSentence(listLoseSentences)
      .replace(/{user}/g, interaction.user.tag)
      .replace(/{userid}/g, interaction.user.id)
      .replace(/{usersOnGuild}/g, interaction.guild.members.cache.size)
      .replace(/{money}/g, money)
      .replace(/{currency}/g, settings?.currency || "🌈");

    const updateWallet = async (amount) => {
      await client.prisma.economy.upsert({
        where: {
          uid_guildId: {
            guildId: interaction.guild.id,
            uid: interaction.user.id,
          },
        },
        create: {
          guildId: interaction.guild.id,
          uid: interaction.user.id,
          wallet: amount.toString(),
        },
        update: { wallet: (parseInt(user?.wallet || "0") + amount).toString() },
      });
    };

    if (action === "Win") {
      await updateWallet(money);
      const embedSuccess = new EmbedBuilder()
        .setDescription(`${replaceStrWin}`)
        .setColor("DarkGreen");
      await interaction.reply({ embeds: [embedSuccess] });
    } else {
      await updateWallet(-money);
      const embedFail = new EmbedBuilder()
        .setDescription(`${replaceStrLose}`)
        .setColor("DarkRed");
      await interaction.reply({ embeds: [embedFail] });
    }
  },
};
