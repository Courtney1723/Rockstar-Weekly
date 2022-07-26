const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gta')
    .setDescription('Replies with GTA V Online latest bonuses and discounts'),
  async execute(interaction, user) {
    const gta1 = await fetch('https://www.ign.com/wikis/gta-5/GTA_Online_Weekly_Updates').then(res => res.text())
    let args = gta1.split("mw-headline")
    let gtaBody = args[2].split("2022: ")//Gets the latest post
    let gtaTitle = args[2].split("\"header\\\"\\u003e")
    let gtaTitle1 = gtaTitle[1].split(":")
    let gtaBodyMain = gtaBody[1].split("u003e\\u003cli\\u003e\\u003cb\\u003e") //Gets the body of the post
    let gtaBodyMain1 = gtaBodyMain[1].split("\\u003c\/li\\u003e\\u003c\/ul\\u003e") // cuts the end of the post off, formatting

    function elipseFunction() {
      if (gtaBodyMain1[0].length > 4096) {
        return "...";
        } else {
        return " ";
        }
    }
    function gtaPost() {
        return gtaBodyMain1[0].slice(0, 4096);
    }
    //console.log(`1: ${gtaBodyMain1[0].length}\n`)
    function gtaPost2() {
      if (gtaBodyMain1[0].length > 4096) {
        let post02 = gtaBodyMain1[0].substr(4096, 2303);
        return post02;
      } else {
        return "";
      }
    }  
    function gtaFooterMax() {
      if (gtaBodyMain1[0].length > 4096) {
        return "\n\n**[Click here](https://www.ign.com/wikis/gta-5/GTA_Online_Weekly_Updates) to view more bonuses & discounts.\n\nLink your Rockstar Games Social Club with Twitch Prime Gaming by [clicking here](https://Twitch.amazon.com/Prime/Loot/GTAonline)";
      } else {
        return "";
      }
    }
    function gtaFooterMin() {
      if (gtaBodyMain1[0].length <= 4096) {
        return "\n\n**[Click here](https://www.ign.com/wikis/gta-5/GTA_Online_Weekly_Updates) to view more bonuses & discounts.**\n\nLink your Rockstar Games Social Club with Twitch Prime Gaming by [clicking here](https://Twitch.amazon.com/Prime/Loot/GTAonline)";
      } else {
        return "";
      }
    }    
    
let gtaEmbed = new MessageEmbed()
  .setColor('#00CD06') //Green
  .setTitle(`GTA V Online Weekly Bonuses & Discounts:`)
  .setDescription(`**Last Updated ${gtaTitle1[0]}** \n\n**${gtaPost()}${elipseFunction()}${gtaFooterMin()}`
    .replace(/\\u0026amp;/g, "&") // &
    .replace(/\\u0026#x2019;/g, "'") // apostrophe
    .replace(/\\u0026apos;/g, "'") // apostrophe
    .replace(/\\u003c\/b\\u003e\\u003cbr\\u003e/g, "**\n • ")
    .replace(/\\u003c\/li\\u003e\\n\\u003cli\\u003e\\u003cb\\u003e/g, "\n\n**")
    .replace(/\\u003c\/b\\u003e/g, "**")
    .replace(/\\u003cbr\\u003e/g, "\n • ")
    .replace(/\\u0026#xDC;/g, "Ü") // For the Übermacht  
  );
    
let gtaEmbed2 = new MessageEmbed()
  .setColor('#00CD06') //Green
  .setDescription(`${gtaPost2()}${elipseFunction()}${gtaFooterMax()}**`
    .replace(/\\u0026amp;/g, "&") // &
    .replace(/\\u0026#x2019;/g, "'") // apostrophe
    .replace(/\\u0026apos;/g, "'") // apostrophe
    .replace(/\\u003c\/b\\u003e\\u003cbr\\u003e/g, "**\n • ")
    .replace(/\\u003c\/li\\u003e\\n\\u003cli\\u003e\\u003cb\\u003e/g, "\n\n**")
    .replace(/\\u003cbr\\u003e/g, "\n • ")
    .replace(/\\u0026#xDC;/g, "Ü") // For the Übermacht  
  );     

await interaction.deferReply();

  if (gtaBodyMain1[0].length > 4096) {
    await interaction.editReply({ embeds: [gtaEmbed, gtaEmbed2] }).catch(err => { console.log(err) });
  } else {
    await interaction.editReply({ embeds: [gtaEmbed] }).catch(err => { console.log(err) });      
  }

}}
