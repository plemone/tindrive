// Author: Md. Tanvir Islam

'use strict'; // to avoid unpredictable nature of javascript

var fs = require("fs"); // used to manipulate the file system
var FSTree = require("./FSTree.js"); // dot slash is very important when importing files created by self
var FileInfo = require("./FileInfo.js"); // required to create FileInfo objects when uploading a file
var FolderInfo = require("./FolderInfo.js"); // required to create FolderInfo objects when uploading a folder

// This class will provide a foundation for the REST API.

// This class has a 1-1 composition relationshi with the FSTree datastructure, and provides an abstraction to how
// the FSTree data structure is used in the file. This class is basically the abstract file system of a user that the server keeps

class FileSystem {
	constructor(username, path) {
		// NEVER DO THIS
		// this.self = this; // recursive call, CONTAINS A REFERENCE TO SELF WHICH IN TURN CONTAINS A REFERENCE TO SELF AND SO ON AND ON
		this.username = username; // the username of the collection in the TinDriveFS
		this.path = path + username + "/"; // the path for which the file system exists
		this.tree = new FSTree(this.path); // contains a composition relationship with the FSTree which is a collection class holding file system informations
										  // the path that needs to be provieded to FSTree must be the path to the users unique directory which is the ROOT for the user
	}

	// both fileObj and folderObj contains objects sent from the client side which we
	// need to turn into server side FileInfo and FolderInfo objects

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
		// folderObj.path contains the path to the current working directory that the folder object will exist in
		// we do folderObj.path + folderObj.name to specify the actual directory that the fs module needs to create
		fs.mkdir(folderObj.path + folderObj.name, function(err) {
			if (err) console.log("Error in creating the folder requested...");
			else {
				// create the FolderInfo object from folderObj object provided through the param
				folderObj = new FolderInfo(folderObj.name, folderObj.path);

				// folder creation successful
				console.log("Folder named " + folderObj.name + " successfully created...");

				// insert to the the tree of the user's file system
				return self.tree.insertFolder(folderObj); // returns false upon failure and upon success returns the array representing the directory
				
				// all done :)
			}
		});

	}

	// Combine trashFile and trashFolder methods into one method called trash, which checks for
	// either file or folder before calling the tree object's trashFile or trashFolder method
	// which finds the folder or file and sets the trashed boolean property of the file or folder 
	// in the tree to true
	// takes in a file/folder obj as a parameter
	trash(obj) {
		// trashes a file or folder using the path (remember the path of a file or folder will always lead to the folder containing the file or folder) 
		// name provided and calls in the FSTree's trashFile/trashFolder method - check FSTree's method for more detail
		if (obj.type === "folder") { // check if the object is a folder
			return this.tree.trashFolder(obj); // this.tree.trashFolder(obj) will either return false or return the trashed object
		} else { // if its not a folder then its a file
			return this.tree.trashFile(obj); // this.tree.trashFile(obj) will either return false or return the trashed object
		}
	}

	// Combine untrashFile and untrashFolder methods into one method called untrash, which checks for
	// either file or folder before calling the tree object's untrashFile or untrashFolder method
	// which finds the folder or file and sets the trashed boolean property of the file or folder 
	// in the tree to fakse
	// takes in a file/folder obj as a parameter
	untrash(obj) {
		// untrashes a file or folder using the path (remember the path of a file or folder will always lead to the folder containing the file or folder) 
		// name provided and calls in the FSTree's untrashFile/untrashFolder method - check FSTree's method for more detail
		if (obj.type === "folder") { // check if the object is a folder
			return this.tree.untrashFolder(obj); // this.tree.untrashFolder(obj) will either return false or return the just untrashed object
		} else { // if its not a folder then its a file
			return this.tree.untrashFile(obj); // this.tree.untrashFile(obj) will either return false or return the just untrashed object
		}
	}

	// A wrapper function that lists the directory of the contents of a given path, file clicks on the client
	// will never event get the opportunity to invoke this function don't worry as there are checks in the client side to
	// prevent that, that being said, this function will not work on path that leads to a file.
	listDirectoryContents(path) {
		return this.tree.lsL(path);
	}


	// removes a file with a specific path given from the file system also updates the FSTree
	removeFile(fileObj) {
		// boolean indicating if an error has taken place, true if error has taken place
		// false if no error has taken place, so by default it is false
		var errorIndicator = false;

		// we now remove the file specified from the server's file system

		// fs.unlinkSync takes the path name which leads to the folder that contains the file + the file name itself
		console.log("File is being removed...");
		fs.unlink(fileObj.path + fileObj.name, function(err) {
			// if we encounter an error we turn the errorIndicator to true
			if (err) {
				console.log("Error in deleting the file specified from the server's file system...");
				errorIndicator = true;
			} else {
				console.log("File successfully removed from the server's file system...");
			}
		});
		// we check the errorIndicator variable for any possible errors that might have occured
		// if its true we return false as there was an error and this ends the function body right there
		// without ever going to this.tree.removeFile(fileObj);
		if (errorIndicator) {
			return false;
		}

		return this.tree.removeFile(fileObj);

	}

	// removes all files in a specific folder from the file system also updates the FSTree
	removeFolder(folderObj) {
		// boolean indicating if an error has taken place, true if error has taken place
		// false if no error has taken place, so by default it is false
		var errorIndicator = false;

		// we now remove the folder from the servers file system
		// NOTE** - When you delete a folder from the servers file system all the contents
		//          inside the folder including files awnd event more nested folders need to be
		//          recursively traversed and deleted.
		// to do this we use a helper function which recursively traverses all the contents of the
		// provided directory and delete all the contents inside recursively by taking the path of the folder
		// plus the folder name itself, we do this because the fs module only deals with path names

		// we now call the helper function which recursively traverses the folder contents, delets each
		// and every file or folder inside it and then delets the folder itself

		this.removeFolderHelper(folderObj.path + folderObj.name);

		// and finally we remove the folderObj from the FSTree itself for the user 
		return this.tree.removeFolder(folderObj);
	}

	// helper function for removeFolder method
	removeFolderHelper(path) {
		// everything in the recursive function needs to be synchronous as asynchronous functions would
		// mess up the order in which they get invoked in recursion

		// we first check if the path provided is a file or folder
		if (fs.statSync(path).isFile()) {
			// if it is a file we simply delete the file
			// fs.unlinkSync takes the path name which leads to the folder that contains the file + the file name itself
			console.log("File is being removed...");
			fs.unlinkSync(path);
		} else {
			// If its a folder then we ls the folder and put all its contents in an array
			// using that array we use a for loop to traverse the array and each element
			// in the index will be cded into using recursion by joining the current pathname
			// and file/folder name. The function will check again if the path is a file or folder
			// if it is then it gets deleted, if not then the steps repeat again and again

			// we read the contents of the directory synchronously if its a folder and store it in an array
			var contents = fs.readdirSync(path);

			// we traverse the array of contents that we got and as we are traversing each element we make a recursive
			// call on each element in the array, and each content (or the path which leads to either a folder or file) 
			// will go through all the same steps that this object has gone through file or folder doesn't matter the 
			// content will be dealt accordint to whatever it is in the function
			for (var i = 0; i < contents.length; ++i) {

				// we make the recursive call by passing the new path to an file or folder by attaching the current
				// path to the directory we are in plus the content in the directory content
				this.removeFolderHelper(path + "/" + contents[i]);
				// NOTE** - We don't return with the expression above as we are expanding the stack when we make 
				//          the recursive call and waiting for the stack to collapse and the loop will go over its
				//          next iteration. 

				// the for loop itself expands the stack as it is waiting for more iterations to be completed

				// the for loop itself expands the stack as more instructions are pending after the recursive call
				// or more iterations are pending after each recursive call unless you are in the last iteration of the for loop

			}

			// after expanding and collapsing of the stack on each recursive call we have successfully
			// removed all the contents inside the folder so now we delete the folder itself
			console.log("Folder is being removed...");
			fs.rmdirSync(path);
		}


	} 

	// returns the ls -l array of the directory of the file system
	getDirectoryEnvironment(path) {
		return tree.lsL(path);
	}

}

module.exports = FileSystem; // exporting the class for other files to import

