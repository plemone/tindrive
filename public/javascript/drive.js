// Author: Md. Tanvir Islam

// create the user here

$(document).ready(function() {
	main();
});

function main() {
	var logoutComponent = new Logout();
	var dropBoxComponent = new DropBox();
	logoutComponent.create();
	dropBoxComponent.create();
}


