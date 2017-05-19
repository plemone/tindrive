'use strict';

var fs = require("fs");
var FileSystem = require("./FileSystem.js");

// will contain a collection of all the individual users file syste,
// it is more like a Facade class, and it follows structural design pattern
class Database {

	constructor() {
		this.collection = [];
		this.root = "./src/user-fs/";
	}

	// adds a collection to user database upon registration
	add(fileSystem) {


	}

	// retrieves a user's file system information upon registration
	retrieve() {


	}

	// loop over all the contents of user-fs folder and populate the trees in 
	// each object inside the collection
	generate() {
		var self = this;
		// reads the contents in a directory and returns an array of all the conents
		// of the directory
		fs.readdir(this.root, function(err, files) {
			for (var i = 0; i < files.length; ++i) {
				// delegates responsibilities to the generateHelper function
				var fileSystem = new FileSystem(files[i], self.root + files[i]); // creates each users file system
				self.generateHelper(fileSystem);
			}
		});

		// for each user, loops over each users folder, generates a FileSystem object
		// for that user and populates the FSTree inside the FileSystem object for that
		// specific user
	}

	// takes in the user's folder and calls a funciton that recursively traverses
	// and adds to the users tree
	generateHelper(fsObj) {



	}

}


module.exports = Database;