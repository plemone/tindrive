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

				// we don't need to bother with anything if the array of selections is empty
				if (self.contents.length === 0) {
					return;
				}

				// the object which will hold the actual data that the server will process
				// encapsulated as an attribute of the object
				var requestObj = {};

				// this is the array of selected folders/files that the client side is asking
				// for to be downloaded
				var selections = [];

				for (var i = 0; i < self.contents.length; ++i) {
					
					// We need to filter out data from the contents that we are going to send
					// so we make a new object and shove only important information into it.
					// We do this because the server doesn't need unecessary informations that
					// the current file/folder representation objects contain
					var filteredContent = {};
					filteredContent.name = self.contents[i].name
					filteredContent.path = self.contents[i].path;
					filteredContent.type = self.contents[i].type;

					// the filted objects will now be stored into the new selections array
					// which are the selections send to the server asking it to send us back
					// actual information data representation of these file/folder information
					selections.push(filteredContent);
				}

				// we assign the client selections to the selections attribute of the requestObj
				requestObj.selections = selections;

				$.ajax({
					url: self.route + "download",
					type: "POST",
					data: requestObj,
					success: function(data) {
						console.log(data);
					}
				})

			});
		}];
	}
}
