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
			if (err) console.log("Error in reading contents of the directory...");
			else {
				for (var i = 0; i < files.length; ++i) {
					// delegates responsibilities to the generateHelper function
					var fileSystem = new FileSystem(files[i], self.root); // creates each users file system
					self.traverse(fileSystem, fileSystem.path);
					self.collection.push(fileSystem);
				}
			}
		});

		// for each user, loops over each users folder, generates a FileSystem object
		// for that user and populates the FSTree inside the FileSystem object for that
		// specific user
	}

	// recursively adds all the contents of the folder to the fileSystem
	traverse(fsObj, path) {
		fs.readdir(path, function(err, files) {
			if (err) console.log("Error in reading the contents of the directory...");
			else {

				for (var i = 0; i < files.length; ++i) {

					var stats = fs.statSync(path + files[i]);

					if (stats.isFile()) {

						console.log(files[i]);
					
					} else {
						console.log("cding...");
						return this.traverse(fsObj, path + files[i] + "/"); 

					}

				}

			}
		});

	}

}


module.exports = Database;