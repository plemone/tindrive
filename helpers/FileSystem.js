// Author: Md. Tanvir Islam

'use strict'; // to avoid unpredictable nature of javascript

var fs = require("fs"); // used to manipulate the file system
var FSTree = require("./FSTree.js"); // dot slash is very important when importing files created by self
var FileInfo = require("./FileInfo.js");

// This class will provide a foundation for the REST API.

// This class has a 1-1 composition relationshi with the FSTree datastructure, and provides an abstraction to how
// the FSTree data structure is used in the file. This class is basically the abstract file system of a user that the server keeps

class FileSystem {
	constructor(username, path) {
		// NEVER DO THIS
		// this.self = this; // recursive call, CONTAINS A REFERENCE TO SELF WHICH IN TURN CONTAINS A REFERENCE TO SELF AND SO ON AND ON
		this.username = username; // the username of the collection in the TinDriveFS
		this.path = path + username + "/"; // the path for which the file system exists
		this.tree = new FSTree(); // contains a composition relationship with the FSTree which is a collection class holding file system informations
	}


	/* build nice and proper member functions to add the JSON files representing your files */


	// folders must be created first before file can be inserted
	uploadFile(fileObj) {

		// We need to create a buffer from the base64 encoded file that we have in the
		// response object's content key's value.

		// to prevent bytes from being screwed up when transfering over networks, you encode
		// the bytes by representing it into characters, same 64 characters are used to encode
		// the byte hence the name base64 and this ensures that the data is uncorrupted in the
		// end of the day

		// this says that convert a base64 string to a byte buffer	
		var buffer = new Buffer(fileObj.contents, "base64");

		// writes the data to file system
		// the reason its fileObj.path + fileObj.name is because the fs module takes in the pathname
		// that is going to save plus the name of the file that it is going to save all in one string,
		// resulting in something like this ./filesystem/user-fs/Tanvir/filename.txt and not just ./filesystem/user-fs/Tanvir/
		fs.writeFile(fileObj.path + fileObj.name, buffer, function(err) {
			if (err) console.log("Error in writing file to operating system's file system...");
			else console.log("File successfully saved..."); 
		});

		// add to the tree
		var file = new FileInfo(fileObj.name, fileObj.lastModified, fileObj.size, fileObj.type, fileObj.path);
		return this.tree.insertFile(file); // returns false upon failure and upon success returns the array representing the directory
	}

	// folders created
	uploadFolder(folderObj) {
		var self = this;
		fs.mkdir(folderObj.path, function(err) {
			if (err) console.log("Error in creating the folder requested...");
			else {
				// folder creation successful
				console.log("Folder named " + folderObj.name + " successfully created...");

				// insert to the the tree of the user's file system
				return self.tree.insertFolder(folderObj); // returns false upon failure and upon success returns the array representing the directory
				
				// all done :)
			}
		});

	}

	// Combine trashFile and trashFolder methods into one method called trash, which checks for
	// either file or folder before calling the FSTree class to find the cwd, which is the current directory
	// and insert the true flag indicating trashed.
	// takes in an file/folder obj as a parameter
	trash(obj) {
		// trashes a file using the path name provided and calls in the FSTree's 
		// trashFile method - check FSTree's method for more detail
		if (obj.type === "folder") { // check if the object is a folder
			return this.tree.trashFolder(obj); // this.tree.trashFolder(obj) will either return false or return the trashed object
		} else { // if its not a folder then its a file
			return this.tree.trashFile(obj); // this.tree.trashFile(obj) will either return false or return the trashed object
		}

	}

	// A wrapper function that lists the directory of the contents of a given path, file clicks on the client
	// will never event get the opportunity to invoke this function don't worry as there are checks in the client side to
	// prevent that, that being said, this function will not work on path that leads to a file.
	listDirectoryContents(path) {
		return this.tree.lsL(path);
	}


	// removes a file with a specific path given from the file system also updates the FSTree
	removeFile() {


	}

	// removes all files in a specific folder from the file system also updates the FSTree
	removeFolder() {


	} 

	// returns the ls -l array of the directory of the file system
	getDirectoryEnvironment(path) {
		return tree.lsL(path);
	}

}

module.exports = FileSystem; // exporting the class for other files to import

