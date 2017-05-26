'use strict';

/*
	Databastructure containing the file icons in the browser.

	Contents must be a 2-D array, representing a table.
	
	[[], [], []] for example.

	Each element in the array will be a row of files, with a max size of 8, if a size of
	8 is reached and the 9th element is about to be added, we simply make a new row in other words
	we make another array and push it to our array

*/		


class Table {

	constructor() {

		this.table = [[]];

		this.row = 0; // maintaings the index of rows in the table


	}


}