var http = require('http');

http.createServer(function (req, res) {
  res.write("Logged in as Rockstar Games Weekly Bonuses and Discounts Bot! \nCreated by Courtney1723");
  res.end();
}).listen(8080);
