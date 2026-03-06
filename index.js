require("dotenv").config();
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let pokemons = {
  "Charizard": null,
  "Feraligatr": null,
  "Venusaur": null
};

function gerarPainel() {

  let descricao = "";

  for (let nome in pokemons) {

    if (pokemons[nome]) {
      descricao += `🔴 **${nome}** — em uso por ${pokemons[nome].user} (${pokemons[nome].hora})\n`;
    } else {
      descricao += `🟢 **${nome}** — disponível\n`;
    }

  }

  return new EmbedBuilder()
    .setTitle("Pokemon DPS")
    .setDescription(descricao)
    .setColor(0x00ff00);
}

client.once("ready", () => {
  console.log("Bot online!");
});

client.on("messageCreate", async (message) => {

  if (message.content === "!painel") {

    const embed = gerarPainel();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("pegar_Charizard")
        .setLabel("Pegar Charizard")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("devolver_Charizard")
        .setLabel("Devolver Charizard")
        .setStyle(ButtonStyle.Danger)
    );

    message.channel.send({
      embeds: [embed],
      components: [row]
    });

  }

});

client.on("interactionCreate", async interaction => {

  if (!interaction.isButton()) return;

  const nome = interaction.customId.split("_")[1];

  if (interaction.customId.startsWith("pegar")) {

    if (pokemons[nome]) {
      interaction.reply({ content: "Já está em uso!", ephemeral: true });
      return;
    }

    let hora = new Date().toLocaleTimeString();

    pokemons[nome] = {
      user: interaction.user.username,
      hora: hora
    };

  }

  if (interaction.customId.startsWith("devolver")) {

    if (!pokemons[nome]) {
      interaction.reply({ content: "Esse pokemon não está em uso.", ephemeral: true });
      return;
    }

    pokemons[nome] = null;

  }

  const embed = gerarPainel();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("pegar_Charizard").setLabel("Pegar Charizard").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("devolver_Charizard").setLabel("Devolver Charizard").setStyle(ButtonStyle.Danger)
  );

  await interaction.update({
    embeds: [embed],
    components: [row]
  });

});

client.login(TOKEN);