'use strict';

// literelly mimics the file system, except that it only contains file information
// rather then the actual file contents

var FileInfo = require("./FileInfo.js");

class FSTree {
	// basic idea is to have nested single key value pair where a key is a string
	// containing the folder name and a value is an array containing the folder file
	// system structure
	constructor() {
		this.root = {"ROOT": []};
	}

	// inserts a file object to the tree structure
	insertFile(fileObj) {
		var cwd = this.traverse(this.root["ROOT"], fileObj.path.slice(2));
		cwd.push(fileObj);

	}
	// cwd is the current folder, path are the more folders you
	// need to traverse
	traverse(cwd, path) {
		// if path is an empty string we are done! no more folders to traverse
		if (path === "") {
			return cwd;
		}

		var nextFolder = ""; // will be containing the folder to cd in 
		var index = 0; // index to traverse the path string

		// we traverse till we hit the first forward slash ("/")
		while (path[index] !== "/") {
			nextFolder += path[index++]; // and as we traverse the string we keep adding each letter to the nextFolder which helps us successfully add letters of the folder name
		}

		// now check to see if the folder exists or not, if it doesn't then
		// create it and move on, if it does then cd into it

		// now we loop through the array in search for the folder, it may be there it may not
		// suppose it is there then we cd into it, and by cd into I mean recursively call the function
		// but this time passing in the value of the cwd key
		for (var i = 0; i < cwd.length; ++i) {
			// this if statement checks if the folder already exists or not
			if (cwd[i].constructor !== FileInfo && Object.keys(cwd[i])[0] === nextFolder) {
				// cd into the folder if it already exists and then proceed in the next recursive call
				return this.traverse(cwd[i][nextFolder], path.slice(++index));
			}
		}

		// if the for loop part was crossed it means that we have not found the folder
		// in the current directory/folder

		// then make another folder object and push it onto the the current folder
		var obj = {}
		obj[nextFolder] = []
		cwd.push(obj);

		// slice(index) slice literelly slices of a string array from and including the current index
		
		// and make a recursive call which cds you into the newly pushed folder
		return this.traverse(cwd[cwd.length - 1][nextFolder], path.slice(++index));

	}



	// creates a folder partition in the file structure
	insertFolder(folderName) {



	}

	// removes a file object from the tree
	removeFile(fileObj) {


	}

	// removes all the file objects contained within a folder scope
	removeFolder(folderName) {



	}

	// finds the given file query
	query(fileObj) {




	}

	// lists the contents of the entire file system
	ls() {



	}


}

// main to test the tree implementation
function main() {

	var tree = new FSTree();

	var file = {};
	file.path = "./blah/" // dot will be included remove later

	tree.insertFile(file);
	console.log(tree.root);
	file.path = "./blah/moreblahs/";
	tree.insertFile(file);
	console.log(tree.root);


}

if (!module.parent) {
	main();
}


module.exports = FSTree;