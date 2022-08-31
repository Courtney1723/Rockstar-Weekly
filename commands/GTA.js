const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
var request = require('request');
const phantom = require('phantom');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gta')
		.setDescription('Latest GTA V online bonuses and discounts'),
	async execute(interaction) {
		await interaction.deferReply().catch(console.error);

		let gtaURL = process.env.SOCIAL_URL_GTA;
		const instance = await phantom.create();
		const page = await instance.createPage();

		await page.property('viewportSize', { width: 1024, height: 600 });
		const status = await page.open(gtaURL);
			//console.log(`Page opened with status [${status}].`);
		if (status === `success`) { //checks if Rockstar Social Club website is down
		const content = await page.property('content'); 
			//console.log(content); 
		let gtaString = content.toString(); // Gets the latest gta updates
			//console.log(`${gtaString}`);
		let gtaDate01 = gtaString.split("class=\"date\">"); //gets the event date
			//console.log(`${gtaDate01[1]}`);
		let gtaDate = gtaDate01[1].split("<"); //cuts off the end of the date
			//console.log(`Date: ${gtaDate[0]}\n`);
		let gtaRemoveHTMLTitles = gtaString.replace(/<b>Sprunk/g, "Sprunk "); //removes bold items that confuse the bonus split
		let gtaTitles01 = gtaRemoveHTMLTitles.split("<p><b>"); //gets the titles
			//console.log(`Titles: ${gtaTitles01}\n`);			
		let gtaRemoveHTML = gtaString.replace(/<\/b><\/p><\/ul>/g, "</p>"); //removes bold items that confuse the bonus split
		let gtaBonuses01 = gtaRemoveHTML.split("</b></p>");	//gets the bonuses
			//console.log(`gtaBonuses01: \n${gtaBonuses01}\n`);
		let gtaImage01 = gtaString.split("og:image\" content=\"");
			//console.log(`gtaImage01: ${gtaImage01[1]}`);
		let gtaImage = gtaImage01[1].split("\" data-rh=");
			//console.log(`gtaImage: ${gtaImage[0]}`);		
		// Strings to be populated with the indexes of the two titles after the "Only on PlayStation..." title
		let nextGenIndex1 = ""; // empty string to be populated
		let nextGenIndex2 = ""; // empty string to be populated
							
//---------------BEGIN 1st for loop----------------//
		let gtaFinalString = ""; //initial empty final string, will be populated in the i loop
		for (i = 1; i <= gtaTitles01.length - 1; i++) { //iterates over every bonus
				//console.log(`${gtaBonuses01.length}`);
			//console.log(`Titles: \n${gtaTitles01[i]}\n\n`);
			let gtaTitles001 = gtaTitles01[i].split("</b></p>"); //removes trailing string on titles
				//console.log(`Titles at ${i}: \n${gtaTitles001[0]}\n`);

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
				nextGenIndex1 += onlyOnIndex1(); //populates nextGenIndex1 with the index of the title after "Only on PS5..."
			}
				//console.log(`nextGenIndex1 at ${i}: ${nextGenIndex1}`);

			if (onlyOnIndex2() > 0) {
				nextGenIndex2 += onlyOnIndex2(); //populates nextGenIndex1 with the index of the second title after "Only on PS5..."
			}
				//console.log(`nextGenIndex2 at ${i}: ${nextGenIndex2}`);								
		//-----END get the index of "Only on PlayStation..." title-----//							

//------------------BEGIN capitalization Function-----------------//
		function titleCapitalization(titles) {
				//console.log(`Titles1: ${titles[0]}\n`); // Full Title
				let Titles2 = titles[0].split(` `);
					//console.log(`Titles2: ${Titles2[0]}\n`); // First word of the title
				let titlesLength = Object.keys(Titles2).length; //counts the number of words in the title array
					//console.log(`Titles2 size at ${i}: ${titlesLength}\n`);
				let gtaTitleString = ""; //initial empty title, will be populated in the j loop
				
			for (j = 0; j <= titlesLength; ++j) {
				while (j <= (titlesLength)) { 
					//console.log(`I: ${i}, J: ${j}\n`); //while loop check, expected: i = title number, j = index of title words
					if ( (Titles2[j] != null) && (Titles2[j] != "") ) { //ignores blank space elements
						//console.log(`Titles2 at J: ${j}: ${Titles2[j]}\n`); //checks for blank elements
						//console.log(`${Titles2[j].charAt(0)}${Titles2[j].toLowerCase().slice(1)}`); //capital first letters check 
	//returns first letter capitalized + rest of the word lowercase if the word is the first word in the title - unless GTA
					if ( (Titles2[j] === Titles2[0]) && (!Titles2[j].includes("GTA")) && (Titles2[j] != "XP") && (Titles2[j] != "RP") && (Titles2[j] != "GT") && (Titles2[j] != "LD") && (Titles2[j] != "LSPD") ) { 
						gtaTitleString += `${Titles2[j].charAt(0)}${Titles2[j].toLowerCase().slice(1)} `; 
					}
	//returns all caps if title is GTA, GTA$, or XP							
					else if ( (Titles2[j].includes("GTA")) || (Titles2[j] === "XP") || (Titles2[j] === "RP") || (Titles2[j] === "GT")  || (Titles2[j] === "LD") || (Titles2[j] === "LSPD") ) { 
							gtaTitleString += `${Titles2[j]} `;
					}
	//returns all lowercase if not a title word					
					else if ( (Titles2[j] === "ON")  || (Titles2[j] === "OF") || (Titles2[j] === "THE") || (Titles2[j] === "AN") || (Titles2[j] === "AND") || (Titles2[j] === "FOR") || (Titles2[j] === "A") || (Titles2[j] === "AT") || (Titles2[j] === "IN") ) { 
						gtaTitleString += `${Titles2[j].toLowerCase()} `;
					} 
	//else returns capital first letter and lowercase rest of the word				
					else {
						gtaTitleString += `${Titles2[j].charAt(0)}${Titles2[j].toLowerCase().slice(1)} `; 
						}
					}
					++j;
				}
			}
			//return Titles2[0]; //Testbench if gtaTitleString has an error, this returns the first word of every title
			return `${gtaTitleString}`;
			}
			
			let gtaTitles = titleCapitalization(gtaTitles001);  //passes gtaTitles001 through the titleCapitalization function
				//console.log(`final titles at ${i}: ${gtaTitles}\n`);							
//--------------------END capitalization Function-----------------//							
				//console.log(`Pre-Bonuses at ${i}: \n${gtaBonuses01[i]}\n\n`);
			let gtaBonuses = gtaBonuses01[i].split("<p><b>"); //removes trailing string on bonuses
				//console.log(`Bonuses at ${i}: \n${gtaBonuses[0]}\n`);		
//---------------------------BEGIN populating gtaFinalString -------------------------//
		//console.log(`I: ${i} - nextGenIndex1: ${nextGenIndex1} - nextGenIndex2: ${nextGenIndex2}`);
		//console.log(`I: ${i} - 1-t/f: ${i.toString() === nextGenIndex1} - 2-t/f: ${i.toString() === nextGenIndex2}`);
			
//1: Handles the "Only on PS5..." list being all titles
			if ( (i.toString() === nextGenIndex1) || (i.toString() === nextGenIndex2) )  { // if the index of the bonus is one or two after the "Only on PS5..." 
				gtaFinalString += `• ${gtaTitles}\n\n\n\n\n`;
					//console.log(`1: Titles at ${i}: \n${gtaTitles}\n`);
			}
				
// 2-4: Adds only the title to gtaFinalString if no links, trailing <div>'s, or lists
			else if ( (!gtaBonuses[0].includes("<a")) && (!gtaBonuses[0].includes("body>")) && (!gtaBonuses[0].includes("style=")) && (!gtaBonuses[0].includes("<li>")) && (gtaBonuses[0] != "</ul>") && (i != nextGenIndex1) && (i != nextGenIndex2) ) {
				//console.log(`Titles at ${i}: \n${gtaTitles[0]}\n\n`);

				//-----BEGIN paragraph count-----// //Returns the second paragraph if more than one paragraph
				let gtaParas = gtaBonuses[0].split("<p>");
					//console.log(`gtaParas at ${i}: ${gtaParas}`);
				let gtaParaCount = Object.keys(gtaParas).length; //counts the paragraphs in bonuses
					//console.log(`gtaParas length at ${i}: ${gtaParas.length}`);
				if (gtaParaCount >= 3) { // if more than one paragraph, returns the second paragraph
						//console.log(`2: gtaParas at I - ${i}: ${gtaParas[1]}\n`);
					if ( (gtaParas[1] != null) && (gtaParas[2] != null)) {
						gtaFinalString += `**${gtaTitles}**\n • ${gtaParas[1]} • ${gtaParas[2]}`; 
					} 	
					if ( (gtaParas[1] != null) && (gtaParas[2] === null)) {
						gtaFinalString += `**${gtaTitles}**\n • ${gtaParas[1]}`; 
					} 					
				} else if (gtaParaCount <= 2) { // if one or 0 paragraphs, returns only the title - unless "Luxury Autos Showroom...""
					if (gtaParas[1].toLowerCase().includes("luxury autos showroom")) { 
							//console.log(`3: gtaParas at I - ${i}: ${gtaParas[1]}\n`);
						gtaFinalString += `**${gtaTitles}**\n • ${gtaParas[1]}`; 
					} 
					//-----END paragraph count-----//	
					else { 					
							//console.log(`4: Only Title at ${i}: ${gtaTitles} para: ${gtaParas[1]}`);
						gtaFinalString += `**${gtaTitles}**\n\n\n\n\n\n`;
					}
				}
			}
				
//5: replaces all links not in lists
			else if ((gtaBonuses[0].includes("<a")) && (!gtaBonuses[0].includes("body>")) && (!gtaBonuses[0].includes("style="))) {
				//console.log(`Bonuses at ${i}: \n${gtaBonuses[0]}\n\n`);
				let gtaBonuses02 = gtaBonuses[0].replace(/<a.*?[^>]>/g, "");
					//console.log(`5: Bonuses02 at ${i}: \n${gtaTitles}\n${gtaBonuses02}\n`);
				gtaFinalString += `**${gtaTitles}** ${gtaBonuses02}`;
			}
//6: deletes the trailing code on the final bonus
			else if (gtaBonuses[0].includes("body")) { //    /\(.*\)/g
				//console.log(`Bonuses at ${i}: \n${gtaBonuses[0]}\n\n`);	
				let gtaBonuses003 = gtaBonuses[0].replace(/<a.*?[^>]>/g, "");
				let gtaBonuses03 = gtaBonuses003.split("</div>");
					//console.log(`6: Bonuses03 at ${i}: \n${gtaTitles[0]}\n${gtaBonuses03[0]}\n`);
				gtaFinalString += `**${gtaTitles}** ${gtaBonuses03[0]}`;
			}

//7: if gtaBonuses[0] contains links and lists
			else if ((gtaBonuses[0].includes("style=")) && (gtaBonuses[0].includes("<a")) && (!gtaBonuses[0].includes("body>"))) {
				let gtaBonuses004 = gtaBonuses[0].replace(/<a.*?[^>]>/g, ""); //   .replace(/start.*[end]end/g, "");
				//console.log(`Bonuses004 at ${i}: \n${gtaBonuses004}\n\n`);
				let gtaBonuses04 = gtaBonuses004.split("style=\"line-height:1.5;\">");
					//console.log(`7: Bonuses04 at ${i}: \n${gtaTitles[0]}\n${gtaBonuses04[1]}\n\n`);
				gtaFinalString += `**${gtaTitles}** ${gtaBonuses04[1]}`;
			}

//8: if gtaBonuses[0] contains lists but no links
			else if ( ( (gtaBonuses[0].includes("style=")) || (gtaBonuses[0].includes("<li>")) ) && (!gtaBonuses[0].includes("<a")) && (!gtaBonuses[0].includes("body>"))) {
				let gtaBonuses05 = gtaBonuses[0].split("style=\"line-height:1.5;\">");
					//console.log(`8: Bonuses05 at ${i}: \n${gtaTitles}\n${gtaBonuses05[1]}\n\n`);
				if (gtaBonuses05[0].toLowerCase().includes("luxury autos")) {
					gtaFinalString += `**${gtaTitles}** ${gtaBonuses05[0]}`;
				}
				else if (gtaBonuses05[1] != null) {
					gtaFinalString += `**${gtaTitles}** ${gtaBonuses05[1]}`;
				} else {
					gtaFinalString += `\n• ${gtaTitles} \n\n\n\n\n`; //not sure why it needs so many newlines...
				}
			}
//9: error
			else {
				console.log(`9: error: gtaTitles at ${i}:\n ${gtaTitles} \n gtaBonuses at ${i}:\n ${gtaBonuses[i]}`);
			}
		}
		//console.log(`gtaFinalString: \n${gtaFinalString}\n\n`);

//---------------------------END populating gtaFinalString-------------------------//


    function gtaPost() {
        return gtaFinalString.slice(0, 4097);
    }
    //console.log(`1: ${gtaFinalString.length}\n`) 
    function gtaPost2() {
      if (gtaFinalString.length > 4096) {
        let post02 = gtaFinalString.substr(4097, 2300);
        return post02;
      } else {
        return "";
      }
    }  
    function elipseFunction() {
      if (gtaFinalString.length > 4096) {
        return "...";
        } else {
        return "";
        }
    }		
    function gtaFooterMax() {
      if (gtaFinalString.length > 4096) {
        return `** [click here](${gtaURL}) for more details**`;
      } else {
        return "";
      }
    }
    function gtaFooterMin() { 
      if (gtaFinalString.length <= 4096) {
        return `** [click here](${gtaURL}) for more details**`;
      } else {
        return "";
      }
    }  

		
		let gtaEmbed = new MessageEmbed()
			.setColor('#00CD06') //Green
			.setTitle('Grand Theft Auto V Online Weekly Bonuses & Discounts:')
			.setDescription(`${gtaDate[0]}\n\n${gtaPost()}\n\n\n\n\n${gtaFooterMin()} ${elipseFunction()}`
				.replace(/\s\s\s\s/g, '') //removes multiple spaces
				.replace(/<li>/g, "• ")
				.replace(/<p>/g, "• ")
				.replace(/<b>/g, "")
				.replace(/<\/li>/g, "")
				.replace(/<\/p>/g, "")
				.replace(/<\/b>/g, "")
				.replace(/<ul /g, "")
				.replace(/<\/ul>/g, "")
				.replace(/<\/a>/g, "")
				.replace(/&amp;/g, "&") //Ampersand						
				.replace(/&nbsp;/g, " ") //Non breaking space
	// Below this differs from RDO 	
				.replace(/\n\n• /g, "\n• ") //removes double spaces before a list
				.replace(/• •/g, "• ") //removes multiple bullet points
				.replace(/GTA\+ website/g, "[GTA+ website](https://www.rockstargames.com/gta-plus)")
				.replace(/GTA\+ Guide/g, "[GTA+ Guide](https://www.rockstargames.com/gta-online/guides/7539)")
				.replace(/ Prime Gaming/g, " [Prime Gaming](https://gaming.amazon.com/loot/gtaonline)")
				.replace(/Rockstar Games Social Club/g, "[Rockstar Games Social Club](https://socialclub.rockstargames.com)")
				.replace(/Check Rockstar Support/g, "[Check Rockstar Support](https://support.rockstargames.com/articles/360053937434/Claiming-Rockstar-Games-Social-Club-x-span-class-highlight-Prime-Gaming-span-benefits)")
			)
		let gtaEmbed2 = new MessageEmbed()
			.setColor('#00CD06') //Green
			.setDescription(`${elipseFunction()} ${gtaPost2()}\n\n\n\n\n${gtaFooterMax()}`
				.replace(/\s\s\s\s/g, '') //removes multiple spaces
				.replace(/<li>/g, "• ")
				.replace(/<p>/g, "• ")
				.replace(/<b>/g, "")
				.replace(/<\/li>/g, "")
				.replace(/<\/p>/g, "")
				.replace(/<\/b>/g, "")
				.replace(/<ul /g, "")
				.replace(/<\/ul>/g, "")
				.replace(/<\/a>/g, "")
				.replace(/&amp;/g, "&") //Ampersand						
				.replace(/&nbsp;/g, " ") //Non breaking space
	// Below this differs from RDO 	
				.replace(/\n\n• /g, "\n• ") //removes double spaces before a list
				.replace(/• •/g, "• ") //removes multiple bullet points
				.replace(/GTA\+ website/g, "[GTA+ website](https://www.rockstargames.com/gta-plus)")
				.replace(/GTA\+ Guide/g, "[GTA+ Guide](https://www.rockstargames.com/gta-online/guides/7539)")
				.replace(/ Prime Gaming/g, " [Prime Gaming](https://gaming.amazon.com/loot/gtaonline)")
				.replace(/Rockstar Games Social Club/g, "[Rockstar Games Social Club](https://socialclub.rockstargames.com)")
				.replace(/Check Rockstar Support/g, "[Check Rockstar Support](https://support.rockstargames.com/articles/360053937434/Claiming-Rockstar-Games-Social-Club-x-span-class-highlight-Prime-Gaming-span-benefits)")
			)		
		let gtaImageEmbed = new MessageEmbed()
			.setColor('#00CD06') //Green
			.setImage(`${gtaImage[0]}`)
			//console.log(`${gtaImage[0]}`);

		const aDate = new Date();
		const aDay = aDate.getDay(); //Day of the Week
			//console.log(`aDay: ${aDay}`);
		const aHour = aDate.getHours(); //Time of Day UTC (+6 MST; +4 EST)
			//console.log(`aHour: ${aHour}`);
		
 		let gtaExpiredEmbed = new MessageEmbed()
			.setColor('#00CD06') //Green
			.setDescription(`The above bonuses & discounts may be expired. \nRockstar releases the latest weekly bonuses & discounts every \nThursday after 12:30 PM EST`)

		if (gtaFinalString.length <= 4096) {
			await interaction.editReply({ embeds: [gtaEmbed] }).catch(console.error);
		} else {
			await interaction.editReply({ embeds: [gtaEmbed, gtaEmbed2] }).catch(console.error);
		}
		//if ( (aDay === 5) ) { //Test for today 0 = Sunday, 1 = Monday ... 6 = Saturday
		if ( (aDay === 4) && (aHour < 17) ) { //If it's Thursday(4) before 1:00PM EST (17)
			interaction.followUp({embeds: [gtaExpiredEmbed], ephemeral:true}).catch(console.error);
		}		

		//interaction.editReply(`Console logged! 👍`);
		} else {
			interaction.editReply(`The Rockstar Social Club website is down. \nPlease try again later. \nSorry for the inconvenience.`)
			console.log(`The Rockstar Social Club website is down.`)
		}
	}
}
