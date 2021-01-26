"use strict";

// Next up:
// - Iterate through all log lines, sort into boots
// 



// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

function parseLogEntry(logEntryString) {
	try {
		return JSON.parse(logEntryString);
	}
	catch (e) {
		if (e instanceof SyntaxError) {
			// TODO: It's weird that this would happen.
			// In my sample log, the very last line is missing its closing '}'.
			// I'm not sure why that is.
			return "<invalid JSON>";
		}
		else {
			throw e;
		}
	}
}

async function parseLog(blob) {
	const text = await blob.text();
	// TODO: These can block the rendering thread.
	// Parsing a 133 MB log dump takes about 2 sec in total.
	const unparsedLogEntries = text.split("\n");
	const logEntries = unparsedLogEntries.map(parseLogEntry);
	return logEntries;
}

const fileInput = document.getElementById('file');
fileInput.addEventListener('input', event => {
	// TODO: This should be cancelable somehow.
	console.log("oninput");
	const file = event.target.files[0];
	parseLog(file).then((logEntries) => {
		console.log(logEntries);
	});
});
