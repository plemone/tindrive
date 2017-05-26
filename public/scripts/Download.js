'use strict' // ES6 syntax support

class Download {

	constructor() {
		this.x = 827; // contains x coordinate
		this.y = -600; // contains y ccoordinate
		this.width = 174; // width of the button
		this.height = 45; // height of the button
		this.id = "#download"; // id of the object
		this.element = "<div id = download><p id = description >download</p></div>"; // contains the DOM information
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
			$(self.id).css("box-shadow", "0 4px 2px -2px gray");
		});


		$(this.id).on("mouseout", function() {
			$(self.id).css("box-shadow", "");
		});


		$(this.id).on("click", function() {
			for (var i = 0; i < self.contents.length; ++i) {
				console.log(self.contents[i]);
			}
		});


		// this event is responsible for when a button is being pressed, as the button is being pressed
		// you can change the design to make it look like its being pressed
		$(this.id).on("mousedown", function() {
			$(self.id).css("bottom", "-4px");
			$(self.id).css("box-shadow", "0 1px 0 #00823F");
		});

		// this event is the opposite of mousedown, when the button gets released this event is fired, also
		// change some css to make it look like button is being released, or simply revert back to the old style upon release
		$(this.id).on("mouseup", function() {
			$(self.id).css("box-shadow", "0 4px 2px -2px gray"); // shadow of the box on focus
			$(self.id).css("bottom", "+4px"); // moves the positiion back to normal on focus
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
		var p = "#description";			
		$(id).css("position", "relative");
		$(id).css("top", this.y);
		$(id).css("left", this.x);
		$(id).css("font-size", "105%");
		$(id).css("text-align", "center");
		$(id).css("width", this.width);
		$(id).css("height", this.height);
		$(id).css("cursor", "pointer");
		$(p).css("position", "relative");
		$(p).css("top", "10px");
		$(p).css("text-shadow", "1px 0 white, 0 0px black, 0px 0 black, 0 1px white");
	}


}
