// Author: Md. Tanvir Islam

// create the user here

$(document).ready(function() {
	main();
});

function main() {
	var logoutComponent = new Logout();
	var dropBoxComponent = new DropBox();
	// when created the logo component will be placed on the bottom left
	var logoComponent = new Logo("bottom-left");
	logoutComponent.create();
	dropBoxComponent.create();
	logoComponent.create();
}


