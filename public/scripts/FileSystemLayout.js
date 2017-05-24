'use strict'; // to avoid JavaScript weirdness

// responsible for managing the #dnd div which is basically the drop box zone
// should contain some sort of data structure which allows it to keep a track
// of how the file system actually looks like, x and y axis value to place a 
// file, should be the main communicator with the user, and should have a 
// composition relationship with FileIcon and FolderIcon classes
class FileSystemLayout {

	constructor() {
		// should have x and y coordinates
		this.x = 15;
		this.y = 7;
		this.contents = []; // contains a collection of conents being added to the window can be a fileIcon or FolderIcon
		
		this.indexSelected = 0; // a variable which is a pointer to the index that is currently selected by the arrow key
								// if left is pressed index reduces by -1, if right is pressed index increases by +1
								// using math we then calculate the y axis for up and down keys
		this.selected = null; // will contain the DOM element currently selected

		this.globalClick = false; // this keeps track of whether the drop zone click should make all the files blue or not, if it is true then
								  // then the counter will be incremented
		this.counter = 0;		 // only if the counter is greater than 0 the click event handler will loop through everything and unselect and selected file
							     // and turn the color of the file from red to blue
		this.dropZoneId = "#dnd"; // main focus variable
		this.keyStack = []; // a stack of event keys for creating a new folder
		this.path = new Path();
		// default route options, strings get added on top of this depending on
		// the situation to make ajax requests
		this.route = "/" + $("#username").text() + "/";

		this.arrowKeySelected = "";
	}

	create() {
		this.generateInitialFS();
		this.attachGlobalClickEH();
		this.attachWindowEH();
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
		// a check to see if file with a similar name exists or not
		for (var i = 0; i < this.contents.length; ++i) {
			if (this.contents[i].name === fileName) {
				alert("File with that name already exists!");
				return;
			}
		}

		var file = new FileIcon(fileName, this.x, this.y);
		file.create(); // create the file icon components
		this.contents.push(file); // push the fileIcon to the content array
		this.attachIconEH(file); // attach the event handler of the file
	}

	// adds a file icon to the DOM
	addFile(fObj) {
		this.addFileToDOM(fObj.name);
		// makes asynchronous request to the server to upload the file
		this.uploadFile(fObj);
	}

	// the data is being manipulated as a string and will be sent to the server using a string
	// the data can also be sent to the server using an ArrayBuffer object but I chose string for simplicity
	// as different languages all have strings in common but not the JavaScript object ArrayBuffer
	// http://stackoverflow.com/questions/31581254/how-to-write-a-file-from-an-arraybuffer-in-js
	// link above shows how to write to a file using an array buffer

	/*
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

			// when you console.log data it will appear to look like something like this
			// data:application/msword;base64,0M8R4KGxGuEAAAAAAAAAAAAAAAAA........
			// obviously it depends from file to file, but you will get the file type and then
			// comma the actual data, now to extract the data you split and make it into an array
			// by the comma, and now you have the type of data and the contents of the data in an 
			// JavaScript array containing two elements.
			// We don't really care about the first index so we take the second indext and now we 
			// have our array of contents to be stored in the server side!

			// readAsDataUrl automatically converts it to base64 we just need to extract the actual
			// part from the gigantic string

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

	addFolderToDOM(folderName) {
		// a check to see if folder with a similar name exists or not
		for (var i = 0; i < this.contents.length; ++i) {
			if (this.contents[i].name === folderName) {
				alert("Folder with that name already exists!");
				return;
			}
		}
		var folder = new FolderIcon(folderName, this.x, this.y);
		folder.create();
		this.contents.push(folder);
		this.attachIconEH(folder);

		var folderObj = {};
		folderObj.name = folderName;
		folderObj.path = this.path.get;
	}


	addFolder(folderName) {
		this.addFolderToDOM(folderName);
		this.uploadFolder(folderName);
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

	// on keydown push the keycodde 16 to the stack
	// on keyup if the key is 78 then push it to the stack and then the next
	// instruction is to check if the first and second index is either 16 and 78 or 78 and 16
	// then inside the if statement prompt the user, after the prompt in next instruction
	// simply loop over the array and clear the array
	// the array will get cleared no matter what key up you make, but remember only the
	// right combination will trigger the prompt 
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
			self.arrowKeyNav(event, self);
			self.returnKey(event, self);

		});

		// when a key is released we need to make sure that it is the n key, therefore
		// on release we push key number 78 to the stack of keys
		// after it gets pushed we immedietly check if the combo 16 and 78 is the first and second index
		// or 78 and 16 is the first and second index then we ask the prompt
		$(window).on("keyup", function(event) {
			if (event.which === 78) {
				self.keyStack.push(78);
			}
			// if the first index of the stack of keys is 78 and the second index of the stack of keys is 16 we know we have pressed shift and n consequetively
			// this might look confusing as we might want 78 first and then 16, but in our case, its a keyup, which means
			// key 16 will get released first, and as it gets released it becomes the first index
			// and then 78 gets released therefore n gets released first and then 78
			// same thing might happen the opposite way where you may release the shift key first and then the n key, which is also valid
			if (self.keyStack[0] === 16 && self.keyStack[1] === 78 || self.keyStack[0] == 78 && self.keyStack[1] === 16) {
				var folderName = prompt("Please enter the folder name");
				self.addFolder(folderName);
			}
			// always pop the array by at the end if length becomes greater than 2 as we want to hold a maximum of 2 digits
			// for loop will not work while popping because self.keyStack.length is checked everytime you pop

			// for example you have length of 2, if you go over the loop and pop once your i becomes 1
			// now the self.keyStack.length is also checked and it turns out to be 1 now, and i = 1 and i < 1 is false therefore
			// loop is broken out and we don't end up with all elements being popped
			var keyStackSize = self.keyStack.length;
			for (var i = 0; i < keyStackSize; ++i) {
				self.keyStack.pop();
			}
		})
	}

	// return key event handler for the window
	returnKey(event, self) {
		// return key code is 13
		if (event.which === 13 && self.selected) { // both these expression need to be true for the entire statement to be evaluated to true
			// return key does essentially what double click event handler does
			// so if we can use similar instructions that doubleClick uses
		
			// we need to check one very important thing, which is to make sure we don't cd into a
			// file that is currently selected!
			if (self.selected.constructor === FileIcon) return; // ends the function here
		
			// otherwise the path needs to be extended as we are now visiting a new folder	
			self.path.extend(self.selected.name);

			// now we need to remove all the current contents from the drop zone
			// and get the conents inside the folder that we just double clicked

			// make request object which encapsulates the path for the server to query

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
	arrowKeyNav(event, self) {

		// one of these if statment will be checked one after another in order
		if (event.which === 37) { // left

			/*
				When the momentum is right we increment in advance the position, we are going to take. This
				causes a few problems, if we want to go left, we have already incremented the index by + 1.
				
				We start at 2 lets say and we go highlight 2 and the next iteration we highlight 3, so we do 2 + 3 in advance.
				0 1 2 3 4 5 6

				But then in the next iteration we press the left key! This is a problem, now we actually need to go back from 3
				to 1, so we do 3 - 2. NOTE** - This is why we use 2.

				There are two special cases. Lets say we started fresh and started going right, our initial position is 0 and
				we increment by 1 for the next iteration as we are thinking in advance. But this time instead again we go left.
				And we run into a problem as 0 - 2 is -2 from if we follow our algorithm. So what we do instead is when we encounter
				0 we decrease our index will be the length of the array - 1.

				Now if we are at 2 our index will be length of the array - 2!

			*/

			if (self.arrowKeySelected === "right") { 
				if (self.indexSelected !== 1 && self.indexSelected !== 0) { 
					self.indexSelected -= 2; 
				} else if (self.indexSelected === 0) {
					if (self.contents.length !== 1) { // when length is one or there is only 1 folder then the index becomes -1 as length -2 = -1, so this is a case that needs to be checked	
						self.indexSelected = self.contents.length - 2;
					} else { // when that happens 0 out the index 
						self.indexSelected = 0;
					}
				} else { 
					self.indexSelected = self.contents.length - 1;
				}
			} 

			self.arrowKeySelected = "left";
			
			event.preventDefault(); // prevents default browser behaviour of scrolling the page up down or sideways using the specific arrow key
			
			/*

				Another approach for us to take would be turning all the icons blue which come after us!
				But if we are at the begining and we are about to cycle back to the end we need to clean up the
				first index!

			*/

			if (self.indexSelected === self.contents.length - 1) {
				if (self.contents[0].constructor === FileIcon) {
					$("#" + self.contents[0].id).css("background-image", "url(public/images/file-3.png)");
				} else {
					$("#" + self.contents[0].id).css("background-image", "url(public/images/folder.png)")
				}			
			}

			// one icon for file and another one for folder, so a check has to be made
			// make it red
			if (self.contents[self.indexSelected].constructor === FileIcon) {
				$("#" + self.contents[self.indexSelected].id).css("background-image", "url(public/images/file-4.png)");
			} else {
				$("#" + self.contents[self.indexSelected].id).css("background-image", "url(public/images/folder-2.png)");
			}
			// turn on global click to unselect on a global click
			self.selected = self.contents[self.indexSelected];
			self.contents[self.indexSelected].selected = true;
			self.globalClick = true; // turns on the drop zone event handlers job to do its thing
			self.counter = 1; // prevents an activated global click from deactivating current marked red window
							 // while switching between two tiles (this is mandatory as the global event is fired immediently after a click
							 // it happens simultaneously! )	
		
			// we need to turn all contents next of us to blue as mentioned above
			for (var i = self.indexSelected + 1; i < self.contents.length; ++i) {
				if (self.contents[i].constructor === FileIcon) { // dealing with file
					$("#" + self.contents[i].id).css("background-image", "url(public/images/file-3.png)");
				} else { // dealing with folder
					$("#" + self.contents[i].id).css("background-image", "url(public/images/folder.png)");
				}
				self.contents[self.indexSelected].selected = false;
			}
			// we check if the index is 0 or not before decrementing it, as we don't want index to go below 0
			if (self.indexSelected !== 0) {
				--self.indexSelected;
			} else {
				self.indexSelected = self.contents.length - 1;
			}

		} else if (event.which === 39) { // right

			/*
				Similar algorithm to what left key follows, except this is exact opposite. So basically, when you are
				at index length - 2 you are actually at lenth - 3, and instead you should be at 0th index, as you are about
				to click right, but momentum is left, so you have to add +2!, but adding plus 2 ends up making us at an index
				which is out of bounds, so we circulate the array and end up at index 0. Now similarly if we are at index
				length - 1, we are actually at length - 2, and we should be at index 1.

			*/

			if (self.arrowKeySelected === "left") { // last move was left
				if (self.indexSelected !== self.contents.length - 2 && self.indexSelected !== self.contents.length - 1) {
					self.indexSelected += 2;
				} else if (self.indexSelected === self.contents.length - 2) {
					self.indexSelected = 0;
				} else { // when index is 0 we don't want index out of bounds now
					if (self.contents.length !== 1) { // if our contents array has only one element this is a problem, as if we set our index to 1 and then if we make a move to right we go index out of bounds!
						self.indexSelected = 1; 		
					} else { // if our length does turn out to be one then we just 0 out the index, to start back at where we were at
						self.indexSelected = 0;
					}
				}
			} 
		
			self.arrowKeySelected = "right";

			event.preventDefault(); // prevents default browser behaviour of scrolling the page up down or sideways using the specific arrow key
			// before we do anything we need to check if the we are at the first index in the array
			// if we are chances are we have cycled through the files once and have reached this point
			// so we need to turn the length - 1 index icon blue before we can proceed
			if (self.indexSelected === 0) {
				if (self.contents[self.contents.length - 1].constructor === FileIcon) {
					$("#" + self.contents[self.contents.length - 1].id).css("background-image", "url(public/images/file-3.png)");
				} else {
					$("#" + self.contents[self.contents.length - 1].id).css("background-image", "url(public/images/folder.png)")
				}			
			}
			// one icon for file and another one for folder, so a check has to be made
			// make it red
			if (self.contents[self.indexSelected].constructor === FileIcon) {
				$("#" + self.contents[self.indexSelected].id).css("background-image", "url(public/images/file-4.png)");
			} else {
				$("#" + self.contents[self.indexSelected].id).css("background-image", "url(public/images/folder-2.png)");
			}
			// turn on global click to unselect on a global click
			self.selected = self.contents[self.indexSelected];
			self.contents[self.indexSelected].selected = true;
			self.globalClick = true; // turns on the drop zone event handlers job to do its thing
			self.counter = 1; // prevents an activated global click from deactivating current marked red window
							 // while switching between two tiles (this is mandatory as the global event is fired immediently after a click
							 // it happens simultaneously! )	
		
			// we need to turn all contents in the previous index of the context array to blue
			// before we can turn the new content red, also we need to make sure we don't go to a
			// negative index so we check for if the index is 0 before we do so, if the index is 0 then we
			// don't have to turn anything blue 
			for (var i = self.indexSelected - 1; i > -1; --i) {
				if (self.contents[i].constructor === FileIcon) { // dealing with file
					$("#" + self.contents[i].id).css("background-image", "url(public/images/file-3.png)");
				} else { // dealing with folder
					$("#" + self.contents[i].id).css("background-image", "url(public/images/folder.png)");
				}
				self.contents[self.indexSelected].selected = false;
			}
			// increment of the id is needed so that in the next right we choose the next icon as the index is changed of the contents array
			// we need to make sure that we don't exceed the length of the array contents
			// to do that everytime we hit the length of the array content we simply set the index to 0 to start over
			if (self.indexSelected !== self.contents.length - 1) { // we want to increment till we hit the length - 1 index or the last index, once we do, it is assumed we have already turned that icon red, so just reset the counter
				++self.indexSelected;
			} else {
				self.indexSelected = 0;
			}

		} else if (event.which === 38) { // up 

			event.preventDefault(); // to prevent default browser movement which is in this case is to move the scroll bar up

			/*
				Each row can hold 8 items, so which ever index you are in the contents array
				you should always decrease 8 from your current index to be on the new index.
				If you go index out of bound which is below 0 in this case then simply don't move.
				Turn the current index red, and turn anything after the current index blue.

			*/

			if (self.indexSelected - 8 > -1) { // if after subtracting 8 the index doesn't go below -1 then substract

				self.indexSelected -= 8;

				if (self.contents[self.indexSelected].constructor === FileIcon) {
					

				} else {



				}



			}



		} else if (event.which === 40) { // down

			event.preventDefault(); // to prevent default browser movement which is in this case to move the scroll bar down


			/*
				Each row can hold 8 items, so which ever index you are in the contents array
				you should always increase 8 from your current index to be on the new index.
				If you go index out of boudns which will be over the length - 1 index of the
				current contents arraay then you simply don't move.
				Turn the current index red, and turn anything before the current index blue.

			*/

			if (self.indexSelected + 8 < self.contents.length - 1) { // if after adding the index doesn't go above length - 1 then add

				self.indexSelected += 8;

				if (self.contents[self.indexSelected].constructor === FileIcon) {


				} else {


					
				}



			}



		}


	}

	// back space event handler
	backSpace(event, self) {
		// event that handles backspace, which is basically when you hit backspace you go back to the
		// previous working directory by shorting the path and sending an ajax request

		// we want to check for another thing besides the keycode 16, hence it is a second check
		// if path.get === "./src/user-fs/" + $("#username").text() + "/", then we are at the root directory
		// and we cannot go back further then that!
		if (event.which === 8 && self.path.get !== "./src/user-fs/" + $("#username").text() + "/") {
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

	// attaches file event handler
	// the idea is to loop over the contents array and turn on the the file icon provided
	// and turn off the file icon not provided
	attachIconEH(icon) {
		this.singleClick(icon);
		this.doubleClick(icon);
	}

	singleClick(icon) {
		var self = this; // this in each scope is different in JavaScript
		/* Single click on the icon, deals with both file icons and folder icons */
		// on click the color of the highlight changes
		$("#" + icon.id).on("click", function () {		
			// each file icon has an event handler which loops through the all the file icons
			// then checks if the click is on the current icon and if the icon is not
			// selected then go ahead and select it
			// else unselect all other icons by making them blue and unselecting it
			// each iteration will either be the fileIcon clicked or all other icons
			for (var i = 0; i < self.contents.length; ++i) {
				// both these expression need to be true in order for the entire entire statement to be true
				// which makes sense as we want the current element in the array to be the icon we clicked
				// AND we have to make sure that the element in the array is not selected, because if it is not selected
				// only then can we select it, we can't select something that is unselected
				if (self.contents[i] === icon && !self.contents[i].selected) { // red - selected
					if (self.contents[i].constructor === FileIcon) {
						$("#" + self.contents[i].id).css("background-image", "url(public/images/file-4.png)");
					} else { // else it is a folder icon
						$("#" + self.contents[i].id).css("background-image", "url(public/images/folder-2.png)")
					}
					self.contents[i].selected = true;
					self.globalClick = true; // turns on the drop zone event handlers job to do its thing
					self.counter = 0; // prevents an activated global click from deactivating current marked red window
									 // while switching between two tiles (this is mandatory as the global event is fired immediently after a click
									 // it happens simultaneously! )
					self.indexSelected = i + 1; // set the indexSelected to current index
					self.selected = self.contents[i];
				} else { // blue - unselected
					if (self.contents[i].constructor === FileIcon) { // checks if the array file is a fileIcon
						$("#" + self.contents[i].id).css("background-image", "url(public/images/file-3.png)");
					} else { // else it is a folder icon
						$("#" + self.contents[i].id).css("background-image", "url(public/images/folder.png)");	
					}
					self.contents[i].selected = false; // turns the boolean false indicating it has been unselected
				}
			}
		});
	}

	doubleClick(icon) {
		var self = this;
		/* Double click on the icon, deals with only folder icons */
		// a check is made to make sure this behaviour is not generated for Icons that are not
		// folder icons, double clicks should only work folder icons for now
		if (icon.constructor !== FileIcon) {
			$("#" + icon.id).on("dblclick", function() {
	
				// the path needs to be extended as we are now visiting a new folder
				self.path.extend(icon.name);
	
				// now we need to remove all the current contents from the drop zone
				// and get the conents inside the folder that we just double clicked

				// make request object which encapsulates the path for the server to query

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
		// needs to be stored in a variable because in a for loop the length
		// gets calculated each time, and we don't want that, we want to pop for a fix number
		// of times, the value of i gets messed up as i does become greater than this.contents.size()
		// at one point even the the elements have not been popped off
		var size = this.contents.length;

		for (var i = 0; i < size; ++i) {
			// killing two birds with one exression, pop returns the element that is being removed
			// from the array
			$("#wrapper-" + this.contents.pop().id).remove();
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
					// checks if the object type if of FileIcon
					if (self.contents[i].constructor === FileIcon) {
						$("#" + self.contents[i].id).css("background-image", "url(public/images/file-3.png");
						// also needs to turn off the selected boolean which is indicating that it is currently turned on			
					} else { // else it is a folder icon
						$("#" + self.contents[i].id).css("background-image", "url(public/images/folder.png)");
					}
					self.contents[i].selected = false; // unselects by turning the select boolean of each icon false	
				}
				self.selected = null; // reset the selected variable to null as nothing is selected anymore
				self.counter = 0;
				self.globalClick = false;
				self.indexSelected = 0; // on a neutrailizing global click the indexSelected is reset to 0, and next strike of key will allow us to start from the beginning
			} 		
			else if (self.globalClick) { // this check, checks only if first check is not fulfilled, if globalClick gets turned on
				++self.counter; // then we simply increment the counter so that if another drop zone click is made we can loop through the
								// entire contents and unselect them!
			} 
		});

	}

}