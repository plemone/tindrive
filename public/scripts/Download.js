'use strict' // ES6 syntax explicitly

class Download extends UtilityButton {

	constructor(route) {
		super("download"); // constructs the super class or base class very important, this is the base class initializer syntax
		this.contents = []; // contains the contents that need to be downloaded
		this.route = route; // contains the route with which the ajax request is going to be made
		this.functions = [function(self) { // self needs to be passed as a parameter and the base class will provide the keyword "this" so that base class's ids and contents can be accessed when this function is invoked inside the base class
			//this attribute stores a list of functions that gets fired upon object creation, this.functions essentially creates an array of functions
			$(self.id).on("click", function() { // adds anonymous function to the array of functions
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
