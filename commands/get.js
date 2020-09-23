const command = require("../lib/command");
const test = module.exports = new command();

test.register("get", (m, scope, util) => {
	m.channel.send(`\`scope.fart\` is \`"${scope.fart}"\``);
});
