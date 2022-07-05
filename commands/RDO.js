const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed } = require('discord.js');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));



module.exports = {
	data: new SlashCommandBuilder()
		.setName('rdo')
		.setDescription('Replies with RDO latest bonuses and discounts'),
async execute(interaction, user) {



  const rdo1 =   await fetch('https://www.ign.com/wikis/red-dead-redemption-2/Red_Dead_Online_Updates_Archive#Red_Dead_Redemption_2_Online_Updates').then(res => res.text())

  // gets latest post
  let args = rdo1.split("\"header\\\"\\u003e") 

      //gets the latest update
      let rdoBody = args[3].split("\\u003c\/li\\u003e\\u003c\/")

      let rdoBody1 = rdoBody[0].split("\"html\":\"\\u003cul\\u003e\\u003cli\\u003e \\u003cb\\u003e") 

    
        //gets the latest Monthly update 
        let rdoMonthBody = args[4].split("\\u003cul\\u003e\\u003cli\\u003e\\u003cb\\u003e")

        let rdoMonthBody1 = rdoMonthBody[1].split("Players can link their Rockstar Games Social Club") 


  //gets week 1 bonuses
  let rdoLaterBody = args[6].split("u003cb\\u003e")  

        // gets week 1 bonus date
        let rdoLaterBodyDate = rdoLaterBody[0].split("\\u003c\/li\\u003e") 

        let rdoLaterBodyDate1 = rdoLaterBodyDate[0].split(", 2022") 

        let rdoLaterBody1 = args[6].split("\\u003cul\\u003e\\u003cli\\u003e \\u003cb\\u003e") 

  
  // gets week 2 bonuses
  let rdoLaterBody2 = rdoLaterBody1[1].split("\\u003c\/li\\u003e\\u003c\/ul\\u003e\"") 

        let rdoExtraBody = args[7].split("\\u003c\/li\\u003e\\u003c\/")

        //gets the week 2 date
        let rdoExtraBodyDate = rdoExtraBody[0].split(", 2022") 

        let rdoExtraBody1 = rdoExtraBody[0].split("\\u003cul\\u003e\\u003cli\\u003e \\u003cb\\u003e")

  // gets the week 3 bonuses
  let rdoDoubleExtraBody = args[8].split("\\u003c\/li\\u003e\\u003c\/")

    // gets the week 3 date
        let rdoDoubleExtraBodyDate = rdoDoubleExtraBody[0].split(", 2022")

  // gets the week 4 bonuses
  let rdoDoubleExtraBody1 = rdoDoubleExtraBody[0].split("\\u003e\\u003cli\\u003e \\u003cb\\u003e")

    // gets the week 4 dates
    let rdoDate = args[3].split(", 2022")

  
  let rdoEmbed = new MessageEmbed()
      .setColor('#C10000') //Red
      .setTitle('Red Dead Redemption II Online Weekly Bonuses & Discounts:')
      .setDescription(`__**Monthly Bonuses:**__
**${rdoMonthBody1[0]}[Click Here](https://Twitch.amazon.com/RDO) to link your Rockstar Games Social Club and Prime Gaming accounts 
\n__Weekly Bonuses:__
\n__${rdoDate[0]}__\n${rdoBody1[1]} 
\n\n**__${rdoLaterBodyDate1[0]}__\n${rdoLaterBody2[0]}
\n\n**__${rdoExtraBodyDate[0]}__\n${rdoExtraBody1[1]}
\n\n**__${rdoDoubleExtraBodyDate[0]}__\n${rdoDoubleExtraBody1[1]}
\n[Click Here](https://www.ign.com/wikis/red-dead-redemption-2/Red_Dead_Online_Updates_Archive) to view more bonuses and discounts`
          
            .replace(/\\u003cbr\\u003e/g, "\n")
            .replace(/\\u003cb\\u003e/g, "\n**")     
            .replace(/\\u003c\/b\\u003e/g, "**")

            .replace(/\\u003c\/li\\u003e\\n\\u003cli\\u003e/g, "\n")

                      
            .replace(/\\u0026#x201C;/g, "\n")
            .replace(/\\u0026#x201D;/g, "") 
            .replace(/\\u0026#x2018;/g, "'")
            .replace(/\\u0026#x2019;/g , "'")
            .replace(/\\u0026amp;/g, "&")
            .replace(/\\u0026#xE9;/g, "é")
                     
                     
                     );

    await interaction.deferReply();
  
    await interaction.editReply({ embeds: [rdoEmbed] }).catch(err => {console.log(err)});

                                    
                        
                        
                        
                        
                        }}
