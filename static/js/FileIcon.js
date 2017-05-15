
class FileIcon {

	constructor(filename, x, y) {
		this.name = filename;
		this.id = this.generateId();
		this.x = x; // x axis positioning, div gets drawn using these
		this.y = y; // y axis positioning, div gets drawn using these
		this.width = 80;
		this.height = 60;
		this.clickCounter = 1; // needs to be 1 as it only lights up when the number is odd
							   // so if initially its not odd then clicking it first won't light it
							   // up, however second click will
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
		$("#dnd").append("<div id = " + "wrapper-" + this.id + "><div id = " + this.id + "></div><p id = " + "p-" + this.id + ">" + this.name + "</p></div>");
		this.generateCSS();
		this.attachEventHandlers();
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

	attachEventHandlers() {
		var self = this;
		var id = "#" + this.id;
		// on click the color the highlight color changes 
		$(id).on("click", function() {
			if (self.clickCounter % 2 == 0) {
				$(id).css("background-image", "url(static/imgs/file-3.png)");
			} else {
				$(id).css("background-image", "url(static/imgs/file-4.png)");
			}
			++self.clickCounter;
			console.log("clicked!");
		});

		$(id).on("dblclick", function() {
			console.log("double-clicked!");
		
		});


	}

}