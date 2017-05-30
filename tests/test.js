'use strict'

function recursiveUpdate() {

	setTimeout(function() {

		console.log("Backing data...");

		recursiveUpdate();

	}, 1000);

	return;
}


function main() {

	recursiveUpdate();

	for (var i = 0; i < 1000; ++i) {
		if (i % 100 === 0) { // if i i divisible by 10000 it means i is greater than 10000, and as each 0 gets added to 10000, we will print the following out!
			console.log("printing stuff for the " + i + "th time!");
		}
	}


}

if (!module.parent) {
	main();
}