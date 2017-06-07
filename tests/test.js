'use strict'

var fs = require("fs");
var archiver = require("archiver");
var archive = archiver("zip");

function main() {

	// creates a writable stream 
	var output = fs.createWriteStream("./output.zip");

	output.on("close", function() {

		console.log(archive.pointer() + " total bytes");
		console.log("Archiver has been finalized and the output file descriptor has been closed")

	});

	archive.on("error", function(err) {
		throw err;
	})

	// pipes the streamed data of zip file into the writeable stream aliased by ouput variable
	archive.pipe(output);

	archive.directory("testfolder");
	archive.file("10");

	archive.finalize();

}

if (!module.parent) {
	main();
}