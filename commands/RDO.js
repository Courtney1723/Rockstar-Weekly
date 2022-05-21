const fs = require("fs")

const fetch = require("node-fetch") //Required for .fetch() 

const prefix = "?"; //Creates a prefix $



module.exports = {
	name: 'rdo',
	description: 'rdo command',
	async execute(message, user) {

  if (!message.content.toLowerCase().startsWith(prefix + "rdo")) return;

  const rdo1 =   await fetch('https://www.ign.com/wikis/red-dead-redemption-2/Red_Dead_Online_Updates_Archive#Red_Dead_Redemption_2_Online_Updates').then(res => res.text())

  let args = rdo1.split("\"header\\\"\\u003e") // gets latest post

    let rdoBody = args[3].split("\\u003c\/li\\u003e\\u003c\/")

    let rdoBody1 = rdoBody[0].split("\"html\":\"\\u003cul\\u003e\\u003cli\\u003e \\u003cb\\u003e")

    let rdoMonthBody = args[4].split("\\u003c\/li\\u003e\\u003c\/")

    let rdoMonthBody1 = rdoMonthBody[0].split("{\"html\":\"\\u003cul\\u003e\\u003cli\\u003e \\u003cb\\u003e")

  let rdoDate = args[3].split("\\u003c\/span\\") //Gets the Date



  if (message.content.toLowerCase().startsWith(prefix + "rdo")) {

  
    message.channel.send({embed: {
            color: 0xB75AFF, //Purple
            title: `Red Dead Online ${rdoDate[0]}`,
            description: `${rdoBody1[1]}\n\n**Monthly Bonuses:**\n${rdoMonthBody1[1]} \n[Click Here for more info](https://www.ign.com/wikis/red-dead-redemption-2/Red_Dead_Online_Updates_Archive)`
            .replace(/\\u0026#x2019;/g , "'")
            .replace(/\\u003c\/b\\u003e\\u003cbr\\u003e/g, "\n")
            .replace(/\\u003cbr\\u003e/g, "\n")
            .replace(/\\u003c\/li\\u003e\\n\\u003cli\\u003e \\u003cb\\u003e/g, "\n\n")
            .replace(/\\u0026#x2018;/g, "'")

                                    
                        
                        
                        
                        
                        }})
    
    



  }}}
          

