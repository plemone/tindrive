'use strict';

var fs = require("fs");
var FileSystem = require("./FileSystem.js");
var FileInfo = require("./FileInfo.js"); // to create file objects when generating user's file system upon server start
var FolderInfo = require("./FolderInfo.js"); // to create folder objects when generating user's file system upon server start
var mime = require("mime");

// This database self generates automatically everytime the server is launched!

// also the benefit of this is when the client side user interface which is the browser
// asks for a specific file environment to mimic we can simply use this database to look up
// and retrieve the information as needed!

// This class ia gateway to more complicated classes in the file system, also known as a Facade class following the structural
// design pattern. This class contains an collection of all the user's individual FileSystem objects. As new users come in
// the new FileSystems get added to the collections. Also when the server is first booted this database traverses the entire
// file system and populates each users FSTree, using each user's FileSystem class.

// Comes in with methods like add, which adds a new user to the collection, retrieve, which retrieves a user's file system
// from the database, generate which generates all the user data on initial boot and traverse, which is a helper function
// used within the class only, it takes in an FileSystem object, a path to follow for file to be added, or a containerFolder
// which is the name of the empty folder that is being requested by the server to be created. If a new file is being requested
// to be added the it is only specified using the path, but for a folder an explicit param called containerFolder needs to be passed.

class Database {

	constructor() {
		this.collection = [];
		// the reason we don't cd out is because our root is actually in app.js and we start locating from our source since app.js includes everything
		this.root = "./filesystems/user-fs/"; // the full path is necessary for the built in fs module
									 // to do its work, and that's why we don't just start from the
									 // username's folder as home
	}

	// adds a collection to user database upon a fresh registration
	add(username) {
		var fileSystem = new FileSystem(username, this.root);
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
	// trashDirectories is an array of trashDirectory mongodb objects with an attribute name and trashedDir
	generate(trashDirectories) {
		var self = this;
		// reads the contents in a directory and returns an array of all the conents
		// of the directory
		fs.readdir(this.root, function(err, files) {
			if (err) console.log("Error in reading contents of the directory...");
			else {
				for (var i = 0; i < files.length; ++i) { 
					// delegates responsibilities to the traverse function
					var fileSystem = new FileSystem(files[i], self.root); // creates each users file system
					// we iterate the array of mongodb documents passed on to the function
					for (var j = 0; j < trashDirectories.length; ++j) {
						// this if statement checks if the name of the element in the trashDirectories array of mongodb object matches the folder name which should be the users name also the name of the users root directory
						if (trashDirectories[j].name === files[i]) {
							// if so then we pass the trashed directory containing folders or files which are trashed to the traverse method which recursively traverses the servers file system for a given user
							self.traverse(fileSystem, fileSystem.path, trashDirectories[j].trashedDir);
							break;
						}
					}
					// we push the file system object to the collection of file systems 
					self.collection.push(fileSystem);
				}
			}
		});

		// for each user, loops over each users folder, generates a FileSystem object
		// for that user and populates the FSTree inside the FileSystem object for that
		// specific user
	}

	// Recursively adds all the contents of all the nested folders in each users fileSystem (helper function).
	// Traverse function will take the file system object, the path to the user's filesystem in the server's 
	// file system and want to insert a folder and finally the array of trash folders trash Directory and files 
	// which gets whos elements get checked up with the file or folder about to be added to the FSTree in the user's file system object.
	traverse(fsObj, path, trashDirectory) {
		console.log("cding... " + path);
		var self = this;

		// NOTE** - reader HAS to be synchronouse, because if it is asynchronous event in a loop
		// it will it will maintain its asynchronous property, which is it will always be the last
		// thing to be executed, even if it is nested away in another function!
		var directoryContents = fs.readdirSync(path);

		for (var i = 0; i < directoryContents.length; ++i) {

			var stats = fs.statSync(path + directoryContents[i]);

			if (stats.isFile()) { // if the element is a file
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

				var fileObj = new FileInfo(directoryContents[i], stats.mtime, stats.size, mime.lookup(directoryContents[i]), path);

				// iterate over the trashDirectory array and check if the fileObj is in it
				for (var j = 0; j < trashDirectory.length; ++j) {

					// we check using the fileObj name attribute and path attribute with the trashDirectory element's name attribute and path attribute
					// if both matches then the fileObj has been trashed
					if (trashDirectory[j].name === fileObj.name && trashDirectory[j].path === fileObj.path) {
						fileObj.trashed = true;
						// we break to prevent loop from progressing further as we have successfully found what we were looking for
						break;
					}

				}

				fsObj.tree.insertFile(fileObj);
			
			} else { // if element is a folder

				// folder object created which gets added to the FSTree
				var folderObj = new FolderInfo(directoryContents[i], path);
				
				// iterate over the trashDirectory array and check if the folderObj is in it
				for (var j = 0; j < trashDirectory.length; ++j) {
					// we check using the folderObj name attribute and path attribute with the trashDirectory element's name attribute and path attribute
					// if both matches then the folderObj has been trashed
					if (trashDirectory[j].name === folderObj.name && trashDirectory[j].path === folderObj.path) {
						folderObj.trashed = true;
						// we break to prevent loop from progressing further as we have successfully found what we were looking for
						break;
					}
				
				}


				// add the folder object to the FSTree of the user's file system
				fsObj.tree.insertFolder(folderObj);

				// cd into the folder that we just created and scan its contents
				self.traverse(fsObj, path + directoryContents[i] + "/", trashDirectory); // directoryContents[i] is the name of the folder that we are about to cd in 
			}
		}
	}

}


module.exports = Database;