'use strict'; // provides strict rules to what should be done and what shouldn't be 
// this simply allows class expressions to be used in javascript

class IdGenerator {
	// implement this function in another file later for modularity
	generateId(name) {
		var newName = "";
		for (var i = 0; i < name.length; ++i) {
			newName += name.charCodeAt(i);
			newName += Math.round(Math.random() * 10); // generates a random number between 0 and 10 and rounds it
		}
		return newName
	}
}

module.exports = IdGenerator; // syntax to allow a module to be exported