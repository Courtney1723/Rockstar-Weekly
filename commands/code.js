const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('code')
		.setDescription('Replies with a link to the source code of the Rockstar Weekly bot'),
	async execute(interaction) {
		await interaction.deferReply();
    await interaction.editReply(`Rockstar Weekly source code: [Github Link](https://github.com/Courtney1723/Rockstar-Weekly)`).catch(err => {console.log(err)});
	},
};
