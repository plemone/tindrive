'use strict'; // to enable ES6 syntax


class Logo {

	constructor() {
		this.id = "#logo";
		this.element = "<div id = logo> <img id = akatsuki src = public/images/logo.png></img> <h2 id = logoName> TinDrive </h2></div>"
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
		$(containerId).css("position", "relative");
		$(containerId).css("left", "92%");
		$(containerId).css("width", 100);
		$(containerId).css("height", 100);

	}

}