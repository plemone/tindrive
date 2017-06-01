'use strict'; // explicit use of the ES6 syntax


class Trash extends UtilityButton {

	// Trash takes in route which is provided by the class that has a the composition relationship with Trash, this route
	// attribute is used to make ajax requests to send and receive information from the server
	// Trash takes in an event handler which is provided by the class that has the composition relationship with Trash.
	constructor(route, eventHandler) {
		super("trash");
		this.route = route;
		this.functions = [function(self) {
			// the eventHandler function that is provieded through the constructor parameter becomes the
			// function that gets called upon clicking the component 
			// you can't provide $(self.id).on("click", function(self) {}); with self here because the .on
			// call back function actually provides a argument to its call back which is an event object
			// so us providing self would just alias the event object with "self"
			$(self.id).on("click", function() {
				eventHandler(self);
			});
		}];
	}


}