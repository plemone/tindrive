'use strict' // ES6 syntax support

class Download {

	constructor() {
		this.x = 890; // contains x coordinate
		this.y = -594; // contains y ccoordinate
		this.width = 40; // width of the button
		this.height = 30; // height of the button
		this.id = "#download"; // id of the object
		this.element = "<button id = download></button>"; // contains the DOM information
		this.background = "url(public/images/download-1.png)"; // background image
		this.changeBackground = "url(public/images/download-2.png)"; // the image which background image changes to on hover
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

			$(self.id).css("background-image", self.changeBackground);

		});

		$(this.id).on("mouseout", function() {
			$(self.id).css("background-image", self.background);
		});

		$(this.id).on("click", function() {


		});
	}

	// the following method is a setter for the contents attribute
	setContents() {


	}


	generateCSS() {
		var id = this.id;				
		$(id).css("background-image", this.background);
		$(id).css("background-repeat", "no-repeat");
		$(id).css("background-size", "contain");
		$(id).css("background-position", "center");
		$(id).css("position", "relative");
		$(id).css("border-radius", "80%");
		$(id).css("top", this.y);
		$(id).css("left", this.x);
		$(id).css("width", this.width);
		$(id).css("height", this.height);
	}


}
