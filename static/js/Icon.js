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
				// absolutely random id is generated to avoid conflicts with similar named ids
				// needs to be rounded to ceiling as well as jquery doesn't like decimal values as ids
				var rand = (Math.ceil((Math.random() * Math.random() * Math.random() * 100)).toString() + Math.ceil((Math.random() * Math.random() * Math.random() * 100)).toString());
				id += rand;
			} else {
				id += this.name[i];
			}
			++i;
		}

		// alright now one last bit of check needs to be made, we can have a file with the same file name
		// but different extension and it is valid, so right now our ids can be duplicate as same file names
		// can have the same extension, so we just need to add the extension letters such as pdf, txt to our id to make it work

		++i; // as we want to avoid the dot so we skip over its index
		// if we have a file with no extension then it will generate an infinite loop
		// because something greater than something will never be equal to it, so we need to check for
		// while i smaller length as we also want to stop when i reaches length and not include the length index
		// as indexes start from 0

		// using <= instead of < would mean that you want to loop until <= stops being true which is
		// either less than qual to this.name.length or it is === this.name.length, so it will stop being
		// true only when it is greater than this.name.length, which ends up including the length th index
		// which is index out of bounds!
		while (i < this.name.length) {
			id += this.name[i++];	
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