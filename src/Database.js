'use strict';

var fs = require("fs");
var FileSystem = require("./FileSystem.js");
var FileInfo = require("./FileInfo.js");
var mime = require("mime");

// This database self generates automatically everytime the server is launched!

// also the benefit of this is when the client side user interface which is the browser
// asks for a specific file environment to mimic we can simply use this database to look up
// and retrieve the information as needed!


// will contain a collection of all the individual users file syste,
// it is more like a Facade class, and it follows structural design pattern
class Database {

	constructor() {
		this.collection = [];
		this.root = "./src/user-fs/"; // the full path is necessary for the built in fs module
									 // to do its work, and that's why we don't just start from the
									 // username's folder as home
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
			if (this.collection[i].username === username) {
				return this.collection[i]; // upon finding return the object
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

	// recursively adds all the contents of all the nested folders to the fileSystem
	traverse(fsObj, path, containerFolder) {
		console.log("cding... " + path);
		var self = this;

		// NOTE** - readder HAS to be synchronouse, because if it is asynchronous event in a loop
		// it will it will maintain its asynchronous property, which is it will always be the last
		// thing to be executed, even if it is nested away in another function!
		var files = fs.readdirSync(path);

		// this will only happen if we have a folder with contents inside, also known as
		// an empty folder, empty folders are still important for users using the device
		// they can make a folder and keep it without putting things inside, and therefore
		// the empty folders should still be added and generated as well!
		// container folder will be undefined at start, if and only if we are at root
		// and the folder is empty, or whenever the has no files to start in the root folder
		// and this traverse function will be called containerFolder will be uninitialized as nothing
		// is passed inside the containerFolder when this function is invoked, hence it is undefined
		if (files.length === 0 && containerFolder !== undefined) {
			var folderObj = {};
			folderObj.name = containerFolder;
			folderObj.path = path;
			fsObj.tree.insertFolder(folderObj);
		}

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
				// sometimes if a directory is simply empty the folder will never get added
				// to the list, so it is important to make sure that the empty folder should
				// be accounted for as well


				// we shouldn't return this as we need to finish
				// the current loop to take care of the rest of the files or folders
				// in the current folder, and not just be done when we find the first
				// folder in the loop
				// visualize the recursion in your head, or draw it out if you get confused, check old notebook
				// files[i] should be a folder in this case
				self.traverse(fsObj, path + files[i] + "/", files[i]); // files[i] is the name of the folder that we are about to cd in 
			}
		}
	}

}


module.exports = Database;