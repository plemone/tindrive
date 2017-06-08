/*
Author: Md. Tanvir Islam
*/

$(document).ready(function() {
	main();
});

function main() {
	var mainComponent = new LoginRegistration();
	var logoComponent = new Logo();
	logoComponent.create();
	mainComponent.create();
}
