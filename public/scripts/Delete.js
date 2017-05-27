'use strict' // to use ES6 syntax explicitly

class Delete extends UtilityButton {

	constructor() {
		super("delete");
		this.contents = [];
		this.functions = [function() {
			$(this.id).on("click", function() {
				for (var i = 0; i < this.contents.length; ++i) {
					console.log(this.contents[i]);
				}
			});
		}];		
	}

	add(content) {
		this.contents.push(content);
	}

	remove(content) {
		// loop over the contents array and try to match the name of the content with the content provided
		for (var i = 0; i < this.contents.length; ++i) {
			if(this.contents[i].name === content.name) {
				this.contents.splice(i, 1); // remove the elements starting from index i and remove 1 element
				return; // when element is found exit the function
			}
		}
	}


	empty() {
		this.contents = []; // empty out the contents array
	}


}