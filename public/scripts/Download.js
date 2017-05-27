'use strict' // ES6 syntax explicitly

class Download extends UtilityButton {

	constructor() {
		super("download");
		this.contents = []; // contains the contents that need to be downloaded
		this.functions = [function() { // this attribute stores a list of functions that gets fired upon object creation, this.functions essentially creates an array of functions
			$(this.id).on("click", function() { // adds anonymous function to the array of functions
				for (var i = 0; i < self.contents.length; ++i) {
					console.log(self.contents[i]);
				}
			});
		}];
	}

	// the following method is a setter for the contents attribute
	add(content) {
		this.contents.push(content); // pushes the content received through the param to the contents array
	}

	remove(content) {
		// loops over the contents array and tries to match content provided with the content in the contents array
		for (var i = 0; i < this.contents.length; ++i) {
			// if content is found then remove
			if (content.name === this.contents[i].name) {
				// splice permanently changes the index
				this.contents.splice(i, 1); // remove elements starting from index i and remove 1 element
				return; // ends the function and breaks out of the loop
			}
		}

	}

	empty() {
		this.contents = [];
	}

}
