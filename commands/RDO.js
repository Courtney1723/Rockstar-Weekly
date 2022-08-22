const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
var request = require('request');
const phantom = require('phantom');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('rdo')
		.setDescription('Latest RDR2 online bonuses and discounts'),
	async execute(interaction) {
		await interaction.deferReply().catch(console.error);

		rdoURL = process.env.SOCIAL_URL_RDO
		var j = request.jar();
		request = request.defaults({ jar: j });
		request({
			url: rdoURL,
			method: "GET",
			form: { UNENTRY: process.env.SOCIAL_USER, PWENTRY: process.env.SOCIAL_PASSWORD }
		},
			function(error, response, body) {
				if (!error && response.statusCode == 200) {
					//console.log('body1:', body);
	
	//Beginning Phantom Function to read and format html
	(async function() {
		const instance = await phantom.create();
		const page = await instance.createPage();

		await page.property('viewportSize', { width: 1024, height: 600 });
		const status = await page.open(rdoURL);
			//console.log(`Page opened with status [${status}].`);

		const content = await page.property('content');
			//console.log(content);

		rdoString = content.toString(); // Gets the latest rdo updates
			//console.log(`${rdoString}`);

		rdoDate01 = rdoString.split("class=\"date\">"); //gets the event date
			//console.log(`${rdoDate01[1]}`)
		rdoDate = rdoDate01[1].split("<"); //cuts off the end of the date
			//console.log(`Date: ${rdoDate[0]}\n`);

		rdoTitles01 = rdoString.split("<p><b>") //gets the titles
			//console.log(`Titles: ${rdoTitles01}\n`);

		rdoBonuses01 = rdoString.split("</b></p>");	//gets the bonuses
			//console.log(`\nrdoBonuses01: \n${rdoBonuses01}`);

		let rdoImage01 = rdoString.split("og:image\" content=\"");
			//console.log(`${rdoImage001[1]}`);
		let rdoImage = rdoImage01[1].split("\" data-rh=\"\">");
			//console.log(`${rdoImage[0]}`);

//---------------------------BEGIN titleCapitalization function-------------------------//
		let rdoFinalString = ""; //initial empty final string
		for (i = 1; i <= rdoBonuses01.length - 1; i++) { //iterates over every live bonus
			//console.log(`${rdoBonuses01.length}`)

			//console.log(`Titles: \n${rdoTitles01[i]}\n\n`);
		let rdoTitles001 = rdoTitles01[i].split("</b></p>"); //removes trailing string on titles
			//console.log(`Titles: \n${rdoTitles001[0]}\n\n`);

		function titleCapitalization(titles) {
			//console.log(`Titles1: ${titles[0]}\n`); // Full Title
			let Titles2 = titles[0].split(` `);
			//console.log(`Titles2: ${Titles2[0]}\n`); // First word of the title

			let titlesLength = Object.keys(Titles2).length; //counts the number of words in the array
				//console.log(`Titles2 size at ${i}: ${titlesLength}\n`);
			let rdoTitleString = ""; //initial empty title, will be populated in the j loop
			for (j = 0; j <= titlesLength; ++j) {
				while (j <= (titlesLength)) { 
					//console.log(`I: ${i}, J: ${j}\n`); //while loop check, expected: i = title number, j = index of title words
					if ((Titles2[j] != null) && (Titles2[j] != "")) { //removes blank space elements
						//console.log(`Titles2 at J: ${j}: ${Titles2[j]}\n`); //checks for blank elements
						//console.log(`${Titles2[j].charAt(0)}${Titles2[j].toLowerCase().slice(1)}`); //capital first letters check
					if ( (Titles2[j] === Titles2[0]) && (!Titles2[j].includes("RDO")) ) { // if the word is the first word in the title - returns first letter capitalized + rest of the word lowercase unless RDO
							rdoTitleString += `${Titles2[j].charAt(0)}${Titles2[j].toLowerCase().slice(1)} `; 
					}
					else if ( (Titles2[j].includes("RDO")) || (Titles2[j].includes("XP")) ) { //returns all caps if title is RDO, RDO$, or XP
							rdoTitleString += `${Titles2[j]} `;
					}
					else if ( (Titles2[j] === "ON")  || (Titles2[j] === "OF") || (Titles2[j] === "THE") || (Titles2[j] === "AN") || (Titles2[j] === "AND") || (Titles2[j] === "FOR") || (Titles2[j] === "A") || (Titles2[j] === "AT") || (Titles2[j] === "IN") ) { //returns all lowercase if not a title word
						rdoTitleString += `${Titles2[j].toLowerCase()} `;
					} else {
						rdoTitleString += `${Titles2[j].charAt(0)}${Titles2[j].toLowerCase().slice(1)} `; //returns capital first letter and lowercase rest of the word
						}

					}
					++j;
				}
			}
			//return Titles2[0]; //Testbench, returns the first word of every element of titles
			return `${rdoTitleString}`;
		}

		let rdoTitles = titleCapitalization(rdoTitles001);
		//console.log(`final titles:\n ${rdoTitles}`);
		//let rdoTitles = `${rdoTitles001[0].charAt(0)}${rdoTitles001[0].toLowerCase().slice(1)}`; // capitalizes the first letter of each title

//---------------------------END titleCapitalization function-------------------------//
			
			//console.log(`Bonuses: \n${rdoBonuses01[i]}\n\n`);
			let rdoBonuses = rdoBonuses01[i].split("<p><b>"); //removes trailing string on bonuses
			//console.log(`Bonuses at ${i}: \n${rdoBonuses[0]}\n\n`);

//Adds only the title to rdoFinalString if no links, trailing strings, or lists
			if ( (!rdoBonuses[0].includes("<a")) && (!rdoBonuses[0].includes("body>")) && (!rdoBonuses[0].includes("style=")) && (!rdoBonuses[0].includes("<li>")) ) {
				//console.log(`Titles at ${i}: \n${rdoTitles[0]}\n\n`)

				//-----BEGIN paragraph count-----//
				let rdoParas = rdoBonuses[0].split("<p>");
				let rdoParaCount = Object.keys(rdoParas).length; //counts the paragraphs in bonuses
				if (rdoParaCount >= 3) { // if more than one paragraph, returns the second paragraph
						//console.log(`rdoParas at I - ${i}: ${rdoParas[2]}\n`);
					if ( (rdoParas[1] != null) && (rdoParas[2] != null)) { 
						rdoFinalString += `**${rdoTitles}**\n • ${rdoParas[1]}`; 
					} 
					if ( (rdoParas[1] != null) && (rdoParas[2] === null)) {
						rdoFinalString += `**${rdoTitles}**\n`; 
					} 					
				} else if (rdoParaCount <= 2) {
							//console.log(`Only Title at ${i}: ${rdoTitles}`);
						rdoFinalString += `**${rdoTitles}**\n\n`;

				}
				//-----END paragraph count-----//
			}
				
//replaces all links
			else if ((rdoBonuses[0].includes("<a")) && (!rdoBonuses[0].includes("body>")) && (!rdoBonuses[0].includes("style="))) {
				//console.log(`Bonuses at ${i}: \n${rdoBonuses[0]}\n\n`);
				let rdoBonuses02 = rdoBonuses[0].replace(/<a.*?[^>]>/g, "");
					//console.log(`Bonuses02 at ${i}: \n${rdoTitles[0]}\n${rdoBonuses02}\n`);
				rdoFinalString += `**${rdoTitles}** ${rdoBonuses02}`;
			}
//deletes the trailing code on the final bonus
			else if (rdoBonuses[0].includes("body")) { //    /\(.*\)/g
				//console.log(`Bonuses at ${i}: \n${rdoBonuses[0]}\n\n`);	
				let rdoBonuses003 = rdoBonuses[0].replace(/<a.*?[^>]>/g, "");
				let rdoBonuses03 = rdoBonuses003.split("</div>")
					//console.log(`Bonuses03 at ${i}: \n${rdoTitles[0]}\n${rdoBonuses03[0]}\n`);
				rdoFinalString += `**${rdoTitles}** ${rdoBonuses03[0]}`;
			}

//if rdoBonuses[0] contains links and lists
			else if ((rdoBonuses[0].includes("style=")) && (rdoBonuses[0].includes("<a")) && (!rdoBonuses[0].includes("body>"))) {
				let rdoBonuses004 = rdoBonuses[0].replace(/<a.*?[^>]>/g, ""); //   .replace(/start.*[end]end/g, "");
				//console.log(`Bonuses004 at ${i}: \n${rdoBonuses004}\n\n`);
				let rdoBonuses04 = rdoBonuses004.split("style=\"line-height:1.5;\">");
					//console.log(`Bonuses04 at ${i}: \n${rdoTitles[0]}\n${rdoBonuses04[1]}\n\n`);
				rdoFinalString += `**${rdoTitles}** ${rdoBonuses04[1]}`;
			}

//if rdoBonuses[0] contains lists but no links
			else if ( ( (rdoBonuses[0].includes("style=")) || (rdoBonuses[0].includes("<li>")) ) && (!rdoBonuses[0].includes("<a")) && (!rdoBonuses[0].includes("body>"))) {
				let rdoBonuses05 = rdoBonuses[0].split("style=\"line-height:1.5;\">");
					//console.log(`Bonuses05 at ${i}: \n${rdoTitles}\n${rdoBonuses05[1]}\n\n`);
				if (rdoBonuses05[1] != null) {
					rdoFinalString += `**${rdoTitles}** ${rdoBonuses05[1]}`;
				} else {
					rdoFinalString += `\n• ${rdoTitles} \n\n\n\n\n`; //not sure why it needs so many newlines...
				}
			}
//error
			else {
				console.log(`error: rdoTitles at ${i}:\n ${rdoTitles} \n rdoBonuses at ${i}:\n ${rdoBonuses[i]}`);
			}
		}
		//console.log(`rdoFinalString: \n${rdoFinalString}\n\n`);

//---------------------------END populating rdoFinalString-------------------------//


		let rdoEmbed = new MessageEmbed()
			.setColor('#C10000') //Red
			.setTitle('Red Dead Redemption II Online Bonuses & Discounts:')
			.setDescription(`${rdoDate[0]}\n\n${rdoFinalString}\n\n\n\n\n**[click here](${rdoURL}) for more details**`
				.replace(/\s\s\s\s/g, '') //removes multiple spaces
				.replace(/\n\n\n/g, "\n\n") // removes triple newlines
				.replace(/<li>/g, "• ")
				.replace(/<p>/g, "• ")
				.replace(/<b>/g, "")
				.replace(/<\/li>/g, "")
				.replace(/<\/p>/g, "")
				.replace(/<\/b>/g, "")
				.replace(/<\/ul>/g, "")
				.replace(/<\/a>/g, "")
				.replace(/&amp;/g, "&") //Ampersand						
				.replace(/&nbsp;/g, " ") //Non breaking space		
		//Below this differs from RDO
				.replace(/\*\*\n\n• /g, "**\n• ") //removes double spaces before a list
				.replace(/\*\* \n\n• /g, "**\n• ") //removes double spaces before a list 
				.replace(/\n \*\*\n\n/g, "**\n") //removes triple newlines	
				.replace(/Rockstar Social Club/g, "[Rockstar Social Club](https://socialclub.rockstargames.com)")
				.replace(/to Prime Gaming/g, "to [Prime Gaming](https://gaming.amazon.com/loot/reddeadonline)")
			)
			let rdoImageEmbed = new MessageEmbed()
				.setColor('#C10000') //Red
				.setImage(rdoImage[0])
		
		const aDate = new Date();
		const aMonthDay = aDate.getDate(); //Date of the Month
			//console.log(`aMonthDay: ${aMonthDay}`);
		const aDay = aDate.getDay(); //Day of the Week
			//console.log(`aDay: ${aDay}`);
		const aHour = aDate.getHours(); //Time of Day UTC (+6 MST; +4 EST)
			//console.log(`aHour: ${aHour}`);
		
			let rdoExpiredEmbed = new MessageEmbed()
				.setColor('#C10000') //Red
				.setDescription(`The above bonuses & discounts may be expired. \nRockstar updates these bonuses the 1st Tuesday of every month after 12:30pm EST`)		

		await interaction.editReply({ embeds: [rdoImageEmbed, rdoEmbed] }).catch(console.error);
		//if (aDay === 5) { //Test for today - 0 = Sunday, 1 = Monday ... 6 = Saturday, UTC time
		if ( (aMonthDay <= 7) && (aDay === 2) &&  (aHour <= 17)) { //If it's the first week of the month and it's Tuesday and it's before 1:00pm
			interaction.followUp({embeds: [rdoExpiredEmbed], ephemeral:true}).catch(console.error);
		}		
		
		await instance.exit();
	})()
	
			} else {
				console.log('error2', error, response && response.statusCode);
			}
	
	});

		//interaction.editReply(`Console logged! 👍`);

	}
}
