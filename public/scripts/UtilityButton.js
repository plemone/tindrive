'use strict' // to enable heavy use of ES6 syntax

class UtilityButton {

	constructor(name) {
		// this disallows the construction of the Icon objects, that means the class is abstract!
		if (this.constructor === UtilityButton) {
			throw Error("Abstract class cannot be constructed");
		}

		this.x = 827; // contains x coordinate
		this.y = -600; // contains y ccoordinate
		this.width = 174; // width of the button
		this.height = 45; // height of the button
		this.id = "#" + name; // id of the object
		this.descriptionId = "#" + name + "-description"; // unique description id is needed for each component that inherits this abstract class
		this.element = "<div id = " + name + "><h4 id = " + name + "-description >" + name + "</h4></div>"; // contains the DOM information
		this.functions = []; // stores an array of functions that gets iterated and called when the create() method is invoked
	}

	create() { // allow it to take a list of functions that it can call upon creation as well!
		$("#main-div").append(this.element);
		this.generateCSS();
		this.attachEH();
		for (var i = 0; i < this.functions.length; ++i) {
			this.functions[i](); // fires the functions stored in the functions array
		}
	}

	attachEH(clickAction) {
		var self = this;

		$(this.id).on("click", function() {
			for (var i = 0; i < self.contents.length; ++i) {
				console.log(self.contents[i]);
			}
		});

		$(this.id).on("mouseover", function() {

			$(self.descriptionId).css("color", "#4f6a96"); // color of the text becomes white
			//text-shadow: h-shadow v-shadow blur-radius color|none|initial|inherit;
			$(self.descriptionId).css("text-shadow", "1px 1px 1px white"); // border becomes black
		
		});

		$(this.id).on("mouseout", function() {

			$(self.descriptionId).css("color", "#262626"); // color of the text becomes black
			//text-shadow: h-shadow v-shadow blur-radius color|none|initial|inherit;
			$(self.descriptionId).css("text-shadow", "1px 1px 1px white"); // border becomes white
		
		}); 

		// this event is responsible for when a button is being pressed, as the button is being pressed
		// you can change the design to make it look like its being pressed
		$(this.id).on("mousedown", function() {
			$(self.id).css("bottom", "-4px"); // lifts the div up a little on mouse down
			$(self.id).css("box-shadow", "0 1px 0 #00823F"); // decreases the size of the shadow on mouse down, these two effects make it look like the button is being pressed
		});

		// this event is the opposite of mousedown, when the button gets released this event is fired, also
		// change some css to make it look like button is being released, or simply revert back to the old style upon release
		$(this.id).on("mouseup", function() {
			$(self.id).css("box-shadow", "0 4px 2px -2px gray"); // shadow of the box on focus
			$(self.id).css("bottom", "+4px"); // moves the positiion back to normal on focus

		});

	}

	generateCSS() {
		var id = this.id;	
		var p = this.descriptionId;			
		$(id).css("position", "relative");
		$(id).css("top", this.y);
		$(id).css("left", this.x);
		$(id).css("font-size", "105%");
		$(id).css("text-align", "center");
		$(id).css("width", this.width);
		$(id).css("height", this.height);		
		$(id).css("cursor", "pointer");
		$(id).css("box-shadow", "0 4px 2px -2px gray");		
		$(p).css("position", "relative");
		$(p).css("top", "10px");
		$(p).css("color", "#262626"); // same color as the background
		$(p).css("text-shadow", "1px 1px 1px white"); //text-shadow: h-shadow v-shadow blur-radius color|none|initial|inherit;
	}


}