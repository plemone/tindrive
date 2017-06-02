'use strict' // ES6 syntax explicitly

class Download extends UtilityButton {

	constructor(route) {
		super("download", route); // constructs the super class or base class very important, this is the base class initializer syntax
		this.functions = [function(self) { // self needs to be passed as a parameter and the base class will provide the keyword "this" so that base class's ids and contents can be accessed when this function is invoked inside the base class
			//this attribute stores a list of functions that gets fired upon object creation, this.functions essentially creates an array of functions
			// you can't provide $(self.id).on("click", function(self) {}); with self here because the .on
			// call back function actually provides a argument to its call back which is an event object
			// so us providing self would just alias the event object with "self"
			$(self.id).on("click", function() { // adds anonymous function to the array of functions
				for (var i = 0; i < self.contents.length; ++i) {
					console.log(self.contents[i]);
				}
			});
		}];
	}
}
