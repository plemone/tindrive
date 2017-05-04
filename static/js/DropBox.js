// pickup here where you left off!

class DropBox {
	init() {
		$("body").append("<div id = main-div></div");
		this.generateCSS();
	}
	generateCSS() {
		var id = "#main-div";
		$(id).css("position", "relative");
		$(id).css("height", "600px");
		$(id).css("width", "1000px");
		$(id).css("left", "280px");
		$(id).css("bottom", "20px");
		$(id).css("border", "white");
		$(id).css("background", "white");
		$(id).css("border-radius", "2%")
	}
}

