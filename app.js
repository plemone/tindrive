/*
	Author: Md. Tanvir Islam
*/

'use strict';

var IdGenerator = require("./src/IdGenerator.js"); // unique user id generator
var FileSystem = require("./src/FileSystem.js"); // unique file system for the user
var express = require("express"); // importing express module
var app = express(); // an instance of the express server
var bodyParser = require("body-parser"); // body parser to parse the body of post requests
var MongoClient = require("mongodb").MongoClient; // database module
var bcrypt = require("bcrypt"); // password encryption module
var fs = require("fs"); // used to manipulate the file system
const ROOT = "./"; // Root directory
const SALT = 10; // salt for the bcrypt password hashing
const DB = "mongodb://localhost:27017/TinDriveUsers"; // alias to the string commonly used throughout the program
const USERFS = "mongodb://localhost:27017/TinDriveFS";
const FSPATH = "./src/user-fs/";

// binding middlewares
app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static(ROOT));

app.post("/:username/uploadFiles", function(req, res) {
	// Due to the limit set by the body parser module, in order to send data via HTTP
	// post request I had to use the req.on data asynchronous function, where data is
	// accumulated asynchronously and recursively and stored inside a variable.
	// To avoid body parser from handling the request I bounded the bodyparser middleware
	// after the request
	MongoClient.connect(USERFS, function(err, db) {
		if (err) console.log("Failed to connect to TinDrive database...");
		else {
			db.collection(req.params.username).findOne({"username": req.params.username}, function(err, doc) {
				if (err) console.log("Error in finding the name in database");
				else {
					if (doc === null) res.sendStatus(404);
					else {
						var bytes = "";

						req.on("data", function(chunk) {
							bytes += chunk;
						});

						req.on("end", function() {
							var requestObj = JSON.parse(bytes); // a string object is being sent which represents a JSON object, so parsiing it to the JSON object is required
							

							// IMPLEMENT LATER



							// call the file system manager and add the file to the file system
							// with the correct path






							db.close();

						});
					}
				}
			});
		}
	});
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
	console.log(req.method + " request for: " + req.url);
	next(); // next without parameter simply invokes the next route in the file
});

// routing
app.get("/", function(req, res) {
	res.status(200).render("index");
});

app.post("/authenticate", function(req, res) {
	var genObj = new IdGenerator();
	MongoClient.connect(DB, function(err, db) {
		if (err) console.log("Failed to connect to TinDrive database...");
		else {
			console.log("Access to TinDrive database successful...");
			var collection = db.collection("Users");
			if (req.body.which === "#login") {
				// handle login
				collection.findOne({"name": req.body.username}, function(err, doc) {
					if (err) console.log("Error in iterating database...");
					else {
						if (doc === null) {
							res.status(200).send("login-name-error");
							db.close();
							return; // return to prevent the async function from running
						} else {
							// black box, and is an abstraction that I am willing to accept
							// when comes to how bcrypt module handles its security and authentication
							// the result is magically formulated by bcrypt to chec whether the password
							// provided by the user is correct or not
							bcrypt.compare(req.body.password, doc.password, function(err, result) {
								if (result === true) {
									var responseObj = {};
									responseObj.id = doc.id;
									res.status(200).send(responseObj);
								}
								else res.status(200).send("login-password-error"); // 0 means not a success
								db.close();
							})
						}
					}
				});
			} else {
				// handle registration
				var userDetails = {}; 
				// always use find one if you are absolutely sure that there is one document you are looking for
				collection.findOne({"name": req.body.username}, function(err, doc) {
					if (err) console.log("Error in finding the user");
					else {
						if (doc != null && doc.name === req.body.username) {
							res.status(200).send("0");
							db.close();
						} else {
							bcrypt.genSalt(SALT, function(err, salt) {
								bcrypt.hash(req.body.password, salt, function(err, hash) {
									userDetails.password = hash;
									if (req.body.username != "") {
										userDetails.id = genObj.generateId(req.body.username);

										collection.insert(userDetails, function(err) {
											if (err) console.log(err);
											else console.log("User registered");
										});
										// closes the opened database to make sure data gets saved
										db.close(); 
										// the file system folder also needs to be created for individual users
										// each user has their own folder
										fs.mkdir(FSPATH + req.body.username, function(err) {
											if (err) console.log("Error in creating directory");
											else console.log("Directory called " + req.body.username + " created");
										});
										// file system datastructure to imitate the FS needs to be created as well
										MongoClient.connect(USERFS, function(err, db) {
											db.collection(req.body.username).insert(new FileSystem(req.body.username, FSPATH), function(err) {
												if (err) console.log(err);
												else {
													console.log("File System database for " + req.body.username + " created");
													db.close();
												}
											});
										});
										// this function body is the last thing that gets executed in this funciton body
										res.status(200).send("registration-success");
									} else {
										res.status(200).send("registration-failure");
									}
								});
							});
							// asynchronousity allows this to run first
							userDetails.name = req.body.username;
						}
					}
				});
			}
		}
	});
});


app.post("/nameCheck", function(req, res) {
	MongoClient.connect(DB, function(err, db) {
		if (err) console.log("Failed to connect to TinDrive database...");
		else {
			console.log("Access to TinDrive database successful...");
			db.collection("Users").findOne({"name": req.body.val}, function(err, doc) {
				if (err) console.log("Error in finding the user");
				else {
					if (doc == null)  // if the name is not found in the data base then green light
						res.status(200).send("1");
					else  // if it is found in the database then red light
						res.status(200).send("0");
					db.close();
				}
			});
		}
	});
});

app.post("/redirect", function(req, res) {
	MongoClient.connect(DB, function(err, db) {
		if (err) console.log("Failed to connect to TinDrive database");
		else {
			console.log("Access to TinDrive Database successful...");
			// on logout remove the active user
			db.collection("ActiveUsers").findOne({"name": req.body.name}, function(err, doc) {
				if (err) console.log("Error in finding the name in database");
				else {
					if (doc == null) 
						db.collection("ActiveUsers").insert({"name": req.body.name});
					res.sendStatus(200);
					db.close()
				}
			});
		}
	});
});

// "/:username means that the route is dynamic depending on whatever is being sent!"
app.get("/:username", function(req, res) {
	// to obtain the dynamic url aliased by :username we can directly access the url
	// aliased by this by using the syntax req.params.username
	MongoClient.connect(DB, function(err, db) {
		if (err) console.log("Failed to connect to TinDrive database");
		else {
			db.collection("ActiveUsers").findOne({"name": req.params.username}, function(err, doc) {
				if (err) console.log("Error in finding the name in database");
				else {
					if (doc === null) 
						res.status(200).render("404");
					else 
						res.status(200).render("drive", {name: req.params.username}); // syntax to pass variables to pug using express
					db.close();
				}
			});
		}
	});
});

// the instructions to create a folder is being sent from the client side
// "/:username means that the route is dynamic depending on whatever is being sent!"
app.post("/:username/uploadFolders", function(req, res) {
	// to obtain the dynamic url's variable aliased by :username we can directly access it
	// using req.params.username

	// searches the Mongodb TinDrive database in the active users collection for the username that is
	// contained in the part of the url
	MongoClient.connect(DB, function(err, db) {
		if (err) console.low("Failed to connect to TinDrive database");
		else {
			db.collection("ActiveUsers").findOne({"name": req.params.username}, function(err, doc) {
				if (err) console.log("Error in finding the name in database");
				else {
					if (doc === null) res.status(200).render("404");
					else { // we have found a user by the name of req.params.username in the database for ActiveUsers collections!


						// call the fils ystem manager object and add the folder to the correct
						// path of the file system for the user!



						res.sendStatus(200);
						db.close();
					}
				}
			});
		}
	});
});


app.post("/logout", function(req, res) {
	MongoClient.connect(DB, function(err, db) {
		console.log("Logged out!");
		if (err) console.log("Failed to connect to TinDrive database");
		else {
			db.collection("ActiveUsers").remove({"name": req.body.name});
			res.sendStatus(200);
		}
	});
})

app.get("*", function(req, res) {
	res.status(404).render("404");
});

app.listen(3000, function() {
	console.log("Server is listening on port 3000...");
})
