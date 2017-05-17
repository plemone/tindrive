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
		this.globalClick = false; // this keeps track of whether the drop zone click should make all the files blue or not, if it is true then
								  // then the counter will be incremented
		this.counter = 0;		 // only if the counter is greater than 0 the click event handler will loop through everything and unselect and selected file
							     // and turn the color of the file from red to blue
		this.dropZoneId = "#dnd";
		this.keyStack = [];
	}

	create() {
		this.attachGlobalClickEH();
		this.attachFolderEH();
	}

	// adds a file icon to the DOM
	addFile(fObj) {
		// a check to see if file with a similar name exists or not
		for (var i = 0; i < this.contents.length; ++i) {
			if (this.contents[i].name === fObj.name) {
				alert("File with that name already exists!");
				return;
			}
		}

		var file = new FileIcon(fObj.name, this.x, this.y);
		file.create(); // create the file icon components
		this.contents.push(file); // push the fileIcon to the content array
		this.attachIconEH(file); // attach the event handler of the file

		// make ajax request to the server 

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
	upload(file) { // requests the server to upload the file
		var reader = new FileReader();
		// call back function, which means it is the last thing to get executed
		reader.onload = function(event) {
			var txt = reader.result; // returns the result of the callback, on ready state 4 of the reader async function
			// p element with the id, "#username" contains the user name
			var u = "/" + $("#username").text() + "/" + "uploadFiles";
			var requestObj = {}	
			// fill in the contents of the object with file informations		
			requestObj.name = file.name;
			requestObj.lastModified = file.lastModified;
			requestObj.size = file.size;
			requestObj.type = file.type;
			requestObj.contents = txt;
			// make the ajax request
			requestObj = JSON.stringify(requestObj);
			$.ajax({
				url: u,
				type: "POST",
				data: requestObj
			})
		}
		reader.readAsText(file); // calls the reader.onload function
	}


	addFolder(folderName) {
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

	}


	// on keydown push the keycodde 16 to the stack
	// on keyup if the key is 78 then push it to the stack and then the next
	// instruction is to check if the first and second index is either 16 and 78 or 78 and 16
	// then inside the if statement prompt the user, after the prompt in next instruction
	// simply loop over the array and clear the array
	// the array will get cleared no matter what key up you make, but remember only the
	// right combination will trigger the prompt 
	attachFolderEH() {

		var self = this;

		// checks if the keycode is 16 which is shift on keydown
		// also checks if the keycode is 78 which is n on key up

		$(window).on("keydown", function(event) {
			// 16 for shift button
			if (event.which === 16) {
				self.keyStack.push(16);
			}

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

	// attaches file event handler
	// the idea is to loop over the contents array and turn on the the file icon provided
	// and turn off the file icon not provided
	attachIconEH(fileIcon) {
		var self = this; // this in each scope is different in JavaScript
		// on click the color of the highlight changes
		$("#" + fileIcon.id).on("click", function () {		
			// each file icon has an event handler which loops through the all the file icons
			// then checks if the click is on the current fileIcon and if the fileIcon is not
			// selected then go ahead and select it
			// else unselect all other fileIcons by making them blue and unselecting it
			// each iteration will either be the fileIcon clicked or all other fileIcons
			for (var i = 0; i < self.contents.length; ++i) {
				// both these expression need to be true in order for the entire entire statement to be true
				// which makes sense as we want the current element in the array to be the fileIcon we clicked
				// AND we have to make sure that the element in the array is not selected, because if it is not selected
				// only then can we select it, we can't select something that is unselected
				if (self.contents[i] === fileIcon && !self.contents[i].selected) {
					// red - select
					if (self.contents[i].constructor === FileIcon) {
						$("#" + self.contents[i].id).css("background-image", "url(static/imgs/file-4.png)");
					} else { // else it is a folder icon
						$("#" + self.contents[i].id).css("background-image", "url(static/imgs/folder-2.png)")
					}
					self.contents[i].selected = true;
					self.globalClick = true; // turns on the drop zone event handlers job to do its thing
					self.counter = 0; // prevents an activated global click from deactivating current marked red window
									 // while switching between two tiles (this is mandatory as the global event is fired immediently after a click
									 // it happens simultaneously! )
				} else {
					if (self.contents[i].constructor === FileIcon) { // checks if the array file is a fileIcon
						// blue - unselect
						$("#" + self.contents[i].id).css("background-image", "url(static/imgs/file-3.png)");
					} else { // else it is a folder icon
						$("#" + self.contents[i].id).css("background-image", "url(static/imgs/folder.png)");	
					}
					self.contents[i].selected = false; // turns the boolean false indicating it has been unselected
					
				}
			}
		});
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
						$("#" + self.contents[i].id).css("background-image", "url(static/imgs/file-3.png");
						// also needs to turn off the selected boolean which is indicating that it is currently turned on			
					} else { // else it is a folder icon
						$("#" + self.contents[i].id).css("background-image", "url(static/imgs/folder.png)");
					}
					self.contents[i].selected = false; // unselects by turning the select boolean of each icon false	
				}
				self.counter = 0;
				self.globalClick = false;
			} 		
			else if (self.globalClick) { // this check, checks only if first check is not fulfilled, if globalClick gets turned on
				++self.counter; // then we simply increment the counter so that if another drop zone click is made we can loop through the
								// entire contents and unselect them!
			} 
		});

	}

}