'use strict'

var fs = require("fs");

// everything in the recursive function needs to be synchronous as asynchronous functions would
// mess up the order in which they get invoked in recursion
function removeFolder(path) {
	
	// we first check if the path provided is a file or a folder	
	if (fs.statSync(path).isFile()) {
		// if it is a file we simply delete the file
		console.log("removed file...");
		fs.unlinkSync(path);
	} else {
		// If its a folder then we ls the folder and put all its contents in an array
		// using that array we use a for loop to traverse the array and each element
		// in the index will be cded into using recursion by joining the current pathname
		// and file/folder name. The function will check again if the path is a file or folder
		// if it is then it gets deleted, if not then the steps repeat again and again
		var files = fs.readdirSync(path);
		for (var i = 0; i < files.length; ++i) {
			// this recursive call expands the stack
			removeFolder(path + "/" + files[i]);

			// the for loop itself expands the stack as more instructions are pending after the recursive call
			// or more iterations are pending after each recursive call unless you are in the last iteration of the for loop
		}

		// after expanding and collapsing of the stack on each recursive call we have successfully
		// removed all the contents inside the folder so now we delete the folder itself
		fs.rmdirSync(path);
	}
}


function main() {

	removeFolder("./New Folder")

}

if (!module.parent) {
	main();
}