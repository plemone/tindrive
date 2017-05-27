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

		this.table = [[]]; // table containing a single row, and will contain multiple rows, each represented by an array inside the table

		this.row = 0; // maintaings the index of rows in the table

		this.i = 0; // index is basically the index of the rowth array of the table

	}

	// takes in a content and adds it to the table
	add(content) {	
		// if this.i === 8, it means we have exceeded the number of elements we are allowed in that row, as upto index 7 it is only valid anything beyond that means add new row
		if (this.i === 8) {
			this.i = 0; // we reset the i, as we will be creating a new row
			++this.row; // row gets increased as we are creating a new row in the table
			this.table.push([]) // this line creates a new empty row and adds it to the table
		}

		this.table[this.row].push(content); // pushes the content to the latest row in the table

		++this.i; // increments i as we just added a content to the row array
	}

	// takes in a content by value and tries to match that content in the table and removes it
	remove(content) {



	}

	// removes last entry form the table and returns it
	removeLast() {




	}


	size() {
		var size = 0;
		for (var i = 0; i < table.lenght; ++i) {
			for (var j = 0; j < table[i].length; ++j) {
				++size; // increment the size for the number of elements in the table
			}
		}
		return size;
	}


	get(row, i) {
		return table[row][i]; // returns the ith element in the provided row
	}

	getRows() {
		return this.row; // returns the number of rows in the table
	}

	getCurrentIndexInRow() {
		return this.i; // returns current index in a row
	}

	at() {
		return {r: this.row, i: this.i};
	}


}