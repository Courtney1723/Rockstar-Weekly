const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed } = require('discord.js');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));



module.exports = {
	data: new SlashCommandBuilder()
		.setName('rdo')
		.setDescription('Replies with RDO latest bonuses and discounts'),
async execute(interaction, user) {



  const rdo1 =   await fetch('https://www.ign.com/wikis/red-dead-redemption-2/Red_Dead_Online_Updates_Archive#Red_Dead_Redemption_2_Online_Updates').then(res => res.text())

  let args = rdo1.split("\"header\\\"\\u003e") // gets latest post

    let rdoBody = args[3].split("\\u003c\/li\\u003e\\u003c\/")

      let rdoBody1 = rdoBody[0].split("\"html\":\"\\u003cul\\u003e\\u003cli\\u003e \\u003cb\\u003e") //gets the latest update

    

    let rdoMonthBody = args[4].split("\\u003c\/li\\u003e\\u003c\/")

      let rdoMonthBody1 = rdoMonthBody[0].split("{\"html\":\"\\u003cul\\u003e\\u003cli\\u003e \\u003cb\\u003e") //gets the latest Monthly update 



    
    let rdoLaterBody = args[6].split("u003cb\\u003e")  

        let rdoLaterBodyDate = rdoLaterBody[0].split("\\u003c\/li\\u003e") 

        let rdoLaterBodyDate1 = rdoLaterBodyDate[0].split(", 2022") //gets the later update dates

        let rdoLaterBody1 = args[6].split("\\u003cul\\u003e\\u003cli\\u003e \\u003cb\\u003e") 

        let rdoLaterBody2 = rdoLaterBody1[1].split("\\u003c\/li\\u003e\\u003c\/ul\\u003e\"") // gets the later update body post
    




    

  let rdoDate = args[3].split(", 2022") //Gets the Date

  let rdoEmbed = new MessageEmbed()
      .setColor('#B75AFF') //Purple
      .setTitle('Red Dead Redemption II Online Weekly Bonuses & Discounts:')
      .setDescription(`**Last Updated ${rdoDate[0]}**\n\n${rdoBody1[1]}\n\n**Monthly Bonuses:**\n${rdoMonthBody1[1]} \n\n **Other Bonuses:**\n ${rdoLaterBodyDate1[0]}\n\n${rdoLaterBody2[0]}\n\n[Click Here](https://www.ign.com/wikis/red-dead-redemption-2/Red_Dead_Online_Updates_Archive) to view more bonuses and discounts`

                      
            .replace(/\\u0026#x2019;/g , "'")
            .replace(/\\u003c\/b\\u003e\\u003cbr\\u003e/g, "\n")
            .replace(/\\u003cbr\\u003e/g, "\n")
            .replace(/\\u003c\/li\\u003e\\n\\u003cli\\u003e \\u003cb\\u003e/g, "\n\n")
            .replace(/\\u0026#x2018;/g, "'")     
            .replace(/\\u003c\/li\\u003e\\n\\u003cli\\u003e\\u003cb\\u003e/g, "\n")
            .replace(/\\u0026#x201C;/g, "\n")
            .replace(/\\u0026#x201D;/g, "")
            .replace(/Prime Gaming accounts by visiting \\u003ca rel=\\\"nofollow\\\" class=\\\"external text\\\" href=\\\"https:\/\/twitch.amazon.com\/RDO\\\"\\u003eTwitch.amazon.com\/RDO\\u003c\/a\\u003e.\\u003c\/b\\u003e/g, "Prime Gaming accounts by [clicking here](https://twitch.amazon.com/RDO)")                     
                     
                     
                     )

    


  
    return interaction.reply({ embeds: [rdoEmbed] })

                                    
                        
                        
                        
                        
                        }}
    
    



          

