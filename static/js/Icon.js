'use strict';

// abstract Icon class which gets inherited by FileIcon class and FolderIcon class
class Icon {

	constructor(filename, x, y) {
		// this disallows the construction of Icon objects, that means
		// Icon class is abstract!
		if (this.constructor === Icon) {
			throw Error("Abstract class cannot be constructed");
		}

		this.name = filename;
		this.x = x; // x axis positioning, div gets drawn using these
		this.y = y; // y axis positioning, div gets drawn using these
		this.id = this.generateId();				
		this.width = 75; // width of the file icon
		this.height = 60; // height of the file icon
		this.selected = false;
		this.background = "";
		this.dropZoneId = "#dnd";
	}

	create() {
		$(this.dropZoneId).append("<div id = " + "wrapper-" + this.id + "><div class = icon id = " + this.id + "></div><p id = " + "p-" + this.id + ">" + this.name + "</p></div>");
		this.generateCSS();
	}	

	generateId() {
		// adds file to the x and y coordinates
		var id = "";
		var i = 0;
		// both these expression need to be true for the entire while loop to be true
		// either of these expression being false will result the entire while loop to be false
		while (this.name[i] !== "." && i !== this.name.length) {
			// now if this.name[i] contains a space its a problem for jquery to target
			// the dom element with id's which contain spaces in them, to fix that we simply
			// have to replace the spaces with a "-"
			// so if an id was "i am an id" it will change to "i-am-an-id"
			// since the id is saved inside each object accessing each object's id to attach
			// the event handler on creation will do the trick
			if (this.name[i] === " ") {
				id += "-";
			} else {
				id += this.name[i];
			}
			++i;
		}
		return id;
	}

	generateCSS() {
		var id = "#" + this.id;
		var wrapper = "#wrapper-" + this.id; 
		var p = "#p-" + this.id;
		$(id).css("position", "relative");
		$(id).css("left", this.x.toString());
		$(id).css("top", this.y.toString());
		$(id).css("width", this.width.toString()); // width of the icon
		$(id).css("height",	this.height.toString()); // height of the icon
		$(id).css("background-image", this.background);
		$(id).css("background-repeat", "no-repeat");
		$(id).css("background-size", "contain");
		$(wrapper).css("float", "left"); // stacks divs up next to each other
		$(wrapper).css("width", (this.width + 25).toString()); // width of the wrapper
		$(wrapper).css("height", (this.height + 25).toString()); // width of the height
		$(wrapper).css("text-align", "center"); // aligns all the contained text withing the div to be centered
		$(p).css("font-size", "80%"); // the font size of the paragraph containing the file name
		$(p).css("word-wrap", "break-word"); // breaks long lined words
	}


}