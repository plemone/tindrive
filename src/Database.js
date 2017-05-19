'use strict';

var fs = require("fs");
var FileSystem = require("./FileSystem.js");
var FileInfo = require("./FileInfo.js");
var mime = require("mime");

// will contain a collection of all the individual users file syste,
// it is more like a Facade class, and it follows structural design pattern
class Database {

	constructor() {
		this.collection = [];
		this.root = "./src/user-fs/";
	}

	// adds a collection to user database upon a fresh registration
	add(username) {
		fileSystem = new FileSystem(req.body.username, this.root);
		this.collection.push(fileSystem);
	}

	// retrieves a user's file system when quried with the username
	retrieve(username) {
		// search for the user's file system by querying with the user name
		for (var i = 0; i < this.collection.length; ++i) {
			if (collection[i].username === username) {
				return collection[i]; // upon finding return the object
			}
		}
		return false; // if user is not found return false simply, easier to error check
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
				for (var i = 0; i < files.length; ++i) 
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

	// recursively adds all the contents of all the nested folders to the fileSystem
	traverse(fsObj, path) {
		console.log("cding... " + path);
		var self = this;

		// NOTE** - readder HAS to be synchronouse, because if it is asynchronous event in a loop
		// it will it will maintain its asynchronous property, which is it will always be the last
		// thing to be executed, even if it is nested away in another function!
		var files = fs.readdirSync(path);

		for (var i = 0; i < files.length; ++i) {

			var stats = fs.statSync(path + files[i]);

			if (stats.isFile()) {
				// Required information
				// this.name = n;
				// this.lastModified = lM;
				// this.size = s;
				// this.type = t;
				// this.path = p;
				// stats contain the following properties for a file
				/*
					{ dev: 2049
					, ino: 305352
					, mode: 16877
					, nlink: 12
					, uid: 1000
					, gid: 1000
					, rdev: 0
					, size: 4096
					, blksize: 4096
					, blocks: 8
					, atime: '2009-06-29T11:11:55Z'
					, mtime: '2009-06-29T11:11:40Z'
					, ctime: '2009-06-29T11:11:40Z' 
					}

				*/
				var file = new FileInfo(files[i], stats.mtime, stats.size, mime.lookup(files[i]), path);
				fsObj.tree.insertFile(file);
			} else {
				// we shouldn't return this as we need to finish
				// the current loop to take care of the rest of the files or folders
				// in the current folder, and not just be done when we find the first
				// folder in the loop
				// visualize the recursion in your head, or draw it out if you get confused, check old notebook
				self.traverse(fsObj, path + files[i] + "/"); 
			}
		}
	}

}


module.exports = Database;