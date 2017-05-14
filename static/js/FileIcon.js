
class FileIcon {

	constructor(filename, x, y) {
		this.name = filename;
		this.id = this.generateId();
		this.x = x; // x axis positioning, div gets drawn using these
		this.y = y; // y axis positioning, div gets drawn using these
		this.width = 60;
		this.height = 60;
		
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

	create() {
		$("#dnd").append("<div id = " + this.id + "></div>");
		this.generateCSS();
	}

	generateCSS() {
		var id = "#" + this.id;
		console.log(id);
		$(id).css("position", "relative");
		$(id).css("left", this.x.toString());
		$(id).css("top", this.y.toString());
		$(id).css("width", this.width.toString());
		$(id).css("height",	this.height.toString());
		$(id).css("border", "1px solid black");
		$(id).css("background-image", "url(static/imgs/file-2.png)");
		$(id).css("background-repeat", "no-repeat");
		$(id).css("background-size", "contain");
		$(id).css("float", "left"); // stacks divs up next to each other
	
	}
}