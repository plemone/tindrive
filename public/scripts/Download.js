'use strict' // ES6 syntax support

class Download {

	constructor() {
		this.x = 890; // contains x coordinate
		this.y = -570; // contains y ccoordinate
		this.width = 43; // width of the button
		this.height = 33; // height of the button
		this.id = "#download"; // id of the object
		this.element = "<div id = download></div>"; // contains the DOM information
		this.background = "url(public/images/download-2.png)"; // background image
		this.changeBackground = "url(public/images/download-1.png)"; // the image which background image changes to on hover
		this.contents = []; // contains the contents that need to be downloaded
	}

	create() {
		$("#main-div").append(this.element);
		this.generateCSS();
		this.attachEH();
	}

	attachEH() {
		var self = this;
		$(this.id).on("mouseover", function() {
			$(self.id).css("background-image", self.changeBackground);
		});

		$(this.id).on("mouseout", function() {
			$(self.id).css("background-image", self.background);
		});

		$(this.id).on("click", function(event) {
			for (var i = 0; i < self.contents.length; ++i) {
				console.log(self.contents[i]);
			}
		});
	}

	// the following method is a setter for the contents attribute
	add(content) {
		this.contents.push(content); // pushes the content received through the param to the contents array
	}

	remove(content) {
		// loops over the contents array and tries to match content provided with the content in the contents array
		for (var i = 0; i < this.contents.length; ++i) {
			// if content is found then remove
			if (content.name === this.contents[i].name) {
				// splice permanently changes the index
				this.contents.splice(i, 1); // remove 1 element at index i
				return; // ends the function and breaks out of the loop
			}
		}

	}

	empty() {
		this.contents = [];
	}

	generateCSS() {
		var id = this.id;				
		$(id).css("background-image", this.background);
		$(id).css("background-repeat", "no-repeat");
		$(id).css("background-size", "contain");
		$(id).css("background-position", "center");
		$(id).css("position", "relative");
		$(id).css("border-radius", "80%");
		$(id).css("border", "0"); // removes the black outline on click
		$(id).css("outline", "none");
		$(id).css("cursor", "pointer");
		$(id).css("top", this.y);
		$(id).css("left", this.x);
		$(id).css("width", this.width);
		$(id).css("height", this.height);
	}


}
