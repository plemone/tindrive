'use strict';

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
		this.width = 80; // width of the file icon
		this.height = 60; // height of the file icon
		this.selected = false;
	}

	generateId() {
		// adds file to the x and y coordinates
		var id = "";
		var i = 0;
		// both these expression need to be true for the entire while loop to be true
		// either of these expression being false will result the entire while loop to be false
		while (this.name[i] !== "." && i !== this.name.length) {
			id += this.name[i];
			++i;
		}
		return id;
	}

}