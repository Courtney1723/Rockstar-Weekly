const Discord = require("discord.js"); //Discord package
const fs = require("fs")

const client = new Discord.Client();

const prefix = "?"; //Creates a prefix $

module.exports = {
	name: 'help',
	description: 'Help!',
	execute(message) {

  if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

  if (message.content.toLowerCase().startsWith(prefix + "help")) {
    message.channel.send({embed: {
            color: 0xB75AFF, //Purple
            description: ("**__Rockstar Weekly Bot Commands__**\n\n**?help**\n> provides a list of commands \n**?ping**\n> Rockstar Weekly Bot responds with pong! when online \n**?rdo**\n> Provides the latest weekly RDO update\n**?gta**\n> Provides the latest GTA Online weekly update") 
      }})}
  }}

    