'use strict';

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

var FileInfo = require("./FileInfo.js");

class FSTree {
	// basic idea is to have nested single key value pair where a key is a string
	// containing the folder name and a value is an array containing the folder file
	// system structure
	constructor() {
		this.root = {"ROOT": []};
	}

	// cwd is the current folder, path are the more folders you
	// need to traverse, createFolder is a boolean which when turned on, will
	// create folders in a path, if they don't exist
	traverse(cwd, path, createFolder) {
		// NOTE** - cwd is a reference pointer to the specific array inside the nested object
		//          in the data structure, modifying cwd will modify the specific parts of the FSTree directly
		//          reassigning cwd will change the pointer of cwd to point to something else!

		// if path is an empty string we are done! no more folders to traverse
		if (path === "") {
			return cwd;
		}

		var nextFolder = ""; // will be containing the folder to cd in 
		var index = 0; // index to traverse the path string

		// we traverse till we hit the first forward slash ("/")
		while (path[index] !== "/") {
			nextFolder += path[index++]; // and as we traverse the string we keep adding each letter to the nextFolder which helps us successfully add letters of the folder name
		}

		// now check to see if the folder exists or not, if it doesn't then
		// create it and move on, if it does then cd into it

		// now we loop through the array in search for the folder, it may be there it may not
		// suppose it is there then we cd into it, and by cd into I mean recursively call the function
		// but this time passing in the value of the cwd key
		for (var i = 0; i < cwd.length; ++i) {
			// this if statement checks if the folder already exists or not
			if (cwd[i].constructor !== FileInfo && Object.keys(cwd[i])[0] === nextFolder) {
				// cd into the folder if it already exists and then proceed in the next recursive call
				return this.traverse(cwd[i][nextFolder], path.slice(++index), true);
			}
		}

		// if the for loop part was crossed it means that we have not found the folder
		// in the current directory/folder

		// then make another folder object and push it onto the the current folder
		if (createFolder) {
			var obj = {};
			obj[nextFolder] = [];
			cwd.push(obj);

			// slice(index) slice literelly slices of a string array from and including the current index
			
			// and make a recursive call which cds you into the newly pushed folder
			return this.traverse(cwd[cwd.length - 1][nextFolder], path.slice(++index), true);
		}

		return false;

	}

	// inserts a file object to the tree structure
	insertFile(fileObj) {
		var cwd = this.traverse(this.root["ROOT"], fileObj.path.slice(2), true);
		if (!cwd) { // if cwd is false we end the function as we cannot treat boolean like an array
			return cwd;
		}
		cwd.push(fileObj);
		return cwd;
	}

	// creates a folder partition in the file structure
	insertFolder(folderObj) {
		// traversing the file system will automatically create the path as the flag is set to true
		// so adding it again would make no sense, path string contains the details of the folders that
		// are being added, so when the flag is set to true, we automatically create the path
		var cwd = this.traverse(this.root["ROOT"], folderObj.path.slice(2), true);
		return cwd;
	}


	// using the path name from the folder object attribute provided through the parameter traverses 
	// the FSTRee and get the directory of the where the folder is contained then identify the folder from the
	// directory using a for loop and checking with the name attribute from the folder object.
	trashFolder(folderObj) {
		// traversing the file system will automatically create the path as the flag is set to true
		// so adding it again would make no sense, path string contains the details of the folders that
		// are being added, so when the flag is set to false, we don't create the path automatically
		var cwd = this.traverse(this.root["ROOT"], folderObj.path.slice(2), true);

		// loop over the folder container array and look for the folder by the name of the folderObj
		// thats the folder we have to turn the flag on
		for (var i = 0; i < cwd.length; ++i) {

			// we gotta make sure with an if statement that the element in the array is not a file, if its not a file its a folder
			// then we simply check the name of the folder with the folder object provided
			if (cwd[i].constructor !== FileInfo && Object.keys(cwd[i])[0] === folderObj.name) { // Object.keys() is a built in JavaScript which returns all the keys that an object has all contianed in an array
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

		var cwd = this.traverse(this.root["ROOT"], fileObj.path.slice(2), true);

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
		var cwd = this.traverse(this.root["ROOT"], fileObj.path.slice(2), false);
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
		var cwd = this.traverse(this.root["ROOT"], folderObj.path.slice(2), false);
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
				if (cwd[i].constructor !== FileInfo && Object.keys(cwd[i])[0] === folderObj.name) {
					// similarly we splice again, when we find the folder
					cwd.splice(i, 1);
					return true;
				}
			}
		}
		// else we simply return cwd which is false if we have reached this stage at this function
		return cwd;
	}

	// finds the given file query
	query(fileObj) {
		// search should begin from the root therefore cwd = this.root["ROOT"]
		// also always remember to slice the initial path that you use to call the queryHelper
		// as it contains "./" by default and we need to get rid of that
		return this.queryHelper(fileObj.name, this.root["ROOT"], fileObj.path.slice(2));
	}

	queryHelper(name, cwd, path) {
		// base case, that means we are out of path to traverse and have successfully landed
		// in our path, now lets loop through the array of folder contents if we find out file
		// then boom good job! return true, else return false
		if (path === "") {
			for (var i = 0; i < cwd.length; ++i) {
				// we have to make sure the object in the contents is a file before trying
				// to access it
				if (cwd[i].constructor === FileInfo && cwd[i].name === name) {
					return true;
				}
			}
			// if we got out of the for loop it simply means we couldn't find the file
			// in the current directory
			return false;
		}

		var nextFolder = "";
		var index = 0;

		// while we don't hit the backslash extract the letters and put them in the nextFolder variable
		// this variable will be used to cd into the next folder our destination sets!
		while (path[index] != "/") {
			nextFolder += path[index++];
		}


		// now we cd into the folder by looping in the contents inside the folder we are in
		// if we find it then recursively call yourself changing the current directory and the new path!
		// else we simply return false!

		for (var i = 0; i < cwd.length; ++i) {
			if (cwd[i].constructor !== FileInfo && Object.keys(cwd[i])[0] === nextFolder) {
																// ++ because we don't want to include the "/", slice includes the number you slice with
				return this.queryHelper(name, cwd[i][nextFolder], path.slice(++index));
			}
		}

		return false;
	}

	// list the files or folders of the current working directory
	lsL(path) {
		var cwd = this.traverse(this.root["ROOT"], path.slice(2), false);
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
					content.name = Object.keys(cwd[i])[0];
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
		var outStr = this.rToString("", this.root["ROOT"], "", 0);
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
				outStr += spaces + "Folder: " + Object.keys(cwd[i]) + "\n";					  // increment the iter so that we increment the space everytime we cd into a folder to have a nice format
																							 //  iter variable needs to be there because we need to make sure that the first folder should not have any spaces
																							 //  but as we cd into more and more folders the spaces increase as we are going deeper and deeper
				outStr = this.rToString(outStr, cwd[i][Object.keys(cwd[i])[0]], spaces, ++iter);
			} else {
				outStr += spaces + "--> File: " + cwd[i].name + "\n";
			}
		}

		return outStr;
	}

}

function test() {
	var tree = new FSTree();

	var file = new FileInfo("file1", "", "", "", "./blah/");
	tree.insertFile(file);

	var file2 = new FileInfo("file2", "", "", "", "./blah/moreblahs/");
	tree.insertFile(file2);

	var folder = {};
	folder.name = "archive";
	folder.path = "./asdxc/ooo/";

	tree.insertFolder(folder);

	tree.lsR();

	var file3 = new FileInfo("file3", "", "", "", "./blah/asdasd/");

	console.log(tree.query(file3));

	tree.removeFile(file2);

	tree.lsR();

	tree.removeFolder(folder);

	tree.lsR();

	console.log(tree.lsL("./"));
}

// main to test the tree implementation
function main() {
	test();
}

if (!module.parent) {
	main();
}


module.exports = FSTree;