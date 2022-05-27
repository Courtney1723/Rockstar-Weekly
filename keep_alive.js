var http = require('http');

const Discord = require("discord.js"); //Discord package

http.createServer(function (req, res) {
  
  res.write("Logged in as the Rockstar Weekly Bonuses and Discounts Bot! \nCreated by Courtney1723"); 
res.end();
}).listen(8080);




