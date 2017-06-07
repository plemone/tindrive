'use strict'

var fs = require("fs");
var archiver = require("archiver");
var archive = archiver("zip");

function main() {

	var output = fs.createWriteStream("./output.zip");

	output.on("close", function() {

		console.log(archive.pointer() + " total bytes");
		console.log("Archiver has been finalized and the output file descriptor has been closed")

	});

	archive.on("error", function(err) {
		throw err;
	})

	archive.pipe(output);

	archive.directory("testfolder", true, { date: new Date() });

	archive.finalize();

}

if (!module.parent) {
	main();
}