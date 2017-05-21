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

		

	}

	shorten() {

		// takes the last index of the visits array and uses the string
		// to reduce this.get which is our path string also changes cwd and pops visits as well!

		var folder = this.visits[this.visits.length - 1]; // grabs last index

		var folderLength = this.folder.length;

		var pathLength = this.get.length;

		// reduction is the index till which we want our this.get index to be
		// for example if you have a word like ilovepizza - size of 10 contains 0-9 indexes
		// and you just want to keep ilove then simply use word.splice(0, 5) which is 9 - 4 = 5
		var reduction = pathLength - folderLength;

		// splices the string and retains words from 0 to reduction
		this.get.splice(0, reduction);

		this.visits.pop();

	}

}
