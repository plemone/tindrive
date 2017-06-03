/* Author: Md. Tanvir Islam */

// contains all the routings of the server


// whenver this module is exported like this, example = require("./routing.js");
// simply calling example() will generate the entire script
module.exports = function() { // just a lambda
	'use strict';

	/* Routing dependencies */
	var express = require("express"); // importing express module
	var bodyParser = require("body-parser"); // body parser to parse the body of post requests
	var DriveController = require("./DriveController.js"); // import the controller of the app
	
	const CONTROLLER = new DriveController();
	const ROOT = "./"; // Root directory

	/* Express object created */
	var app = express(); // an instance of the express server

	/* Middleware bindings */
	app.set("views", "./views");
	app.set("view engine", "pug");
	app.use(express.static(ROOT));

	/*
		Due to the limit set by the body parser module, in order to send data via HTTP
		post request I had to use the req.on data asynchronous function, where data is
		accumulated asynchronously and recursively and stored inside a variable.
		To avoid body parser from handling the request I bounded the bodyparser middleware
		after the request.
	*/
	app.post("/:username/uploadFiles", function(req, res) { CONTROLLER.uploadFiles(req, res); });

	/* More middleware bindings */
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(function(req, res, next) {
		console.log(req.method + " request for: " + req.url);
		next(); // next without parameter simply invokes the next route in the file
	});

	/* Routings */

	app.get("/", function(req, res) { CONTROLLER.index(req, res); });

	app.post("/authenticate", function(req, res) { CONTROLLER.authenticate(req, res); });

	app.post("/nameCheck", function(req, res) { CONTROLLER.nameCheck(req, res); });

	app.post("/redirect", function(req, res) { CONTROLLER.redirect(req, res); });

	app.get("/:username", function(req, res) { CONTROLLER.username(req, res); });

	app.post("/:username/init", function(req, res) { CONTROLLER.init(req, res); });

	app.post("/:username/uploadFolders", function(req, res) { CONTROLLER.uploadFolders(req, res); });

	app.post("/:username/expandDir", function(req, res) { CONTROLLER.expandDir(req, res); });

	app.post("/:username/back", function(req, res) { CONTROLLER.back(req, res); });

	app.post("/:username/trash", function(req, res) { CONTROLLER.trash(req, res); });

	app.post("/:username/untrash", function(req, res) { CONTROLLER.untrash(req, res); });

	app.get("/:username/cdTrash", function(req, res) { CONTROLLER.cdTrash(req, res); });

	app.get("/:username/trashDirSize", function(req, res) { CONTROLLER.trashDirSize(req, res) });

	app.post("/logout", function(req, res) { CONTROLLER.logout(req, res); })

	app.get("*", function(req, res) { CONTROLLER.err(req, res); });

	app.listen(3000, CONTROLLER.intro());

}
