'use strict'; // to avoid unpredictable nature of javascript

// dependencies
var MongoClient = require("mongodb").MongoClient;

/*
	The goal is to use a different Database than TinDrive, where it will contain
	the entire file systems of a user. It will have different collection names
	depending on the user name, and each collection will have objects containing
	the entire file system
*/

// This class will provide a foundation for the REST API

class FileSystem {
	constructor() {
		this.DB = "mongodb://localhost:27017/TinDriveFS";
	}
}

module.exports = FileSystem;