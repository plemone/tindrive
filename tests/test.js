'use strict'


function main() {

	var i = 0; 


	function anonymous() {

		console.log(i);

		var i = 44;

	}

	anonymous();


}

if (!module.parent) {
	main();
}