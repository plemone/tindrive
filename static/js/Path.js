'use strict'; // for strict JavaScript syntax

/*
	Keeps track of the current working directory, suppose you are in several nested folders, 
	it will contain the the paths that you took to get there, so that once you make an upload 
	the file which gets uploaded will contain the path name.
	
	The cwd needs to match the cwd of the server, as you are looking up the cwd for the server

*/

class Path {
	constructor() {
		// keeps track of the path, folders gets added on to this
		this.get = "./src/user-fs/" + $("#username").text() + "/";
		// contains the current directory that the user is currently in
		this.cwd = "";
		// everytime you visit a folder it will get added in this array, it will
		// help you keep track of how many hops you have to make to get back to the root directory
		this.visits = [];

	}

	extend(extension) {
		// change cwd to the new folder extension
		this.cwd = extension;
		// add to the array of folder visits
		this.visits.push(extension + "/");
		// extend the path string
		this.get += extension + "/";
	}

	shorten() {
		// takes the last index of the visits array and uses the string
		// to reduce this.get which is our path string also changes cwd and pops visits as well!

		var folder = this.visits[this.visits.length - 1]; // grabs last index

		var folderLength = folder.length;

		var pathLength = this.get.length;

		// reduction is the index till which we want our this.get index to be
		// for example if you have a word like ilovepizza - size of 10 contains 0-9 indexes
		// and you just want to keep ilove then simply use word.splice(0, 5) which is 9 - 4 = 5
		var reduction = pathLength - folderLength;

		// splices the string and retains words from 0 to reduction
		this.get = this.get.slice(0, reduction);

		// as we are switching back to our old directory we need to pop the visits array
		this.visits.pop();

		// if the visit array is empty, then just our current working directory is just an empty string
		// as we are in the root folder
		console.log(this.visits);
		if (this.visits.length === 0) {
			this.cwd = "";
		} else { 
			// else we get the last index of the visits array as the current folder
			// then we eliminate the trailing "/" and change the this.cwd which is the current folder
			// we also need to change the current working directory!
			var currentFolder = this.visits[this.visits.length - 1];
			this.cwd = currentFolder.slice(0, currentFolder.length - 1);
		}

	}

}
