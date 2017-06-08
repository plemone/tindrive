/*
Author: Md. Tanvir Islam
*/

$(document).ready(function() {
	main();
});

function main() {
	// an array of positions that the logo can be placed within
	var positions = ["top-left", "top-right", "bottom-left", "bottom-right"];
	var loginRegistrationComponent = new LoginRegistration();
	// When construct the logo component object we specify which position the logo will be placed on
	// from the array of positions we simply pick a random index within the range of the array and
	// place the logo on the randomness of the index pick which can be anything from top-left, top-right,
	// bottom-left or event bottom-right. We must make sure to round the number and the range has to be within
	// 0 to 3 as we have 4 elements in the array. Thats why we multiply it by 3.
	var logoComponent = new Logo(positions[Math.round(Math.random() * 3)]);
	loginRegistrationComponent.create();	
	logoComponent.create();
}
