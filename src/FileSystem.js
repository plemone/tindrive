// Author: Md. Tanvir Islam

'use strict'; // to avoid unpredictable nature of javascript

// dependencies
var MongoClient = require("mongodb").MongoClient;

/*
	The goal is to use a different Database than TinDrive, where it will contain
	the entire file systems of a user. It will have different collection names
	depending on the user name, and each collection will have objects containing
	the entire file system.

	The game plan is to have each collection named after the users unique id
*/

// This class will provide a foundation for the REST API

class FileSystem {
	constructor(username) {
		this.DB = "mongodb://localhost:27017/TinDriveFS";
		this.username = username; // the username of the collection in the TinDriveFS
	}


	// build nice and proper member functions to add the JSON files representing your files

	// the collection itself will be the root folder, inside the root folder you can
	// insert file objects, or you can insert folder objects which intern will contain more files

	upload(fsObj) {
		// fsObj can either be a file, or it can be a folder

		if (fsObj.type !== "") {
			// we are dealing with a file! if it is not an empty string
			this.uploadFile(fsObj);

		} else {

			// we are dealing with a folder :(


		}

	}

	uploadFile(fileObj) {
		var self = this;
		MongoClient.connect(this.DB, function(err, db) {
			if (err) console.log("Failed to connect to TinDriveFS database...");
			else {
				db.collection(self.username).insert(fileObj, function(err, doc) {
					if (err) console.log("Error in adding files to file system");
					else {
						db.close(); // ALWAYS CLOSE YOUR DATABASE TO SAVE CHANGES 
									// THIS is specially important when you are adding or removing
						console.log("File successfully added to file system");
					}
				});
			}
		});
	}


	uploadFolder(folderObj) {
		// folder objects don't exist so we have to create one ourselves




	}



}

module.exports = FileSystem; // exporting the class for other files to import