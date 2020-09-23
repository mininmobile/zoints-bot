const events = require("events");
const discord = require("discord.js");

/**
 * @callback messageCallback
 * @param {discord.Message} m
 * @param {Object} scope
 * @param {Object} util
 */

class Command extends events.EventEmitter {
	constructor() {
		super();
		this.commands = [];
		this.callbacks = {};
	}

	/**
	 * @param {string} name
	 * @param {messageCallback} callback
	 */
	register(name, callback) {
		name.split(",").forEach((n) => {
			this.commands.push(n);
			this.callbacks[n] = callback;
		});
	}
}

module.exports = Command;
