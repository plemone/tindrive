'use strict'; // to enable ES6 syntax


class Logo {

	constructor(position) {
		this.id = "#logo";
		this.element = "<div id = logo> <img id = akatsuki src = public/images/logo.png></img> <h2 id = logoName> TinDrive </h2></div>"
		// the position at which the logo will appear
		// can be top left top right, bottom left and bottom right
		this.position = position;
	}

	create() {
		$("body").append(this.element);
		this.generateCSS();
	}

	generateCSS() {
		var containerId = "#logo";
		var iId = "#akatsuki";
		var nId = "#logoName";
		$(iId).css("position", "relative");
		$(iId).css("width", 80);
		$(iId).css("height", 80);
		$(nId).css("color", "white");
		$(nId).css("position", "relative");
		$(nId).css("top", -30);
		$(containerId).css("position", "absolute");

		if (this.position === "top-left") { // if the user specified the position to be top-left then the logo will apear on the top left

			$(containerId).css("left", "2%");

			
		} else if (this.position === "top-right") { // if not top-left then the next thing to check is if the user specified the position to be top-right then the logo will apear on the top right

			$(containerId).css("left", "92%");

		} else if (this.position === "bottom-left") { // if not top-left or top-right then the next thing to check is if the user specified the position to be bottom-left

			$(containerId).css("left", "2%");
			$(containerId).css("top", 650);

		} else { // if none of the checks match above this statement then the user must have specified it to be bottom right

			$(containerId).css("left", "92%");
			$(containerId).css("top", 650);
		}

		$(containerId).css("width", 100);
		$(containerId).css("height", 100);
		$(containerId).css("clear", "both");

	}

}