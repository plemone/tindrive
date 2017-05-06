// Author: Md. Tanvir Islam

'use strict'; // to avoid unpredictable nature of javascript

var fs = require("fs"); // used to manipulate the file system

// This class will provide a foundation for the REST API

class FileSystem {
	constructor(username, path) {
		// NEVER DO THIS
		// this.self = this; // recursive call, CONTAINS A REFERENCE TO SELF WHICH IN TURN CONTAINS A REFERENCE TO SELF AND SO ON AND ON
		this.username = username; // the username of the collection in the TinDriveFS
		this.path = path + username; // the path for which the file system exists
	}


	/* build nice and proper member functions to add the JSON files representing your files */



	// uploads file objects!
	uploadFile(fileObj) {
	



	}

	// creates folder objects and uploads them
	uploadFolder(folderObj) {
		// folder objects don't exist so we have to create one ourselves




	}


}

module.exports = FileSystem; // exporting the class for other files to import