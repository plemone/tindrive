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

		this.i = -1; // i essentially keeps track of the index of the array of the rowth array, therefore at start it needs to be -1, as soon as something gets added we increment i! meaning on initial start when something gets added i is 0, indicating that the element's current index is 0

	}

	// takes in a content and adds it to the table
	add(content) {	
		// if this.i === 8, it means we have exceeded the number of elements we are allowed in that row, as upto index 7 it is only valid anything beyond that means add new row
		if (this.i === 7) {
			this.i = -1; // we reset the i, as we will be creating a new row, and when something is about to get added i will increase, so we are starting off at -1 agian
			++this.row; // row gets increased as we are creating a new row in the table
			this.table.push([]) // this line creates a new empty row and adds it to the table
		}

		this.table[this.row].push(content); // pushes the content to the latest row in the table

		++this.i; // increments i as we just added a content to the row array
	}

	// takes in a content by value and tries to match that content in the table and removes it
	remove(content) {



	}


	// takes in an object through the param and returns true if the object exists in the table, false if the object doesn't exist
	contains(content, comparison) { // takes in a function comparison, which does the comparison, depending on object to object, this function gets invoked inside contains

		// loops over each row in a table
		for (var i = 0; i < this.table.length; ++i) {

			// loops over each elements in a row 
			for (var j = 0; j < this.table[i].length; ++j) {
				if (comparison(content, this.table[i][j])) return true; // returns true if comparison returns true
			}
		}

		return false; // if we passed through all the loops then we haven't found any object which matches any element in the table


	}


	// removes last entry form the table and returns it
	removeLast() {

		if (this.i === -1) { // when this.i is -1, it means that we are currently out of elements in the current array
			this.table.splice(this.row, 1); // we have to remove the empty array as we are done removing each and every element from the array
			--this.row;
			this.i = 7; // we make the i 7th again so that it referes to the last index in the new row
		}

		var returnObject = this.table[this.row].pop(); // we pop the element from the latest array we are currently in the row

		--this.i; // decrease the i

		return returnObject;

	}


	size() {
		var size = 0;
		// loops over each row in the table
		for (var i = 0; i < this.table.length; ++i) {
			// loops over each element in a row
			for (var j = 0; j < this.table[i].length; ++j) {
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

// function test() {

// 	var t = new Table();

// 	for (var i = 0; i < 10; ++i) {
// 		t.add(i);
// 	}

// 	console.log(t);

// 	var size = t.size();

// 	console.log("size: " + size);

// 	for (var i = 0; i < size; ++i) {
// 		console.log(t.removeLast());
// 	}

// 	console.log(t);


// }



// function main() {

// 	test();

// }


// uncomment to run test

// if (!module.parent) {
// 	main();
// }