// Author: Md. Tanvir Islam

'use strict'; // to avoid unpredictable nature of javascript

var fs = require("fs"); // used to manipulate the file system

// This class will provide a foundation for the REST API

class FileSystem {
	constructor(username) {
		this.self = this;
		this.username = username; // the username of the collection in the TinDriveFS
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