const command = require("../lib/command");
const test = module.exports = new command();

test.register("set", (m, scope, util) => {
	scope.fart = "balls";
	m.channel.send("set `scope.fart` to `\"balls\"`");
});
