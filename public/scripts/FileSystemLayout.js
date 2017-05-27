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

		this.contents = []; 

		this.table = new Table(); // datastructure that structures the icon in a table like manner

		this.downloadComponent = new Download(); // composition relationship with the download component

		this.path = new Path(); // composition relationsip with Path

		this.selected = null; // will contain the DOM element currently selected

		this.globalClick = false; // this keeps track of whether the drop zone click should make all the files blue or not, if it is true then then the counter will be incremented
		
		this.counter = 0; // only if the counter is greater than 0 the click event handler will loop through everything and unselect and selected file and turn the color of the file from red to blue
		
		this.dropZoneId = "#dnd"; // main focus variable
		
		this.keyStack = []; // a stack of event keys for creating a new folder
		
		this.route = "/" + $("#username").text() + "/"; // default route options, strings get added on top of this depending on the situation to make ajax requests

		this.redFile = "url(public/images/file-4.png)"; // file color red for css properties
		
		this.redFolder = "url(public/images/folder-2.png)"; // folder color red css properties
		
		this.blueFile = "url(public/images/file-3.png)"; // file color blue css properties
		
		this.blueFolder = "url(public/images/folder.png)"; // folder color blue css properties

	}

	create() {
		this.generateInitialFS();
		this.attachGlobalClickEH();
		this.attachWindowEH();
		this.downloadComponent.create();
	}

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
		
		this.contents.push(fileIcon); // push the fileIcon to the content array
		this.attachIconEH(fileIcon); // attach the event handler of the file
	
		// update the table with the new file
		this.table.add(fileIcon); 

		// extract the row and index value of the row
		var {r, i} = this.table.at();

		// add the table coordinates for the individual folder
		fileIcon.tableCoordinates.push(r);
		fileIcon.tableCoordinates.push(i);

	}

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

		this.contents.push(folder);
		this.attachIconEH(folder);

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

	// check documentation of the uploadFile method, it follow similar structure
	// except now we are uploading a folder instead of a file
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

	/*
		on keydown push the keycodde 16 to the stack
		on keyup if the key is 78 then push it to the stack and then the next
		instruction is to check if the first and second index is either 16 and 78 or 78 and 16
		then inside the if statement prompt the user, after the prompt in next instruction
		simply loop over the array and clear the array
		the array will get cleared no matter what key up you make, but remember only the
		right combination will trigger the prompt 
	*/
	attachWindowEH() {
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
		})
	}

	// return key event handler for the window
	returnKey(event, self) {

		// return key code is 13
		if (event.which === 13 && self.selected) { // both these statement need to be true for the entire statement to be evaluated to true
			// enter key has a default behaviour equal to the left click, so we prevent the mixups as
			// out left click is special
			event.preventDefault();

			self.downloadComponent.empty(); // we empty out the selected download components when cding into a folder 

			/*
				return key does essentially what double click event handler does
				so if we can use similar instructions that doubleClick uses
			
				we need to check one very important thing, which is to make sure we don't cd into a
				file that is currently selected!
			*/

			if (self.selected.constructor === FileIcon) return; // ends the function here
		
			// otherwise the path needs to be extended as we are now visiting a new folder	
			self.path.extend(self.selected.name);

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


	// arrow keys icon navigation event handler
	arrowKeys(event, self) {

		// one of these if statment will be checked one after another in order
		if (event.which === 37) { // left



		} else if (event.which === 39) { // right
	



		} else if (event.which === 38) { // up 






		} else if (event.which === 40) { // down




		}

	}

	// back space event handler
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

			self.downloadComponent.empty();

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

	/*	
		attaches file event handler
		the idea is to loop over the contents array and turn on the the file icon provided
		and turn off the file icon not provided
	*/

	attachIconEH(icon) {
		this.singleClick(icon);
		this.doubleClick(icon);
	}

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
			for (var i = 0; i < self.contents.length; ++i) {
				/*
					both these statement need to be true in order for the entire entire statement to be true
					which makes sense as we want the current element in the array to be the icon we clicked
					AND we have to make sure that the element in the array is not selected, because if it is not selected
					only then can we select it, we can't select something that is unselected
				*/
				if (self.contents[i] === icon && !self.contents[i].isRed()) { // red - selected
			
					self.turnRed(i);

				} else { // blue - unselected
				
					self.turnBlue(i)

				}
			}
		});
	}

	doubleClick(icon) {
		var self = this;

		/* Double click on the icon, deals with only folder icons */
		if (icon.constructor !== FileIcon) {
			$("#" + icon.id).on("dblclick", function() {

				self.downloadComponent.empty(); // we empty out the download components when we cd into the folder
	
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

	// removes all the contents currently available in the dropzone and populate the contents
	// which are currently there
	populateDropZone(ls) {
		/*
			needs to be stored in a variable because in a for loop the length
			gets calculated each time, and we don't want that, we want to pop for a fix number
			of times, the value of i gets messed up as i does become greater than this.table.size()
			at one point even the the elements have not been popped off
		*/
		var size = this.table.size();

		// nullifying the folder/file selected
		this.selected = null;


		for (var i = 0; i < size; ++i) {
			// killing two birds with one exression, pop returns the element that is being removed
			// from the array
			this.contents.pop();
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

	// attaches a click event handler to the drop zone window, where upon clicking
	// the dropzone if any item gets selected, it automatically gets deselected
	attachGlobalClickEH() {
		var self = this;
		// target the drop zone for clicks only
		$(this.dropZoneId).on("click", function() {
			if (self.counter > 0) { // first check, makes sure that the self counter is active, if it is not then we go on to the second check
				for (var i = 0; i < self.contents.length; ++i) {
					self.turnBlue(i);	
				}		
			} 		
			else if (self.globalClick) { // this check, checks only if first check is not fulfilled, if globalClick gets turned on
				++self.counter; // then we simply increment the counter so that if another drop zone click is made we can loop through the
								// entire contents and unselect them!
			} 
		});

	}


	// turns a selected icon blue
	turnBlue(index) {

		this.contents[index].turnBlue();

		// any icon turned blue will be removed from the download contents
		this.downloadComponent.remove(this.contents[index]);

	}

	// turns a selected icon red
	turnRed(index) {
		
		this.contents[index].turnRed();

		// any red icon selected will be added to the download components contents
		this.downloadComponent.add(this.contents[index]);

		this.selected = this.contents[index]; // turn on global click to unselect on a global click
		
		this.activateGlobalNullifier();

	}


	activateGlobalNullifier() {
		/*
			prevents an activated global click from deactivating current marked red window
			while switching between two tiles (this is mandatory as the global event is fired immediently after a click
			it happens simultaneously! )
		*/		

		this.globalClick = true; // turns on the drop zone event handlers job to do its thing
		this.counter = 0; // resets the counter, just to prevent large numbers from stacking	
	}



}