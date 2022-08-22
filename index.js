const fs =  require('node:fs');
const path = require('node:path');
const keep_alive = require('./keep_alive.js')
const { Client, Collection, Intents, MessageEmbed} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: ["CHANNEL"] });
const { exec } = require('node:child_process'); //for the kill 1 command when 429 error is caught.

// node deploy-commands.js
//^^ type in shell to register a command

//Bot rich presence
client.on("ready", () => {
    client.user.setPresence({ activities: [{ name: 'Bonuses', type: 'WATCHING'  }], status: 'idle' });  
});

//Guild Count
client.on("ready", () => {
    const Guilds = client.guilds.cache.map(guild => guild.id);
    console.log(`${Guilds.length} guilds`);
});

//Access Command Files
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//Access Event Files
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));


for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//sends a kill 1 command to the child node if there is a 429 error
client.on("debug", function(info){
		let check429error = info.split(" ");
    	//console.log(`info -> ${check429error}`); //debugger
		if (check429error[2] === `429`) {
			console.log(`Caught a 429 error!`); 
				exec('kill 1', (err, output) => {
				    if (err) {
				        console.error("could not execute command: ", err);
				        return
				    }
				  console.log(`Kill 1 command succeeded`); //probably wont work
				});			
		}
});

//login
client.login(process.env['DISCORD_TOKEN']).catch(err => console.log(err));
