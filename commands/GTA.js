const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
var request = require('request');
const phantom = require('phantom');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('gta')
		.setDescription('Replies with the Grand Theft Auto V Online latest bonuses and discounts'),
	async execute(interaction) {
		interaction.deferReply();

		gtaURL = process.env.SOCIAL_URL_GTA
		var j = request.jar();
		request = request.defaults({ jar: j });
		request({
			url: gtaURL,
			method: "GET",
			form: { UNENTRY: process.env.SOCIAL_USER, PWENTRY: process.env.SOCIAL_PASSWORD }
		},
			function(error, response, body) {
				if (!error && response.statusCode == 200) {
					//console.log('body1:', body);
				} else {
					console.log('login error:\n', error, response && response.statusCode);
				}
				request({
					url: gtaURL,
					method: "POST",
					form: { UNENTRY: process.env.SOCIAL_USER, PWENTRY: process.env.SOCIAL_PASSWORD },
				}, function() {
					if (!error && response.statusCode == 200) {
						//console.log('body2:', body); //ALL HTML

						//Beginning Phantom Function to read and format html
						(async function() {
							const instance = await phantom.create();
							const page = await instance.createPage();

							await page.property('viewportSize', { width: 1024, height: 600 });
							const status = await page.open(gtaURL);
							//console.log(`Page opened with status [${status}].`);

							const content = await page.property('content');
							//console.log(content);

							gtaString = content.toString(); // Gets the latest gta updates
							//console.log(`${gtaString}`);

							gtaDate01 = gtaString.split("class=\"date\">"); //gets the event date
							//console.log(`${gtaDate01[1]}`)
							gtaDate = gtaDate01[1].split("<"); //cuts off the end of the date
							//console.log(`Date: ${gtaDate[0]}\n`);

							gtaTitles01 = gtaString.split("<p><b>") //gets the titles
							//console.log(`Titles: ${gtaTitles01}\n`)						

							gtaBonuses01 = gtaString.split("</b></p>");	//gets the bonuses
							//console.log(`\ngtaBonuses01: \n${gtaBonuses01}`)

							// Strings to be populated with the two indexes of titles after "Only on PlayStation..."
							let nextGenIndex1 = "" // empty string to be populated
							let nextGenIndex2 = "" // empty string to be populated
							
//---------BEGIN 1st for loop---------//
							let gtaFinalString = ""; //initial empty final string
							for (i = 1; i <= gtaBonuses01.length - 1; i++) { //iterates over every bonus
								//console.log(`${gtaBonuses01.length}`)									

								//console.log(`Titles: \n${gtaTitles01[i]}\n\n`);
								let gtaTitles001 = gtaTitles01[i].split("</b></p>"); //removes trailing string on titles
								//console.log(`Titles: \n${gtaTitles001[0]}\n\n`);

					//-----BEGIN get the index of "Only on PlayStation..." title-----//
							function onlyOnIndex1() { //returns the index of the title: Only on Playstation...
								if ( gtaTitles001[0].includes("ONLY ON PLAYSTATION") ) {
									return i + 1;
								} else {
									return -1;
									}
							}
								//console.log(`onlyOnIndex1() at ${i}: ${onlyOnIndex1()}`);
							function onlyOnIndex2() { //returns the index of the title: Only on Playstation...
								if ( gtaTitles001[0].includes("ONLY ON PLAYSTATION") ) {
									return i + 2;
								} else {
									return -2;
									}
							}
								//console.log(`onlyOnIndex2() at ${i}: ${onlyOnIndex2()}`);		

								if (onlyOnIndex1() > 0) {
									nextGenIndex1 += onlyOnIndex1(); //populates nextGenIndex1 with the index of the bonus after "Only on PS5..."
								}
									//console.log(`nextGenIndex1 at ${i}: ${nextGenIndex1}`);
 
								if (onlyOnIndex2() > 0) {
									nextGenIndex2 += onlyOnIndex2(); //populates nextGenIndex1 with the index of the second bonus after "Only on PS5..."
								}
									//console.log(`nextGenIndex2 at ${i}: ${nextGenIndex2}`);								
						//-----END get the index of "Only on PlayStation..." title-----//							

//------------------BEGIN capitalization Function-----------------//
								function titleCapitalization(titles) {
									//console.log(`Titles1: ${titles[0]}\n`); // Full Title
									let Titles2 = titles[0].split(` `);
									//console.log(`Titles2: ${Titles2[0]}\n`); // First word of the title

									let titlesLength = Object.keys(Titles2).length; //counts the number of words in the array
										//console.log(`Titles2 size at ${i}: ${titlesLength}\n`) 
									let gtaTitleString = "" //initial empty title, will be populated in the j loop
									for (j = 0; j <= titlesLength; ++j) {
										while (j <= (titlesLength)) { 
											//console.log(`I: ${i}, J: ${j}\n`) //while loop check, expected: i = title number, j = index of title words
											if ( (Titles2[j] != null) && (Titles2[j] != "") ) { //removes blank space elements
												//console.log(`Titles2 at J: ${j}: ${Titles2[j]}\n`) //checks for blank elements
												//console.log(`${Titles2[j].charAt(0)}${Titles2[j].toLowerCase().slice(1)}`); //capital first letters check 
											if ( (Titles2[j] === Titles2[0]) && (!Titles2[j].includes("GTA")) ) { // if the word is the first word in the title - returns first letter capitalized + rest of the word lowercase unless GTA
													gtaTitleString += `${Titles2[j].charAt(0)}${Titles2[j].toLowerCase().slice(1)} `; 
											}
											else if ( (Titles2[j].includes("GTA")) || (Titles2[j] === "XP")  ) { //returns all caps if title is GTA, GTA$, or XP
													gtaTitleString += `${Titles2[j]} `;
											}
											else if ( (Titles2[j] === "ON")  || (Titles2[j] === "OF") || (Titles2[j] === "THE") || (Titles2[j] === "AN") || (Titles2[j] === "AND") || (Titles2[j] === "FOR") || (Titles2[j] === "A") ) { //returns all lowercase if not a title word
												gtaTitleString += `${Titles2[j].toLowerCase()} `;
											} else {
												gtaTitleString += `${Titles2[j].charAt(0)}${Titles2[j].toLowerCase().slice(1)} `; //returns capital first letter and lowercase rest of the word
												}
											}
											++j;
										}
									}
									//return Titles2[0]; //Testbench, returns the first word of every element of titles
									return `${gtaTitleString}`;
								}
//--------------------END capitalization Function-----------------//

								let gtaTitles = titleCapitalization(gtaTitles001);
								//console.log(`final titles:\n ${gtaTitles}`);

								//console.log(`Bonuses: \n${gtaBonuses01[i]}\n\n`);
								let gtaBonuses = gtaBonuses01[i].split("<p><b>"); //removes trailing string on bonuses
								//console.log(`Bonuses at ${i}: \n${gtaBonuses[0]}\n\n`);
								
//---------------------------BEGIN populating gtaFinalString -------------------------//

							//console.log(`I: ${i} - nextGenIndex1: ${nextGenIndex1} - nextGenIndex2: ${nextGenIndex2}`);
							//console.log(`I: ${i} - 1-t/f: ${i.toString() === nextGenIndex1} - 2-t/f: ${i.toString() === nextGenIndex2}`);
						//Handles the "Only on PS5..." list being all titles
								if ( (i.toString() === nextGenIndex1) || (i.toString() === nextGenIndex2) )  { // if the index of the bonus is one or two after the "Only on PS5..." 
									gtaFinalString += `• ${gtaTitles}\n\n`;
										//console.log(`Titles0 at ${i}: \n${gtaTitles}\n\n`)
								}
									
					//Adds only the title to gtaFinalString if no links, trailing strings, or lists
								else if ( (!gtaBonuses[0].includes("<a")) && (!gtaBonuses[0].includes("body>")) && (!gtaBonuses[0].includes("style=")) && (!gtaBonuses[0].includes("<li>")) && (i != nextGenIndex1) && (i != nextGenIndex2) ) {
									//console.log(`Titles at ${i}: \n${gtaTitles[0]}\n\n`)

									//-----BEGIN paragraph count-----//
									let gtaParas = gtaBonuses[0].split("<p>");
									let gtaParaCount = Object.keys(gtaParas).length; //counts the paragraphs in bonuses
									if (gtaParaCount >= 3) { // if more than one paragraph, returns the second paragraph
											//console.log(`gtaParas at I - ${i}: ${gtaParas[2]}\n`);
										if (gtaParas[2] != null) {
											gtaFinalString += `**${gtaTitles}**\n • ${gtaParas[2]}`; 
										} 
									} else if (gtaParaCount <= 2) {
										if (gtaParas[1].includes("Luxury Autos Showroom")) {
												//console.log(`gtaParas at I - ${i}: ${gtaParas[1]}\n`);
											gtaFinalString += `**${gtaTitles}**\n • ${gtaParas[1]}`; 
										} 
										else {
												//console.log(`Only Title at ${i}: ${gtaTitles}`);
											gtaFinalString += `**${gtaTitles}**\n\n`;
										}
									}
									//-----END paragraph count-----//
								}
									
					//replaces all links
								else if ((gtaBonuses[0].includes("<a")) && (!gtaBonuses[0].includes("body>")) && (!gtaBonuses[0].includes("style="))) {
									//console.log(`Bonuses at ${i}: \n${gtaBonuses[0]}\n\n`);
									let gtaBonuses02 = gtaBonuses[0].replace(/<a.*?[^>]>/g, "");
										//console.log(`Bonuses02 at ${i}: \n${gtaTitles[0]}\n${gtaBonuses02}\n`);
									gtaFinalString += `**${gtaTitles}** ${gtaBonuses02}`;
								}
					//deletes the trailing code on the final bonus
								else if (gtaBonuses[0].includes("body")) { //    /\(.*\)/g
									//console.log(`Bonuses at ${i}: \n${gtaBonuses[0]}\n\n`);	
									let gtaBonuses003 = gtaBonuses[0].replace(/<a.*?[^>]>/g, "");
									let gtaBonuses03 = gtaBonuses003.split("</div>")
										//console.log(`Bonuses03 at ${i}: \n${gtaTitles[0]}\n${gtaBonuses03[0]}\n`);
									gtaFinalString += `**${gtaTitles}** ${gtaBonuses03[0]}`;
								}

					//if gtaBonuses[0] contains links and lists
								else if ((gtaBonuses[0].includes("style=")) && (gtaBonuses[0].includes("<a")) && (!gtaBonuses[0].includes("body>"))) {
									let gtaBonuses004 = gtaBonuses[0].replace(/<a.*?[^>]>/g, ""); //   .replace(/start.*[end]end/g, "");
									//console.log(`Bonuses004 at ${i}: \n${gtaBonuses004}\n\n`);
									let gtaBonuses04 = gtaBonuses004.split("style=\"line-height:1.5;\">");
										//console.log(`Bonuses04 at ${i}: \n${gtaTitles[0]}\n${gtaBonuses04[1]}\n\n`);
									gtaFinalString += `**${gtaTitles}** ${gtaBonuses04[1]}`;
								}

					//if gtaBonuses[0] contains lists but no links
								else if ( ( (gtaBonuses[0].includes("style=")) || (gtaBonuses[0].includes("<li>")) ) && (!gtaBonuses[0].includes("<a")) && (!gtaBonuses[0].includes("body>"))) {
									let gtaBonuses05 = gtaBonuses[0].split("style=\"line-height:1.5;\">");
										//console.log(`Bonuses05 at ${i}: \n${gtaTitles}\n${gtaBonuses05[1]}\n\n`);
									if (gtaBonuses05[1] != null) {
										gtaFinalString += `**${gtaTitles}** ${gtaBonuses05[1]}`;
									} else {
										gtaFinalString += `\n• ${gtaTitles} \n\n\n\n\n`; //not sure why it needs so many newlines...
									}
								}
					//error
								else {
									console.log(`error: gtaTitles at ${i}:\n ${gtaTitles} \n gtaBonuses at ${i}:\n ${gtaBonuses[i]}`)
								}
							}
							//console.log(`gtaFinalString: \n${gtaFinalString}\n\n`);

//---------------------------END populating gtaFinalString-------------------------//

							let gtaEmbed = new MessageEmbed()
								.setColor('#00CD06') //Green
								.setTitle('Grand Theft Auto V Online Weekly Bonuses & Discounts:')
								.setDescription(`${gtaDate[0]}\n\n${gtaFinalString}\n\n\n\n\n**[click here](${gtaURL}) for more details**`
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
						// Below this differs from RDO 	
									.replace(/\n\n• /g, "\n• ") //removes double spaces before a list
									.replace(/\*\*\n\n• /g, "**\n• ") //removes double spaces before a list
									.replace(/\*\*\n \n• \*\*/g, "**\n**• ") //removes double spaces before a list
									.replace(/• •/g, "• ") //removes multiple bullet points
								)

							interaction.editReply({ embeds: [gtaEmbed] });



							await instance.exit(); 
						})()

					} else {
						console.log('error2', error, response && response.statusCode);
					}
				});

			});



		//interaction.editReply(`Console logged! 👍`)

	}
}
