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

	// in the comments below assume that maxRowLength is 8
	constructor(maxRowLength) {

		this.maxRowLength = maxRowLength;

		this.table = [[]]; // table containing a single row, and will contain multiple rows, each represented by an array inside the table

		this.row = 0; // maintaings the index of rows in the table

		this.i = -1; // i essentially keeps track of the index of the array of the rowth array, therefore at start it needs to be -1, as soon as something gets added we increment i! meaning on initial start when something gets added i is 0, indicating that the element's current index is 0

	}

	// takes in a content and adds it to the table
	add(content) {	
		// remember after we push an element to the array the index gets incremented, so if we are at 7 now
		// it means that we have pushed something is suppose to be at the 7th element! therefore our next push
		// should be on the next row and on the 0th index, thats why we do this.maxRowLength - 1, which is 8 - 1 = 7 for our example
		if (this.i === this.maxRowLength - 1) {
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
			this.i = this.maxRowLength - 1; // we make the i 7th again so that it referes to the last index in the new row
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


	// want to basically get the list at index i, but the i should be in terms of a single list not the multidimensional list
	/*
		
		Very cool algorithm, we are about to experience, so this is what the array might look like:

			[
		0	 [0, 1, 2, 3, 4, 5, 6, 7],
		1	 [8, 9, 10, 11, 12, 13, 14, 15],
		2	 [16, 17, 18, 19, 20, 21, 22, 23],
		3	 [24, 25, 26, 27, 28, 29, 30, 31],
			]

		Array that we mimicing = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

		The table above contains 32 elements, with 4 rows, 4 * 8 = 32.

		Now to achieve our goal the intuition is to use mod. And our intuition
		is correct.

		17 mod 8 = 1, 26 mod 8 = 2, 5 mod 8 = 5.

		From the couple of mods above you can clearly see how our intuition works out, so thats
		what the index of each row will be basically mod by the length of the row array.

		Now what is the row number then?

		Row number is basically the number divided by the length of the rowth array which in our example is
		8. So lets prove it:

		17 / 8 = 2.125, 31 / 8 = 3.875, 10 / 8 = 1.25.

		But wait 31 / 8 is 3.875, does that mean the index is 4? No, we simply do Math.floor(); which is basically
		a rounded off to a floor so if something is 3.9999, it will be floor rounded off to 3. This is known as rounding down.  
	*/
	get(i) {

		var index = i % this.maxRowLength; // same as example above 17 mod 8 = 1
		var row = Math.floor(i / this.maxRowLength); // same as example above 17 / 8 = 2.125 -> Math.floor(2.125)

		return this.table[row][index];

	}

	// returns the element in the table for a specific row and index of the row
	getAt(r, i) {
		return this.table[r][i];
	}

	// returns a row array from the table for a specific row number
	getRowAt(r) {
		return this.table[r];
	}

	// returns the maximum index in a row
	rowSize(r) {
		return this.table[r].length; // returns the size of a given row with the index provided 
	}


	// translate the table index into module index (made up index)
	translateIndex(row, index) {
		/*
			so basically to translate normal indexes into modulo index
			we need to take the row we are at and the index we are at that row
			and simply run a for loop for the row number of times and just add our maxLength or 8 in this case
			to the current index to find our position in the table interms of modulo index
		*/

		// don't confuse the for loop i with the index
		for (var i = 0; i < row; ++i) { // this row is the row provided through the parameter
			index += this.maxRowLength; // some maths was used here
		}

		return index;
	}

	// gets the index of the current row in the table where an element will be added to
	lastRowIndex() {
		return this.row; // returns the number of rows in the table
	}

	// gets the current index in the current row the table is going to insert
	getCurrentIndexInRow() {
		return this.i; // returns current index in a row
	}

	// returns the row and index
	at() {
		return {r: this.row, i: this.i};
	}


}

// uncomment to run test

// function test() {

// 	var t = new Table(8);

// 	for (var i = 0; i < 10; ++i) {
// 		t.add(i);
// 	}

// 	console.log(t);

// 	var size = t.size();

// 	console.log("size: " + size);

// 	console.log(t.get(7));

// 	for (var i = 0; i < size; ++i) {
// 		console.log(t.removeLast());
// 	}

// 	console.log(t);



// }



// function main() {

// 	test();

// }


// if (!module.parent) {
// 	main();
// }