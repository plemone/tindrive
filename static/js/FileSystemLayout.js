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
	}

	addFile(filename) {
		var file = new FileIcon(filename, this.x, this.y);
		file.create();
	}

}

// IMPLEMENT TOMMOROW!

/*

	var self = this; // this in each scope is different in javascript
					// I defied self to be this because I want to refer to the object this when in some nested scope
	var id = "#" + this.id;
	// on click the color the highlight color changes 
	
	$(id).on("click", function() {
		console.log(self.clickCounter);
		console.log("Click!");
		if (self.clickCounter % 2 === 0) { // turns blue
			$(id).css("background-image", "url(static/imgs/file-3.png)");
			
		} else { // turns red
			console.log("local -> " + id);
			$(id).css("background-image", "url(static/imgs/file-4.png)");		
			self.windowClicks(id); // global click event handler assigned								
		}
		++self.clickCounter;

	});


	$(id).on("dblclick", function() {





	
	});


*/

/*
		var self = this;
		self.globalCounter = 1;		
		$(window).on("click", function() {
			console.log("global -> " + id)
			++self.globalCounter; // when global counter hits 2 I switch everything back to blue as I kknow
								  // that atleast one file at the moment must be red
			if (self.globalCounter !== 2) {
				$(id).css("background-image", "url(static/imgs/file-3.png");
				$(window).off();
			}
		});

*/