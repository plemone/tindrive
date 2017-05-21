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



	}
	
}