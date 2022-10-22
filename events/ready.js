const { SlashCommandBuilder, EmbedBuilder, ActivityType } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Logged in as ${client.user.tag}`);
		client.user.setPresence({ activities: [{ name: 'Bonuses', type: ActivityType.Watching }], status: 'online' });

		//Counts the guilds
		const GuildIDs = client.guilds.cache.map(guild => guild.id);
    console.log(`${GuildIDs.length} guilds`);		
		// const GuildNames = client.guilds.cache.map(guild => guild.name);
		// Guilds = "";
		// for (i = 0; i <= GuildIDs.length; ++i) {
		// 	if (GuildIDs[i] != null) {
		// 		Guilds += `${i + 1}: ${GuildNames[i]} - ID: ${GuildIDs[i]} \n`
		// 	}
		// }
	  //console.log(Guilds);
		
	},
};