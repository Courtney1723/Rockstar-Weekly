const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('All the Rockstar Weekly interactions'),
	async execute(interaction) {
		await interaction.deferReply().catch(console.error);

      let helpEmbed = new EmbedBuilder()
      .setColor('0x00FFFF') //Teal
      .setTitle(`Rockstar Weekly Bot Commands`)
      .setDescription(`**/help**\n> A list of commands\n**/gta**\n> The latest Grand Theft Auto V Online bonuses & discounts\n**/rdo**\n> The latest Red Dead Redemption II Online bonuses & discounts\n**/ping**\n> Responds with pong! when online\n**/code**\n> A link to the source code of this bot\n**/autopost**\n> Start, Stop, or Configure auto posts.\n\nQuestions, comments, or concerns? Join the support server: [Click Here](${process.env.support_link}) \n\nWant to add the Rockstar Weekly Bot to another server? [Click Here](${process.env.invite_link})`)

		await interaction.editReply({ embeds: [helpEmbed] }).catch(console.error);
	},
};