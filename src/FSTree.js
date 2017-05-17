'use strict';

// literelly mimics the file system, except that it only contains file information
// rather then the actual file contents

var FileInfo = require("./File.js");

class FSTree {
	// basic idea is to have nested single key value pair where a key is a string
	// containing the folder name and a value is an array containing the folder file
	// system structure
	constructor() {
		this.root = {"ROOT": []};
	}

	// inserts a file object to the tree structure
	insertFile(fileObj) {



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



}

if (!module.parent) {
	main();
}


module.exports = FSTree;