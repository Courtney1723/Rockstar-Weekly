const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, MessageEmbed} = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: ["CHANNEL"] });
const fs =  require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gta')
		.setDescription('Replies with GTAs latest bonuses and discounts'),
async execute(interaction, user) {

	fs.readFile('./gta.html', function (err, html) {
  if (err) {
    console.log(err)
  } else {

		gtaString = html.toString(); // Gets the latest gta updates
    //console.log(`${gtaString}`);

		gtaDate01 = gtaString.split("eventDate\">"); //gets the event date
  	//console.log(`${gtaDate01[1]}`)
		gtaDate = gtaDate01[1].split("<");
		//console.log(`Date: ${gtaDate[0]}\n`);

		gtaCurrent = gtaString.split("tagPast");
		//console.log(`${gtaCurrent[0]}`)

		gtaTitles01 = gtaCurrent[0].split("eventTitle")
			//console.log(`Titles: ${gtaTitles01[1]}`)	
		
		gtaBonuses01 = gtaCurrent[0].split("data-ui-name=\"description");	
		//console.log(`${gtaBonuses01[1]}`)

		let gtaFinalString = "";
		for (i = 1; i < gtaBonuses01.length; i++) {

			gtaTitles = gtaTitles01[i].split("h3>")
				//console.log(`Titles: ${gtaTitles[0]}`)
			
			gtaBonuses =  gtaBonuses01[i].split("/p>"); //cuts off the end of each bonus
				//console.log(`${gtaBonuses[0]} \n`);
			
			gtaFinalString += gtaTitles[0].concat(gtaBonuses[0]); 
					//interaction.reply(`${gtaArgs}`)
			}
		//console.log(`${gtaFinalString}`);

		let gtaEmbed = new MessageEmbed()
      .setColor('#00CD06') //Green
      .setTitle('Red Dead Redemption II Online Weekly Bonuses & Discounts:')
      .setDescription(`**${gtaDate[0]}**\n\n${gtaFinalString}\n\n[click here](https://socialclub.rockstargames.com/events?gameId=GTAV)** to view more bonuses & discounts`		
	 			.replace(/\/">/g, "\n• ")
				.replace(/<">/g, "**\n\n")
				.replace(/">/g, "**")
				.replace(/</g, "**")
				.replace(/&amp;/g, "&") //Ampersand
										 )
		
		interaction.reply({embeds: [gtaEmbed]});
	
	}
});


	//interaction.reply(`Console Logged!`).catch(err => console.log(err));;
 }}
