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
		this.contents = []; // contains a collection of conents being added to the window
	}

	create() {



	}

	addFile(filename) {
		var file = new FileIcon(filename, this.x, this.y);
		this.contents.push(file); // push the fileIcon to the content array
		file.create();
		this.attachFileIconEH(file);
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
				if (self.contents[i] === fileIcon && !self.contents[i].selected) {
					// red - select
					$("#" + self.contents[i].id).css("background-image", "url(static/imgs/file-4.png)");
					self.contents[i].selected = true;
				} else {
					// blue - unselect
					$("#" + self.contents[i].id).css("background-image", "url(static/imgs/file-3.png)");
					self.contents[i].selected = false;
				}
			}
		});
	}

}


/*
	if (fileIcon.selected) { // blue
		$(id).css("background-image", "url(static/imgs/file-3.png)");
		fileIcon.selected = false; // unselects when you click it again
	} else { // red
		$(id).css("background-image", "url(static/imgs/file-4.png)");
		fileIcon.selected = true; // selected is true when you click it
	}

*/