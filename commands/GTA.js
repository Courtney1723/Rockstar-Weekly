const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed } = require('discord.js');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));



module.exports = {
	data: new SlashCommandBuilder()
		.setName('gta')
		.setDescription('Replies with GTA Online latest bonuses and discounts'),
async execute(interaction, user) {



  const gta1 =   await fetch('https://www.ign.com/wikis/gta-5/GTA_Online_Weekly_Updates').then(res => res.text())

  let args = gta1.split("mw-headline") 

  let gtaBody = args[2].split("2022: ")//Gets the latest post

  let gtaTitle = args[2].split("\"header\\\"\\u003e")

  let gtaTitle1 = gtaTitle[1].split(":")

  let gtaBodyMain = gtaBody[1].split("u003e\\u003cli\\u003e\\u003cb\\u003e") //Gets the body of the post

  let gtaBodyMain1 = gtaBodyMain[1].split("Prime Gaming accounts by visiting")

  // const aDate = new Date();

  //let dayDate = aDate.getDate(); //Two-digit date
  
  //let monthDate = aDate.toLocaleString('en-us', { month: 'long' }); //Long Month 

  //let yearDate = aDate.getFullYear(); //Full Year

  let gtaEmbed = new MessageEmbed()
      .setColor('#B75AFF') //Purple
      .setTitle(`GTA V Online Weekly Bonuses & Discounts:`)
      .setDescription(`**Last Updated ${gtaTitle1[0]}** \n\n${gtaBodyMain1[0]} by [clicking here](https://Twitch.amazon.com/Prime/Loot/GTAonline)\n\n[Click here](https://www.ign.com/wikis/gta-5/GTA_Online_Weekly_Updates) to view more bonuses & discounts.`

      .replace(/\\u0026amp;/g, "&") // &
      .replace(/\\u0026#x2019;/g, "'") // '
      .replace(/\\u003c\/b\\u003e\\u003cbr\\u003e/g, "\n")
.replace(/\\u003c\/li\\u003e\\n\\u003cli\\u003e\\u003cb\\u003e/g, "\n\n")
      .replace(/\\u003cbr\\u003e/g, "\n")
      .replace(/\\u003c\/b\\u003e/g, "")
      .replace(/\\u0026#xDC;/g, "Ü") // For the Übermacht
                                         
                     
                     
                     )

    


  
    return interaction.reply({ embeds: [gtaEmbed] })

                                    
                        
                        
                        
                        
                        }}
    
    



          

