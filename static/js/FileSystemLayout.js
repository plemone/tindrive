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
	addFile(filename) {
		var file = new FileIcon(filename, this.x, this.y);
		file.create(); // create the file icon components
		this.contents.push(file); // push the fileIcon to the content array
		this.attachFileIconEH(file); // attach the event handler of the file
	}


	attachFolderEH() {

		var self = this;

		// when you press the keydown it has to be made sure that key number 16
		// gets pushed to the stack, also a check is made if the array size is greater than or
		// equal to 2 then the stack gets emptied
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
	attachFileIconEH(fileIcon) {
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
					$("#" + self.contents[i].id).css("background-image", "url(static/imgs/file-4.png)");
					self.contents[i].selected = true;
					self.globalClick = true; // turns on the drop zone event handlers job to do its thing
					self.counter = 0; // prevents an activated global click from deactivating current marked red window
									 // while switching between two tiles (this is mandatory as the global event is fired immediently after a click
									 // it happens simultaneously! )
				} else {
					// blue - unselect
					$("#" + self.contents[i].id).css("background-image", "url(static/imgs/file-3.png)");
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
					$("#" + self.contents[i].id).css("background-image", "url(static/imgs/file-3.png");
					// also needs to turn off the selected boolean which is indicating that it is currently turned on
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