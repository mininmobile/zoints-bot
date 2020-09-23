require("dotenv").config();
const config = require("./config");
const util = require("./lib/util");

const os = require("os");
const discord = require("discord.js");
const { readFile } = require("fs");
const bot = new discord.Client();

let scope = {
	bot: bot,
}

let commands = {}

bot.on("ready", () => {
	util.log("bot connected");
});

{ // onMessage
	let prefixTest = new RegExp("^(\\s*" + util.escapeRegex(config.prefix) + "\\s*).+");
	let prefixReplace = new RegExp("^\\s*" + util.escapeRegex(config.prefix) + "\\s*");

	bot.on("message", (message) => {
		if (!message.channel.guild)
			return;

		if (message.author.bot) {
			if (message.author.id == bot.user.id) {
				util.debug(message.content);
			}

			return;
		}

		if (!prefixTest.test(message.content))
			return;

		let command = message.content.replace(
			message.content.match(prefixReplace)[0], "")
				.split(/ +/g);

		util.log(`(${message.author.id} -> ${message.guild.name} (${message.guild.id}) ${message.content}`);

		switch (command[0]) {
			case "ping": {
				message.channel.send("Pinging...").then((m) => {
					let t1 = message.createdTimestamp;
					let t2 = m.createdTimestamp;

					setTimeout(() => {
						m.edit(`:ping_pong: ${t2 - t1}ms (${bot.ws.ping}ms)`)
							.catch(util.err);
					}, 10);
				}).catch(util.err);
			} break;

			case "status": {
				let memUsed = Math.round(process.memoryUsage().rss / Math.pow(1024, 2));
				let memTotal = Math.round(os.totalmem / Math.pow(1024, 2));
				let memPercent = Math.round((memUsed / memTotal) * 100);

				let lines = [
					`**Memory** ${memUsed}mb/${memTotal}mb (${memPercent}%)`,
					`**Node Version** ${process.version}`,
					`**Discord.js Version** v${discord.version}`,
					`**Uptime** ${util.formatSecs(Math.floor(bot.uptime/1000))}`,
				]

				let embed = new discord.MessageEmbed()
					.setTitle("Statistics")
					.setDescription(lines.join("\n"))
					.setFooter(bot.user.username, bot.user.avatarURL);

				message.channel.send(embed).catch(util.err);
			} break;

			default: {
				if (commands[command[0]]) {
					commands[command[0]](message, scope, util);
				}
			}
		}
	});
}

util.debug("waiting to start bot...");
setTimeout(() => {
	util.debug("loading commands...");
	util.readdir("commands").then((data) => {
		data.forEach((f) => {
			let module = require("./commands/" + f);

			module.emit("init", [scope, util]);

			module.commands.forEach(c => commands[c] = module.callbacks[c]);

			util.log("registered module: " + f);
		});
	}).then(() => {
		util.debug("starting bot...");
		bot.login(process.env.TOKEN);
	}).catch(util.err);
}, 5000);
