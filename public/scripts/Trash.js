'use strict'; // explicit use of the ES6 syntax

class Trash {

	constructor() {
		this.x = 860; // contains x coordinate
		this.y = -280; // contains y ccoordinate
		this.width = 100; // width of the button
		this.height = 70; // height of the button
		this.name = "trash-folder";
		this.id = "#" + this.name; // id of the object
		this.descriptionId = "#" + this.name + "-description"; // unique description id is needed for each component that inherits this abstract class
		this.element = "<div id = " + this.name + "></div>"; // contains the DOM information
	}

	create() { // allow it to take a list of functions that it can call upon creation as well!
		$("#main-div").append(this.element);
		this.generateCSS();
		this.attachEH();
	}

	attachEH(clickAction) {
		var self = this;

		// this event is responsible for when a button is being pressed, as the button is being pressed
		// you can change the design to make it look like its being pressed
		$(this.id).on("mousedown", function() {
			$(self.id).css("bottom", "-4px"); // lifts the div up a little on mouse down
			$(self.id).css("box-shadow", "0 -1px 0 #00823F"); // decreases the size of the shadow on mouse down, these two effects make it look like the button is being pressed
		});

		// this event is the opposite of mousedown, when the button gets released this event is fired, also
		// change some css to make it look like button is being released, or simply revert back to the old style upon release
		$(this.id).on("mouseup", function() {
			$(self.id).css("box-shadow", "0 -4px 2px -2px gray"); // shadow of the box on focus
			$(self.id).css("bottom", "+4px"); // moves the positiion back to normal on focus

		});

	}

	generateCSS() {
		var id = this.id;	
		var p = this.descriptionId;			
		$(id).css("position", "relative");
		$(id).css("top", this.y);
		$(id).css("left", this.x);
		$(id).css("background-image", "url(public/images/trash-2.png)");
		$(id).css("background-repeat", "no-repeat");
		$(id).css("background-size", "30%");
		$(id).css("background-position", "center");
		$(id).css("border-radius", "100%");
		$(id).css("font-size", "105%");
		$(id).css("text-align", "center");
		$(id).css("width", this.width);
		$(id).css("height", this.height);		
		$(id).css("cursor", "pointer");
		$(id).css("box-shadow", "0 -4px 2px -2px gray");	
		$(p).css("position", "relative");
		$(p).css("top", "10px");
		$(p).css("color", "#262626"); // same color as the background
		$(p).css("text-shadow", "1px 1px 1px white"); //text-shadow: h-shadow v-shadow blur-radius color|none|initial|inherit;
	}

}