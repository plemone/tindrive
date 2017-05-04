// Author: Md. Tanvir Islam

// create the user here

$(document).ready(function() {
	main();
});


function main() {

	var logoutButton = new Logout();
	logoutButton.init();
}


class Logout {

	init() {
		$("body").append("<div id = logout></div>");
	}

	generateCSS() {
		$("#logout").css("position", "relative");
		$("#logout").css("backgroud-image", "url(static/imgs/cloud-3.png)");
		$("#logout").css("background-repeat", "no-repeat");
		$("#logout").css("background-size", "contain");
		$("#logout").css("cursor", "pointer");
	}


}


