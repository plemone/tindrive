'use strict' // enables ES6 syntax for classes


class Recover extends UtilityButton {

	constructor(route) {
		super("recover", route);
		this.functions = [function(self) {
			// you can't provide $(self.id).on("click", function(self) {}); with self here because the .on
			// call back function actually provides a argument to its call back which is an event object
			// so us providing self would just alias the event object with "self", and would override the
			// self object provided through the function param with the event object
			$(self.id).on("click", function() {

				/*	
					ASYNCHRONOUS FUNCTIONS DOES NOT WORK WITH FOR LOOPS.

					This is because the for loop does not wait for an asynchronous operation to complete before continuing on 
					to the next iteration of the loop and because the async callbacks are called some time in the future. 
					Thus, the loop completes its iterations and THEN the callbacks get called when those async operations finish. 
					As such, the loop index is "done" and sitting at its final value for all the callbacks.

					To solve this problem I am using recursion with a slight interval.
				*/


				// a recursive function which takes i and will keep calling it self until i becomes equal to the self.contents.length
				function trashRecovery(i) {

					if (i === self.contents.length) {
						return;
					}

					// We encapsulate the icon data into an object for the server to deal with. The
					// server needs the path name to find the directory that the file/folder exists in, the
					// type to identify whether to look for a file or folder in the direcctory and most importantly
					// name to identify what name to match in the directory
					var requestObj = {};
					requestObj.name = self.contents[i].name;
					requestObj.path = self.contents[i].path;
					requestObj.type = self.contents[i].type; 

					// send the ajax request at a specific unique route
					$.ajax({
						url: self.route + "untrash",
						type: "POST",
						data: requestObj,
						success: function() {
							// only on successful ajax request we remove the icon that we are recovering from trashed directory
							// the trashed directory
							$("#wrapper-" + self.contents[i].id).remove();
						}
					})

					// call to setTimeout which invokes the trashRecovery as its call back making the process recursive
					return setTimeout(function() {
						return trashRecovery(++i); // increment the i and then make the function call which gets called by setTimeout function as its call back, no function call stack is expanded as it is the last function call
					}, 20);

				}

				trashRecovery(0);

			})

		}];
	}
}