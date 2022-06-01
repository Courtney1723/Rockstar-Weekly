const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with all the TestBot interactions'),
	async execute(interaction) {


      let helpEmbed = new MessageEmbed()
      .setColor('#B75AFF') //Purple
      .setTitle(`Rockstar Weekly Bot Commands`)
      .setDescription(`**/help**\n> provides a list of commands \n**/ping**\n> The Rockstar Weekly bot responds with pong! when online \n**/rdo**\n> Provides the latest weekly RDO update\n**/gta**\n> Provides the latest GTA Online weekly update`)
    
		return interaction.reply({ embeds: [helpEmbed] });
	},
};
