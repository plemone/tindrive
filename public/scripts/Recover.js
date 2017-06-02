'use strict' // enables ES6 syntax for classes


class Recover extends UtilityButton {

	constructor(route) {
		super("recover", route);
		this.functions = [function(self) {

			$(self.id).on("click", function() {

				console.log("Recoved....");

				function f(i) {
					if (i === 10) {
						return;
					}
					++i;
					console.log("printing...")
					setTimeout(function() {
						f(i);
					}, 1000);
				}

				f(0);


			})

		}];
	}
}