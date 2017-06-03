'use strict' // to use ES6 syntax explicitly


class Delete extends UtilityButton {

	constructor(route) {
		super("delete", route); // initializes the base class or super class, this is the base class initializer syntax
		this.functions = [function(self) { // self needs to be passed as a parameter and the base class will provide the keyword "this" so that base class's ids and contents can be accessed when this function is invoked inside the base class
			// you can't provide $(self.id).on("click", function(self) {}); with self here because the .on
			// call back function actually provides a argument to its call back which is an event object
			// so us providing self would just alias the event object with "self"
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
				function sendTrash(i) {
					// base case
					if (i === self.contents.length) {
						return;
					}

					// the important information needed for us to do our business is
					// the path and the name of the Icon object, we have to encapsulate the
					// path and the name in an object along with the indicator to whether its
					// a file or not, if its a folder the server should ls everything and turn the
					// flags inside all the files recursively to false!
					var requestObj = {};
					requestObj.name = self.contents[i].name;
					requestObj.path = self.contents[i].path;
					requestObj.type = self.contents[i].type;

					$.ajax({
						url: self.route + "trash",
						type: "POST",
						data: requestObj,
						success: function() {
							// only on success we remove the icon that we are deleting from the file system and putting it inside the trashed directory
							$("#wrapper-" + self.contents[i].id).remove(); // we target it by wrapper because wrapper contains both the file icon and the file name!
						}
					})

					// ++i;

					// makes the recursive call with an interval and the recursive call is the last line in the function 
					// so the function call stack will never get expanded, so this is not an expand and collapse situation
					return setTimeout(function() {
						// IT IS VERY IMPORTANT TO INCREMENT THE i HERE AND NOT ABOVE because the ajax request is asynchronous
						// meaning that no matter what the last thing in the function before the return statement which is a second order
						// asynchronous function, setTimout, will be the ajax function. This means that even tho the ajax request 
						// would be before the ++i in line 52 the ajax function would still be executed after line 52 and before setTimeout. 
						return sendTrash(++i);
					}, 20);

				}

				sendTrash(0);

			});
		}];		
	}
}