// Author: Md. Tanvir Islam

// create the user here

$(document).ready(function() {
	main();
});


function main() {
	var logoutButton = new Logout();
	var dragDrop = new DropBox();
	logoutButton.create();
	dragDrop.create();
}


