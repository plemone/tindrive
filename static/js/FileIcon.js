'use strict';

// FileIcon inherits Icon 
class FileIcon extends Icon {
	constructor(filename, x, y) {
		super(filename, x, y);
	}

	create() {
		$("#dnd").append("<div id = " + "wrapper-" + this.id + "><div class = files id = " + this.id + "></div><p id = " + "p-" + this.id + ">" + this.name + "</p></div>");
		this.generateCSS();
	}

	generateCSS() {
		var id = "#" + this.id;
		var wrapper = "#wrapper-" + this.id; 
		var p = "#p-" + this.id;
		$(id).css("position", "relative");
		$(id).css("left", this.x.toString());
		$(id).css("top", this.y.toString());
		$(id).css("width", this.width.toString()); // width of the file icon
		$(id).css("height",	this.height.toString()); // height of the file icon
		$(id).css("background-image", "url(static/imgs/file-3.png)");
		$(id).css("background-repeat", "no-repeat");
		$(id).css("background-size", "contain");
		$(wrapper).css("float", "left"); // stacks divs up next to each other
		$(wrapper).css("width", (this.width + 25).toString()); // width of the wrapper
		$(wrapper).css("height", (this.height + 25).toString()); // width of the height
		$(p).css("font-size", "70%");
		$(p).css("position", "relative");
		$(p).css("bottom", "4%");
		$(p).css("left", "10%");
	}


}