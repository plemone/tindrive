/* Author: Md. Tanvir Islam */

'use strict';

const ROOT = "./"; // Root directory
var DriveController = require("./DriveController.js"); // import the controller of the app
const CONTROLLER = new DriveController();

/* Routing dependencies */
var express = require("express"); // importing express module
var app = express(); // an instance of the express server
var bodyParser = require("body-parser"); // body parser to parse the body of post requests


/* Middleware bindings */
app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static(ROOT));

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


app.post("/logout", function(req, res) { CONTROLLER.logout(req, res); })

app.get("*", function(req, res) { CONTROLLER.err(req, res); });

app.listen(3000, CONTROLLER.intro());
