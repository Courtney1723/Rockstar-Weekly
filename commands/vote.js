const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription('Replies with a link to vote on the Rockstar Weekly bot'),
	async execute(interaction) {
		await interaction.deferReply();
    await interaction.editReply(`Vote for the Rockstar Weekly bot! \n [Click Here](https://top.gg/bot/977396560864346142/vote)`).catch(err => {console.log(err)});
	},
};
