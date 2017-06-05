'use strict'


function main() {

	var pixels = [];

	// loop responsible for creating row arrays of a table
	for (var i = 0; i < 800; ++i) {

		var row = [];

		// loop responsible for populating elements in a row array of a table
		for (var j = 0; j < 800; ++j) {

			var colors = [];
	
			// loop responsible for populating each array of colors for each element in a particular row array of a table			
			for (var k = 0; k < 3; ++k) {


				colors.push(Math.random());


			}

			row.push(colors);


		}

		pixels.push(row);

	}
	// gives time in milliseconds
	var start = new Date();



	for (var x = 0; x < 414; ++x) {
		// loops over each row in a table
		for (var i = 0; i < 800; ++i) {

			// loops over each element in a row array of a table
			for (var j = 0; j < 800; ++j) {

				// loops over each element in each row array element of a table
				for (var k = 0; k < 3; ++k) {



				}

			}

		}
	}


	// gives time in milliseconds
	var end = new Date();


	// 1000 milliseconds make 1 second
	var final = (end - start) / 1000;



	console.log("Time elapsed -> " + final);


}

if (!module.parent) {
	main();
}