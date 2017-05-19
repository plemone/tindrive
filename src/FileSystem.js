// Author: Md. Tanvir Islam

'use strict'; // to avoid unpredictable nature of javascript

var fs = require("fs"); // used to manipulate the file system
var FSTree = require("./FSTree.js"); // dot slash is very important when importing files created by self

// This class will provide a foundation for the REST API

class FileSystem {
	constructor(username, path) {
		// NEVER DO THIS
		// this.self = this; // recursive call, CONTAINS A REFERENCE TO SELF WHICH IN TURN CONTAINS A REFERENCE TO SELF AND SO ON AND ON
		this.username = username; // the username of the collection in the TinDriveFS
		this.path = path + username; // the path for which the file system exists
		this.tree = new FSTree(); // contains a composition relationship with the FSTree which is a collection class holding file system informations
	}


	/* build nice and proper member functions to add the JSON files representing your files */


	// folders must be created first before file can be inserted
	uploadFile() {


	}

	// folders created
	uploadFolder() {



	}


	// removes a file with a specific path given from the file system also updates the FSTree
	removeFile() {


	}

	// removes all files in a specific folder from the file system also updates the FSTree
	removeFolder() {


	}

}

module.exports = FileSystem; // exporting the class for other files to import