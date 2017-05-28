'use strict'; // to avoid JavaScript weirdness

/*
	responsible for managing the #dnd div which is basically the drop box zone
	should contain some sort of data structure which allows it to keep a track
	of how the file system actually looks like, x and y axis value to place a 
	file, should be the main communicator with the user, and should have a 
	composition relationship with FileIcon and FolderIcon classes
*/


class FileSystemLayout {

	constructor() {
		this.x = 15;

		this.y = 7;

		this.dropZoneId = "#dnd"; // main focus variable

		this.table = new Table(8); // datastructure that structures the icon in a table like manner, 8 indicates how many elements each row array will have

		this.downloadComponent = new Download(); // composition relationship with the download component

		this.deleteComponent = new Delete();

		this.path = new Path(); // composition relationsip with Path

		this.selections = []; // will contain the DOM element currently selected either by click or key navigations

		this.globalClick = false; // this keeps track of whether the drop zone click should make all the files blue or not, if it is true then then the counter will be incremented
		
		this.counter = 0; // only if the counter is greater than 0 the click event handler will loop through everything and unselect and selected file and turn the color of the file from red to blue
		
		this.keyStack = []; // a stack of event keys for creating a new folder
		
		this.route = "/" + $("#username").text() + "/"; // default route options, strings get added on top of this depending on the situation to make ajax requests

		this.ctrl = false; // keeps track of whether control button is pressed or not

		this.navCoordinates = {r: -1, i: -1, init: true}; // dictionary contains 3 key value pairs, x coordinate, y coordinate and init which indicates if this is the first movement or not
	}

	// basic create() method that comes in with every component
	create() {
		this.generateInitialFS();
		this.attachGlobalClickEH();
		this.attachWindowEH();
		this.downloadComponent.create();
		this.deleteComponent.create();
	}

	// on initial page load this function gets invoked, so that the contents in the root directory can be displayed
	generateInitialFS() {
		var self = this;
		// on creation of the file system layout we must make an ajax request to get the list
		// of files there is initially on the root folder, so that we can display the users
		var requestObj = {}
		requestObj.path = this.path.get;

		$.ajax({
			url: self.route + "init",
			type: "POST",
			data: requestObj,
			success: function(data) {
				for (var i = 0; i < data.ls.length; ++i) {
					if (data.ls[i].type === "file") {
						// if the content is a file then add file to DOM
						self.addFileToDOM(data.ls[i].name);
					} else {
						// if the content is a folder then add the folder to DOM
						self.addFolderToDOM(data.ls[i].name);
					}
				}
			}
		})
	}

	// adds a file to the document object model
	addFileToDOM(fileName) {

		// never name variables file, JavaScript confuses it with some built in keyword
		var fileIcon = new FileIcon(fileName, this.x, this.y, this.path.get); // name of the file, x and y coordinate and path the icon belongs to

		if (this.table.contains(fileIcon, function(x, y) { // an anonymous function being passed which gets called inside table, and table passed on the parameters to the functions inside tables function
			if (x.name === y.name) return true;
			else return false;
		})) { // checks if the file that got created already exists in the table
			alert("File with that name already exists!");
			return;
		}

		fileIcon.create(); // create the file icon components, after the check as this draws the file icon in the browser
	
		this.attachIconEH(fileIcon); // attach the event handler of the file
	
		// update the table with the new file
		this.table.add(fileIcon); 

		// extract the row and index value of the row
		var {r, i} = this.table.at();

		// add the table coordinates for the individual folder
		fileIcon.tableCoordinates.push(r);
		fileIcon.tableCoordinates.push(i);

	}

	// adds a folder to the document object model
	addFolderToDOM(folderName) {

		var folder = new FolderIcon(folderName, this.x, this.y, this.path.get); // name of the folder, x and y coordinate and path the icon belongs to

		if (this.table.contains(folder, function(x, y) { // an anonymous function being passed which gets called inside table, and table passed on the parameters to the functions inside tables function
			if (x.name === y.name) return true;
			else return false;
		})) {
			alert("Folder with that name already exists!");
			return;
		}

		folder.create(); // create the file icon components, after the check as this draws the file icon in the browser

		this.attachIconEH(folder); // attach the event handler of the folder

		// update the table with the new folder
		this.table.add(folder);

		// extract the row and index value of the row
		var {r, i} = this.table.at();

		// add the table coordinates for the individual folder
		folder.tableCoordinates.push(r);
		folder.tableCoordinates.push(i);

	}

	// adds a file icon to the DOM and uploads the folder to the server
	addFile(fObj) {
		this.addFileToDOM(fObj.name);
		// makes asynchronous request to the server to upload the file
		this.uploadFile(fObj);
	}

	// adds a folder icon to the DOM and uploads the folder to the server
	addFolder(folderName) {
		this.addFolderToDOM(folderName);
		this.uploadFolder(folderName);
	}

	/*
		the data is being manipulated as a string and will be sent to the server using a string
		the data can also be sent to the server using an ArrayBuffer object but I chose string for simplicity
		as different languages all have strings in common but not the JavaScript object ArrayBuffer
		http://stackoverflow.com/questions/31581254/how-to-write-a-file-from-an-arraybuffer-in-js
		link above shows how to write to a file using an array buffer

		Represents a raw buffer of binary data, which is used to store data for the different typed arrays. 
		ArrayBuffers cannot be read from or written to directly, but can be passed to a typed array or DataView 
		Object to interpret the raw buffer as needed. 
	*/

	// uploads a file to the server
	uploadFile(file) { // requests the server to upload the file
		var self = this;
		var reader = new FileReader();
		// call back function, which means it is the last thing to get executed
		reader.onload = function(event) {
			var data = reader.result; // returns the result of the callback, on ready state 4 of the reader async function

			/*
				when you console.log data it will appear to look like something like this
				data:application/msword;base64,0M8R4KGxGuEAAAAAAAAAAAAAAAAA........
				obviously it depends from file to file, but you will get the file type and then
				comma the actual data, now to extract the data you split and make it into an array
				by the comma, and now you have the type of data and the contents of the data in an 
				JavaScript array containing two elements.
				We don't really care about the first index so we take the second indext and now we 
				have our array of contents to be stored in the server side!

				readAsDataUrl automatically converts it to base64 we just need to extract the actual
				part from the gigantic string

			*/
	
			// convert the data to base64
			var base64 = data.split(",")[1];

			// p element with the id, "#username" contains the user name
			var u = "/" + $("#username").text() + "/" + "uploadFiles";
			var requestObj = {}	
			// fill in the contents of the object with file informations		
			requestObj.name = file.name;
			requestObj.lastModified = file.lastModified;
			requestObj.size = file.size;
			requestObj.type = file.type;
			requestObj.contents = base64;
			requestObj.path = self.path.get;

			// make the ajax request
			requestObj = JSON.stringify(requestObj);
			$.ajax({
				url: u,
				type: "POST",
				data: requestObj
			})
		}
		reader.readAsDataURL(file); // calls the reader.onload function
	}

	// uploads a folder to the server
	uploadFolder(folderName) {
		var self = this;
		var folderObj = {};
		folderObj.name = folderName;
		// must follow the convention of ending with a backslash, it is very crucial as the
		// server follows the conention of the path string always ending with "/"
		folderObj.path = this.path.get + folderName + "/";
		$.ajax({
			url:  self.route + "uploadFolders",
			type: "POST",
			data: folderObj
		})
	}


	// attaches all the event handlers that the document window will utilize
	attachWindowEH() {
		/*
			on keydown push the keycodde 16 to the stack
			on keyup if the key is 78 then push it to the stack and then the next
			instruction is to check if the first and second index is either 16 and 78 or 78 and 16
			then inside the if statement prompt the user, after the prompt in next instruction
			simply loop over the array and clear the array
			the array will get cleared no matter what key up you make, but remember only the
			right combination will trigger the prompt 
		*/
		var self = this;
		// checks if the keycode is 16 which is shift on keydown
		// also checks if the keycode is 78 which is n on key up

		$(window).on("keydown", function(event) {
			// 16 for shift button
			if (event.which === 16) {
				self.keyStack.push(16);
			}

			self.backSpace(event, self);
			self.arrowKeys(event, self);
			self.returnKey(event, self);

			// 17 for ctrl button
			if (event.which === 17) {
				self.ctrl = true; // upon control key down we set the boolean indicating this event to true
			}

		});
		/*
			when a key is released we need to make sure that it is the n key, therefore
			on release we push key number 78 to the stack of keys
			after it gets pushed we immedietly check if the combo 16 and 78 is the first and second index
			or 78 and 16 is the first and second index then we ask the prompt
		*/
		$(window).on("keyup", function(event) {
			if (event.which === 78) {
				self.keyStack.push(78);
			}
			/*
				if the first index of the stack of keys is 78 and the second index of the stack of keys is 16 we know we have pressed shift and n consequetively
				this might look confusing as we might want 78 first and then 16, but in our case, its a keyup, which means
				key 16 will get released first, and as it gets released it becomes the first index
				and then 78 gets released therefore n gets released first and then 78
				same thing might happen the opposite way where you may release the shift key first and then the n key, which is also valid
			*/
			if (self.keyStack[0] === 16 && self.keyStack[1] === 78 || self.keyStack[0] == 78 && self.keyStack[1] === 16) {
				var folderName = prompt("Please enter the folder name");
				self.addFolder(folderName);
			}
			/*
				always pop the array by at the end if length becomes greater than 2 as we want to hold a maximum of 2 digits
				for loop will not work while popping because self.keyStack.length is checked everytime you pop

				for example you have length of 2, if you go over the loop and pop once your i becomes 1
				now the self.keyStack.length is also checked and it turns out to be 1 now, and i = 1 and i < 1 is false therefore
				loop is broken out and we don't end up with all elements being popped
			*/
			var keyStackSize = self.keyStack.length;
			for (var i = 0; i < keyStackSize; ++i) {
				self.keyStack.pop();
			}

			// 17 for ctrl button
			if (event.which == 17) {
				self.ctrl = false; // upon control key up we set the boolean indicating this event to false
			}


		})
	}

	// return key event handler for the window
	returnKey(event, self) {

		// return key code is 13
		if (event.which === 13 && self.selections.length !== 0 && self.selections.length < 2) { // all these statement need to be true for the entire statement to be evaluated to true
			// enter key has a default behaviour equal to the left click, so we prevent the mixups as
			// out left click is special
			event.preventDefault();

			/*
				return key does essentially what double click event handler does
				so if we can use similar instructions that doubleClick uses
			
				we need to check one very important thing, which is to make sure we don't cd into a
				file that is currently selected!
			*/
			if (self.selections[0].constructor === FileIcon) return; // ends the function here
		
			// otherwise the path needs to be extended as we are now visiting a new folder	
			self.path.extend(self.selections[0].name);

			/*
				now we need to remove all the current contents from the drop zone
				and get the conents inside the folder that we just double clicked

				make request object which encapsulates the path for the server to query

				you need to change the arrow key to an empty string when you enter a folder, or else
				you will get a momentum error

			*/
			var requestObj = {};

			requestObj.path = self.path.get;

			$.ajax({
				url: self.route + "expandDir", // same route as doubleClick
				type: "POST",
				data: requestObj,
				success: function(data) {
					self.populateDropZone(data.ls);
				}
			})
		}
	}


	// arrow keys icon navigation event handler for the window
	arrowKeys(event, self) {

		// for whatever arrow selected if it is the initial selection then x, y coordinates will become 0 and init will become false

		// we don't want this behaviour for just any keys but only left, right, up and down
		if (self.navCoordinates.init && (event.which === 37 || event.which === 39 || event.which === 38 || event.which === 40)) {
			event.preventDefault(); // this prevents the default key behaviour, which is moving the scroll bar left, right, up, down
			self.navCoordinates.r = 0;
			self.navCoordinates.i = 0;
			self.select(self.table.getAt(self.navCoordinates.r, self.navCoordinates.i));
			return; // we end the function, this prevents the code below the if statement from executing
		}


		// one of these if statment will be checked one after another in order
		if (event.which === 37) { // left




		} else if (event.which === 39) { // right




		} else if (event.which === 38) { // up 





		} else if (event.which === 40) { // down




		}

	}

	// back space event handler for the window
	backSpace(event, self) {

		// if statement to prevent cding out of the root folder
		if (self.path.get === "./filesystems/user-fs/" + $("#username").text() + "/") return;

		/*
			event that handles backspace, which is basically when you hit backspace you go back to the
			previous working directory by shorting the path and sending an ajax request

			we want to check for another thing besides the keycode 16, hence it is a second check
			if path.get === "./src/user-fs/" + $("#username").text() + "/", then we are at the root directory
			and we cannot go back further then that!
		*/
		if (event.which === 8 && self.path.get !== "./src/user-fs/" + $("#username").text() + "/") {

			// we empty out the selected downloads when we enter another folder environment

			// shorten the path and back up a folder
			self.path.shorten();

			// encapulate the path string in a request object
			var requestObj = {};
			requestObj.path = self.path.get;

			// send the path request to the server to get back a folder contents for the specific path
			$.ajax({
				url: self.route + "back",
				type: "POST",
				data: requestObj,
				success: function(data) {
					// on success extract the array of contents from the data and
					// populate the drop zone with new contents
					self.populateDropZone(data.ls);
				}
			})
		}
	}

	// attaches a click event handler to the drop zone window, where upon clicking the dropzone if any item gets selected, it automatically gets deselected
	attachGlobalClickEH() {
		var self = this;
		// target the drop zone for clicks only
		$(this.dropZoneId).on("click", function() {
			if (self.counter > 0) { // first check, makes sure that the self counter is active, if it is not then we go on to the second check
				var tableSize = self.table.size(); // for more optimized performance, this prevents the for loop from calculating the size each iteration
				for (var i = 0; i < tableSize; ++i) {
					self.unselect(self.table.get(i));	
				}		
			} 		
			else if (self.globalClick) { // this check, checks only if first check is not fulfilled, if globalClick gets turned on
				++self.counter; // then we simply increment the counter so that if another drop zone click is made we can loop through the
								// entire contents and unselect them!
			} 
		});
	}


	// all the event handlers that can be associated with files in the file system layout in the drop zone
	attachIconEH(icon) {
		this.singleClick(icon);
		this.doubleClick(icon);
	}

	// single click event handler
	singleClick(icon) {
		var self = this; // this in each scope is different in JavaScript
		/* Single click on the icon, deals with both file icons and folder icons */
		// on click the color of the highlight changes
		$("#" + icon.id).on("click", function () {		
			/*
				each file icon has an event handler which loops through the all the file icons
				then checks if the click is on the current icon and if the icon is not
				selected then go ahead and select it
				else unselect all other icons by making them blue and unselecting it
				each iteration will either be the fileIcon clicked or all other icons
			*/
			var tableSize = self.table.size(); // storing the size of the table in a variable for faster and optimized performance, as the for loop calculates the length each iteration over and over again

			for (var i = 0; i < tableSize; ++i) {
				/*
					both these statement need to be true in order for the entire entire statement to be true
					which makes sense as we want the current element in the array to be the icon we clicked
					AND we have to make sure that the element in the array is not selected, because if it is not selected
					only then can we select it, we can't select something that is unselected
				*/
				if (self.table.get(i) === icon && !self.table.get(i).isRed()) { // red - selected
			
					self.select(self.table.get(i));

				} else { // blue - unselected
				

					/*
						ctrl algorithm - When keydown event and the event.which happens to be the ctrl key then
										 we simply set the boolean attribute this.ctrl to true, we alsokeep an array of icons
										 called this.selections, which is also an attribute and keeps track of what is being selected, 
										 if ctrl is not pressed then a normal global click will turn all the icon blue in the table 
										 automatically as it always does it regardless of ctrl or not and is the default behaviour for the global click.
										 The line below if (!self.ctrl) { self.unselect(self.table.get(i)) }, it prevents
										 another single click from unselecting what was last selected, default behaviiour
										 would be to unselect any item currently selected, but when ctrl is pressed we don't
										 unselect! only unselect is done on a global click. Remember upon unselect, the
										 this.selections array element will get popped off, as that array keeps track of selections.

					*/


					// unselect only when control button is not pressed
					if (!self.ctrl) {
						self.unselect(self.table.get(i));
					}

				}
			}
		});
	}

	// double click event handler
	doubleClick(icon) {
		var self = this;

		/* Double click on the icon, deals with only folder icons */
		if (icon.constructor !== FileIcon) {
			$("#" + icon.id).on("dblclick", function() {

				// the path needs to be extended as we are now visiting a new folder
				self.path.extend(icon.name);
				
				/*
					now we need to remove all the current contents from the drop zone
					and get the conents inside the folder that we just double clicked

					make request object which encapsulates the path for the server to query

					you need to change the arrow key to an empty string when you enter a folder, or else
					you will get a momentum error

				*/

				var requestObj = {};

				requestObj.path = self.path.get;

				$.ajax({
					url: self.route + "expandDir",
					type: "POST",
					data: requestObj,
					success: function(data) {
						self.populateDropZone(data.ls);
					}
				})
			});
		}
	}

	// removes all the contents currently available in the dropzone and populate the contents which are currently there
	populateDropZone(ls) {
		this.downloadComponent.empty(); // we empty out the contents to be downloaded as we discarded our selection
		this.deleteComponent.empty(); //  we empty our contents to be downlownloaded as we discarded our selection

		/*
			needs to be stored in a variable because in a for loop the length
			gets calculated each time, and we don't want that, we want to pop for a fix number
			of times, the value of i gets messed up as i does become greater than this.table.size()
			at one point even the the elements have not been popped off
		*/

		var tableSize = this.table.size(); // length must be the same event if elements are being removed, as the for loop will calculate the length in each iteration we don't want that, we have a fixed number of elements we would like to remove

		// nullifying the folder/file selected
		this.selections = [];


		for (var i = 0; i < tableSize; ++i) {
			// killing two birds with one exression, pop returns the element that is being removed
			// from the array
			$("#wrapper-" + this.table.removeLast().id).remove();
		}

		for (var i = 0; i < ls.length; ++i) {
			if (ls[i].type === "file") { // if element at ith index in list of contents happen to be a file then add file objec to DOM
				this.addFileToDOM(ls[i].name);
			} else { // if element at ith index in the list of contents happen to be a folder the add the folder to DOM
				this.addFolderToDOM(ls[i].name);
			}
		}

	}

	// turns a selected icon blue, its a wrapper function with some underlying functionalities
	unselect(icon) {
		icon.turnBlue();

		// any icon turned blue will be removed from the download contents and delete contents
		this.downloadComponent.remove(icon);
		this.deleteComponent.remove(icon);


		// remove an item from the selections array, usually one element will be selected and one element will be unselected, so we will be most likely removing from an array which consists of only one element
		// we need to loop over the selections array and remove only the icon in the parameter form the selections array

		for (var i = 0; i < this.selections.length; ++i) {
			if (this.selections[i].name === icon.name) { // if element matches the icon
				this.selections.splice(i, 1);
				return; // exit the function, this also prevets further iteration of the loop
			}
		}

	}

	// turns a selected icon red, its a wrapper function which wraps around a icon method with added functionalities
	select(icon) {
		icon.turnRed();

		// any red icon selected will be added to the download components contents and delete contents
		this.downloadComponent.add(icon);
		this.deleteComponent.add(icon);


		// add to the selections array the icon currently selected
		this.selections.push(icon);
		
		/*
			prevents an activated global click from deactivating current marked red window
			while switching between two tiles (this is mandatory as the global event is fired immediently after a click
			it happens simultaneously! )
		*/		

		this.globalClick = true; // turns on the drop zone event handlers job to do its thing
		this.counter = 0; // resets the counter, just to prevent large numbers from stacking	
	}


}