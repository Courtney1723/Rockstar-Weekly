const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with all the Rockstar Weekly interactions'),
	async execute(interaction) {

      let helpEmbed = new MessageEmbed()
      .setColor('#00FFFF') //Teal
      .setTitle(`Rockstar Weekly Bot Commands`)
      .setDescription(`**/help**\n> Responds with a list of commands \n**/ping**\n> Responds with pong! when online\n**/code**\n> Responds with a link to the source code of this bot \n**/vote**\n> Responds with a link to vote for this bot on Top.gg\n**/rdo**\n> Provides the latest weekly RDO update\n**/gta**\n> Provides the latest GTA Online weekly update \n\nStill have questions? Join the support server: [Click Here](https://discord.com/invite/TkrFcwHWfj)`)

    await interaction.deferReply();
		await interaction.editReply({ embeds: [helpEmbed] });
	},
};
