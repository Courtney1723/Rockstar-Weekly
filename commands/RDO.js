const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, MessageEmbed} = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: ["CHANNEL"] });
const fs =  require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rdo')
		.setDescription('Replies with RDO latest bonuses and discounts'),
async execute(interaction, user) {
	//interaction.deferReply();

	fs.readFile('./rdo.html', function (err, html) {
  if (err) {
    console.log(err)
  } else {

		rdoString = html.toString(); // Gets the latest rdo updates
    //console.log(`${rdoString}`);

		rdoDate01 = rdoString.split("eventDate\">"); //gets the event date
  	//console.log(`${rdoDate01[1]}`)
		rdoDate = rdoDate01[1].split("<");
		//console.log(`Date: ${rdoDate[0]}\n`);

		rdoCurrent = rdoString.split("tagPast");
		//console.log(`${rdoCurrent[0]}`)

		rdoTitles01 = rdoCurrent[0].split("eventTitle")
			//console.log(`Titles: ${rdoTitles01[1]}`)	
		
		rdoBonuses01 = rdoCurrent[0].split("data-ui-name=\"description");	
		//console.log(`${rdoBonuses01[1]}`)

		let rdoFinalString = "";
		for (i = 1; i < rdoBonuses01.length; i++) {

			rdoTitles = rdoTitles01[i].split("h3>")
				//console.log(`Titles: ${rdoTitles[0]}`)
			
			rdoBonuses =  rdoBonuses01[i].split("/p>"); //cuts off the end of each bonus
				//console.log(`${rdoBonuses[0]} \n`);
			
			rdoFinalString += rdoTitles[0].concat(rdoBonuses[0]); 
					//interaction.reply(`${rdoArgs}`)
			}
		//console.log(`${rdoFinalString}`);

		let rdoEmbed = new MessageEmbed()
      .setColor('#C10000') //Red
      .setTitle('Red Dead Redemption II Online Weekly Bonuses & Discounts:')
      .setDescription(`**${rdoDate[0]}**\n\n${rdoFinalString}\n\n[click here](https://socialclub.rockstargames.com/events?gameId=RDR2)** to view more bonuses & discounts`		
	 			.replace(/\/">/g, "\n• ")
				.replace(/<">/g, "**\n\n")
				.replace(/">/g, "**")
				.replace(/</g, "**")
				.replace(/&amp;/g, "&") //Ampersand
										 )
		
		interaction.reply({embeds: [rdoEmbed]}).catch(err => console.log(err));
	
	}
});


	//interaction.reply(`Console Logged!`).catch(err => console.log(err));;
 }}
