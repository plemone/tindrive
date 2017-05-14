
class FileIcon {

	constructor(filename, x, y) {
		this.name = filename;
		this.x = x; // x axis positioning, div gets drawn using these
		this.y = y; // y axis positioning, div gets drawn using these
		
	}

	create() {
		$("#dnd").append("<div id = " + this.filename + "></div>");
		this.generateCSS();
	}

	generateCSS() {
		var id = this.filename;

		$(id).css("left", this.y.toString());
		$(id).css("top", this.x.toString());

	}


}