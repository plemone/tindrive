'use strict' // to allow strict typing, making JavaScript less forgiving

var routes = require("./controllers/routing.js");

function main() {
	routes();
}

if (!module.parent) {
	main();
}