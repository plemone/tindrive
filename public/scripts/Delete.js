'use strict' // to use ES6 syntax explicitly


class Delete extends UtilityButton {

	constructor(route) {
		super("delete", route); // initializes the base class or super class, this is the base class initializer syntax
		this.functions = [function(self) { // self needs to be passed as a parameter and the base class will provide the keyword "this" so that base class's ids and contents can be accessed when this function is invoked inside the base class
			// you can't provide $(self.id).on("click", function(self) {}); with self here because the .on
			// call back function actually provides a argument to its call back which is an event object
			// so us providing self would just alias the event object with "self"
			$(self.id).on("click", function() {

				// We have to send all the requests for files/folders to be deleted with an interval
				// this is because both express server and mongodb is asyncrhonous and this means that 
				// even if the files/folders would get sent in order in a for loop without an interval
				// express would get the request for one file and then dispatch the query to mongodb and then
				// while mongodb returned the document to be updated it started processing the request for another
				// file in the mean time which also asks mongodb to dispatch, this irregularity would update two
				// items first and then complete overrite the changes made to the other one as the doc returned
				// are two different docs from mongodb over time!

				// Thats why we have to send the files/folders with an interval so that express and mongodb, can
				// get time to synchronize the receiving the request. The time will allow one request (one file or folder)
				// to be processed completely before dealing with the next

				// a recursive function which takes i and will keep calling it self until i becomes equal to the self.contents.length
				function sendTrash(i) {
					// base case
					if (i === self.contents.length) {
						return;
					}

					// we also remove the object deleted removed from the DOM immedietly
					$("#wrapper-" + self.contents[i].id).remove(); // we target it by wrapper because wrapper contains both the file icon and the file name!

					// the important information needed for us to do our business is
					// the path and the name of the Icon object, we have to encapsulate the
					// path and the name in an object along with the indicator to whether its
					// a file or not, if its a folder the server should ls everything and turn the
					// flags inside all the files recursively to false!

					// encapsulating information away
					var requestObj = {};
					requestObj.name = self.contents[i].name;
					requestObj.path = self.contents[i].path;
					requestObj.type = self.contents[i].type;

					$.ajax({
						url: self.route + "trash",
						type: "POST",
						data: requestObj
					})

					// increment i to progress the recursion
					++i;

					// makes the recursive call with an interval and the recursive call is the last line in the function 
					// so the function call stack will never get expanded, so this is not an expand and collapse situation
					return setTimeout(function() {
						sendTrash(i);
					}, 20);

				}

				sendTrash(0);

			});
		}];		
	}
}