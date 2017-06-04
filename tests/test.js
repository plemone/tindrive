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
		}

		// The stacks expand because of this expression, which is asking for the folder in the current working directory
		// to be deleted this path will only be executed only when all the files inside the current directory are recursively deleted
		// as the function call gets extended in deleting the internal files and folder structure of the current working directory
		// and will only collapse after all the internal files and folder of the folder is deleted.
		fs.rmdirSync(path);
	}
}


function main() {

	removeFolder("./New Folder")

}

if (!module.parent) {
	main();
}