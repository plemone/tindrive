'use strict';

// ISSUE - FIX THE FSTREE, travers() SHOULD NOT BE RESPONSIBLE FOR CREATING FOLDER OBJECTS!!!


// literelly mimics the file system, except that it only contains file information
// rather then the actual file contents

// As files get uploaded, this data structure also gets populated and the way the files get stored
// mimics the the exact same direction/path/route that the file system takes
// when the user is requesting a file to download or is cding into a new folder, the file needs to be found or
// the directory contents needs to be listed, its all done using the FSTree.

// Lists the contents of a specific directory.
// It can retrieve the file information for a file to be downloaded.
// It stores away files with exact same architecture of the file system, so that files can be looked up here
// rather than going through the entire file system.

// If a folder is deleted then the value of a key, where each key is the folder name and value is an array representing
// the folder's contents will contain a boolean false in the end indicating that the whole folder is suppose to be in the
// trash directory. 

var FileInfo = require("./FileInfo.js"); // needed to check element type 
var FolderInfo = require("./FolderInfo.js"); // needed to check element type

class FSTree {
	// basic idea is to have nested single key value pair where a key is a string
	// containing the folder name and a value is an array containing the folder file
	// system structure
	constructor(path) {
		// we make the root directory folder which will always start at "./" and will contain the name "ROOT"
		this.root = new FolderInfo("ROOT", "./");
		this.initTree(path);
	}

	// responsible for taking the base path and creating the files needed to mimic the fs tree
	// as the fs tree will always follow the same spefic path to insert folders and files
	// for example every file will follow something like ./filesystems/user-fs/username/
	// so these folders need to exist to be traversed!
	initTree(path) {
		// preExistingFolders contain the folders that were already there in the users file system
		var preExistingFolders = [];

		// We remove the the ./ as we don't really need them as our algorithm starts extracting
		// each word and assins them into a string until it encounters a "/". This allows us to 
		// successfully get folder names from a large path. Therefore including ./ would make a folder
		// called .
		path = path.slice(2);

		// using the path we extract the folders using the path string and store them in an array called preExistingFolders
		var i = 0;
		var folderName = "";
		// we include the "./" in the newPath as we removed the "./" from the path earlier, 
		// and "./" is path of the root which is the root that the first folder will be in
		var newPath = "./";

		// we loop till i reaches the length of the path
		while (i !== path.length) {
			// when we hit "/" we add the folderName to the array of folders and add it array of folders 
			if (path[i] === "/") {
				// we create the folder object that we are going to add to the FSTree
				var folderObject = new FolderInfo(folderName, newPath);
				
				// add the folder object to the array
				this.insertFolder(folderObject);

				// each folder will have their own unique path, so the newPath is the variable which will hold each each folders unique path
				// newPath's string will get extended with the current folder's name plus a backslash because the next folder will be inside the previous folder
				newPath += folderObject.name + "/"; 

				// reset the folderName to extract another folder name in the path after the "/"
				folderName = "";
				
				// we increment the i and skip anything below this if statement inside the while loop
				++i;
				continue;
			}

			// we add every word in the path to the folderName string until we encounter a "/"
			folderName += path[i];

			// increment the i to proceed the loop
			++i;
		}
	}

	// cwd is the current folder, path are the more folders you need to traverse,
	traverse(cwd, path) {
		/*
			NOTE** - cwd is a reference pointer to the specific array inside the nested object
			         in the data structure, modifying cwd will modify the specific parts of the FSTree directly
			         reassigning cwd will change the pointer of cwd to point to something else!
		*/

		// if path is an empty string we are done! no more folders to traverse
		if (path === "") {
			return cwd;
		}

		// will be containing the folder to cd in 
		var nextFolder = ""; 
		// index to traverse the path string
		var index = 0;

		// we traverse till we hit the first forward slash ("/")
		while (path[index] !== "/") {
			// and as we traverse the string we keep adding each letter to the nextFolder which helps us successfully add letters of the folder name			
			nextFolder += path[index++];
		}

		// now check to see if the folder exists or not, if it doesn't then
		// create it and move on, if it does then cd into it

		// now we loop through the array in search for the folder, it may be there it may not
		// suppose it is there then we cd into it, and by cd into I mean recursively call the function
		// but this time passing in the value of the cwd key
		for (var i = 0; i < cwd.length; ++i) {
			// this if statement checks if the folder already exists or not
			if (cwd[i].constructor !== FileInfo && cwd[i].name === nextFolder) {
				// cd into the folder if it already exists and then proceed in the next recursive call
				return this.traverse(cwd[i].directory, path.slice(++index), true);
			}
		}

		// If we passed all the code above this line it means we haven't found the correct folder name with which
		// we can cd into and since we cannot find the correct folder we simply return false. Reasons that we might
		// end up returning false would be because the sequence of folder that the path asks us to follow doesn't exist.
		return false;

	}

	// inserts a file object to the tree structure
	insertFile(fileObj) {
		var cwd = this.traverse(this.root.directory, fileObj.path.slice(2), true);
		if (!cwd) { // if cwd is false we end the function as we cannot treat boolean like an array
			return cwd;
		}
		// Insert the file to the directory, don't worry making changes to this cwd will directly change the value in the FSTree object itself
		// because of the object being globally scoped within the class and all these functions has direct access to them.
		cwd.push(fileObj);
		return cwd;
	}

	// creates a folder in the directory specified in the path attribute of the folderObj provided through the parameter
	insertFolder(folderObj) {
		// store the array represents the folder directory of the given path and store it in the variable cwd
		var cwd = this.traverse(this.root.directory, folderObj.path.slice(2), true);

		if (!cwd) { // if cwd is false we end the function as we cannot treat a boolean like an array
			return cwd;
		}
		// Insert the folder to the directory, don't worry making changes to this cwd will directly change the value in the FSTree object itself
		// because of the object being globally scoped within the class and all these functions has direct access to them.		
		cwd.push(folderObj);
		return cwd;
	}

	// using the path name from the folder object attribute provided through the parameter traverses 
	// the FSTRee and get the directory of the where the folder is contained then identify the folder from the
	// directory using a for loop and checking with the name attribute from the folder object.
	trashFolder(folderObj) {
		// traversing the file system will automatically create the path as the flag is set to true
		// so adding it again would make no sense, path string contains the details of the folders that
		// are being added, so when the flag is set to false, we don't create the path automatically
		var cwd = this.traverse(this.root.directory, folderObj.path.slice(2), true);

		// loop over the folder container array and look for the folder by the name of the folderObj
		// thats the folder we have to turn the flag on
		for (var i = 0; i < cwd.length; ++i) {

			// we gotta make sure with an if statement that the element in the array is not a file, if its not a file its a folder
			// then we simply check the name of the folder with the folder object provided
			if (cwd[i].constructor !== FileInfo && cwd[i].name === folderObj.name) { // Object.keys() is a built in JavaScript which returns all the keys that an object has all contianed in an array
				// since we know that our object has only one key/value pair where the key is the folder and value is the array
				// containing the contents in the folder, the first index of the returned array of keys is the name of the folder

				// when we find the object we are looking for we add another attribute to the object
				cwd[i].trashed = true;
				return cwd[i]; // when we find the folder and turn the trashed to true we simply returning ending the function right there
			}
		}
		return false; // if we reached this part of the code it means that we haven't found our object and we simply return false
	}

	// using the path provided from the file object attribute traverses the FSTree and gets the directory and from 
	// the directory extracts the file using the file objects name attribute 
	// and then turns the trash flag on for the file indicating that it is trashed.
	trashFile(fileObj) {

		var cwd = this.traverse(this.root.directory, fileObj.path.slice(2), true);

		for (var i = 0; i < cwd.length; ++i) {

			// if the element in the containing folder array is a file and the name of the file matches the name of the file object
			// then we proceed to turning the boolean of the trashed attribute of the file object to true
			if (cwd[i].constructor === FileInfo && cwd[i].name === fileObj.name) {
				// when we find the object we are looking for we set the already existing trashed boolean from false to true
				cwd[i].trashed = true;
				return cwd[i]; // when we find the file and turn the trashed to true we simply returning ending the function right there
			}
		}
		return false; // if we reached this part of the code it means that we haven't found our object and we simply return false
	}

	// removes a file object from the tree
	removeFile(fileObj) {
		// similar to insertFile method where we simply return the array where we are going to insert
		var cwd = this.traverse(this.root.directory, fileObj.path.slice(2), false);
		// checks to see if cwd exists and is not false
		if (cwd) {
			for (var i = 0; i < cwd.length; ++i) {
				// if the element is of type FileInfo, only delete the file
				if (cwd[i].constructor === FileInfo && cwd[i].name === fileObj.name) {

					// slice and splice are identical in a sense where both of them return an
					// array of the elements targeted, except splice modifies the original array, when
					// the method is invoked and slice does not
					cwd.splice(i, 1);
					return true;
				}
			}
		}
		// if all fails then cwd will be false because traverse would return false
		// and traverse return value gets stored in as cwd
		return cwd;
	}

	// removes all the file objects contained within a folder scope
	removeFolder(folderObj) {
		// similar to insertFile method where we simply return the array where we are going to insert
		var cwd = this.traverse(this.root.directory, folderObj.path.slice(2), false);
		// if cwd doesn't return false 
		if (cwd) {
			for (var i = 0; i < cwd.length; ++i) {
				// NOTE** - the folders are not objects in the FSTree, only files are objects in FSTree and
				// files are contained in an array which is a value of a single key in each dictionary.
				// The dictionary itself in a sense can be treated as a folder, as it contains only one element
				// and the first key of the dictionary is the name of the folder

				// Object.keys(cwd[i]) returns an array of all the keys of a dictionary in Javascript
				// since each folder has only one key/value pair, the first index of the array will be the key
				// which is the name of our folder!
				if (cwd[i].constructor !== FileInfo && cwd[i].name === folderObj.name) {
					// similarly we splice again, when we find the folder
					cwd.splice(i, 1);
					return true;
				}
			}
		}
		// else we simply return cwd which is false if we have reached this stage at this function
		return cwd;
	}

	// list the files or folders of the current working directory
	lsL(path) {
		var cwd = this.traverse(this.root.directory, path.slice(2), false);
		if (!cwd) {
			return cwd; // traverse will return false so if it does we simply end the function here
		}

		var contents = [];
		// simply loop over and put the contents of the folder in an array
		// if it is a file then type is file, else it is a folder string
		// the contents get returned as a string which can be send to the client
		// side to populate the icons on start up or everytime a folder is clicked
		// which is essentially cding into the folder!

		// This function also does one very important thing, it filters out folders or files
		// that are trashed, this gives back the client side a list of directories to populate
		// where the file or folder they deleted is not there for whatever the situation may be.

		for (var i = 0; i < cwd.length; ++i) {
			var content = {};
			if (cwd[i].trashed !== true) { // checks if the attribute of the object is trashed or not, deosn't matter if its a file or folder, both the object have the same trashed attribute
				if (cwd[i].constructor === FileInfo) {
					content.name = cwd[i].name;
					content.type = "file";
				} else {
					// name of the content if it is not a FileInfo object is simply the key of the first dictionary key/value pair
					content.name = cwd[i].name;
					content.type = "folder";
				}
				contents.push(content);
			}
		}

		return contents;
	}


	// lists the contents of the entire file system
	// this is mostly for debugging purposes only
	lsR() {
		// pass in the empty string to recurseToString where you keep shoving everything in
		var outStr = this.rToString("", this.root.directory, "", 0);
		console.log(outStr);
	}

	// we use cwd to traverse by recursively calling the function
	// in a for loop as we traverse the folder contents, if a content is
	// a folder we use recursion to cd into that folder
	rToString(outStr, cwd, spaces, iter) {
		if (iter !== 0) {
			for (var i = 0; i < 4; ++i) {
				spaces += " ";
			}
		}

		// base case hits when folder is empty
		if (cwd.length === 0) {
			return outStr;
		}

		// now starting from the current folder recursively traverse everything
		for (var i = 0; i < cwd.length; ++i) {
			if (cwd[i].constructor !== FileInfo) {
				// syntax to get the key of an object, 0th index/first index because the object has only one key and Object.keys() returns an array of keys in an object
				// simple trick is to get the key from the object, and since we only have key value pair, we get the first index of the array
				// then simply using the key query the object like this object[key], this returns the value
				// you don't need to do outStr += name, because we want to replace the orginal outStr
				// with the newly added outStr, we don't want to add whatever was before with the new one
				// this keeps adding duplicates on top of each other
				outStr += spaces + "Folder: " + cwd[i].name + "\n";					  // increment the iter so that we increment the space everytime we cd into a folder to have a nice format
																					 //  iter variable needs to be there because we need to make sure that the first folder should not have any spaces
																					//  but as we cd into more and more folders the spaces increase as we are going deeper and deeper
				outStr = this.rToString(outStr, cwd[i].directory, spaces, ++iter);
			} else {
				outStr += spaces + "--> File: " + cwd[i].name + "\n";
			}
		}
		return outStr;
	}
}

function test() {




}

// main to test the tree implementation
function main() {
	test();
}

if (!module.parent) {
	main();
}


module.exports = FSTree;