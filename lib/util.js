const moment = require("moment");

{ // logging
	function debug(text) {
		console.log(moment().format("hh:mm:ss") + " ⮊  " + text);
	}

	function log(text) {
		console.log(moment().format("hh:mm:ss") + " →  " + text + " ");
	}

	function warning(text) {
		console.log(moment().format("hh:mm:ss") + " \033[33;1m→  " + text + " \033[m");
	}

	function error(text) {
		console.log(moment().format("hh:mm:ss") + " \033[31;1m→  " + text + " \033[m");
	}
}

function formatSecs(secs) {
	// get
	let days = Math.floor(secs / 86400);
	let hours = Math.floor((secs % 86400) / 3600);
	let minutes = Math.floor(((secs % 86400) % 3600) / 60);
	let seconds = ((secs % 86400) % 3600) % 60;

	// wide
	days = days.toString().length == 1 ? "0" + days : days;
	hours = hours.toString().length == 1 ? "0" + hours : hours;
	minutes = minutes.toString().length == 1 ? "0" + minutes : minutes;
	seconds = seconds.toString().length == 1 ? "0" + seconds : seconds;

	// format
	return `${days}:${hours}:${minutes}:${seconds}`;
}

function escapeRegex(text) {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = exports = {
	debug: debug,
	log: log,
	warn: warning,
	err: error,
	formatSecs: formatSecs,
	escapeRegex: escapeRegex,
}
