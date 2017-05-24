'use strict'

function A(callBack) {
	console.log("Doing my usual A stuff");	
	callBack();	
}

function main() {
	A(function(name) {
		console.log("hello");
	});
}

if (!module.parent) {
	main();
}