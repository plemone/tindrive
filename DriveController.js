'use strict' // to make JavaScript less forgiving

/* Dependencies */
var IdGenerator = require("./src/IdGenerator.js"); // unique user id generator
var FileSystem = require("./src/FileSystem.js"); // unique file system for the user
var bcrypt = require("bcrypt"); // password encryption module
var MongoClient = require("mongodb").MongoClient; // database module
var fs = require("fs"); // used to manipulate the file system
var Database = require("./src/Database.js");

/* Constants */
const SALT = 10; // salt for the bcrypt password hashing
const DB = "mongodb://localhost:27017/TinDriveUsers"; // alias to the string commonly used throughout the program
const FSPATH = "./src/user-fs/"; // the main path where the file system is stored

class DriveController {
	
	constructor() {
		// generate the database for every single user registered in the system
		this.database = new Database();
		this.database.generate();
	}

	intro() {
		console.log("Server is listening on port 3000...");
	}

	index(req, res) {
		res.status(200).render("index");
	}

	authenticate(req, res) {
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
						if (err) console.log("Error in finding the user...");
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
												if (err) console.log("Error in creating directory...");
												else console.log("Directory called " + req.body.username + " created");
											});

											// added to the static database of users
											self.database.add(req.param.username);

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
	}

	redirect(req, res) {
		MongoClient.connect(DB, function(err, db) {
			if (err) console.log("Failed to connect to TinDrive database...");
			else {
				console.log("Access to TinDrive Database successful...");
				// on logout remove the active user
				db.collection("ActiveUsers").findOne({"name": req.body.name}, function(err, doc) {
					if (err) console.log("Error in finding the name in database...");
					else {
						if (doc == null)  {
							// The user currently logged in gets added to the collection
							// of active users, any ongoing interation while the user is logged on
							// needs to be checked with mongodbs collection of active users first.
							db.collection("ActiveUsers").insert({"name": req.body.name});
						}
						res.sendStatus(200);
						db.close()
					}
				});
			}
		});
	}

	nameCheck(req, res) {
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
	}
	// renders a new page depending on the name of the user hence the route
	// "/:username means that the route is dynamic depending on whatever is being sent!"
	username(req, res) {
		// to obtain the dynamic url aliased by :username we can directly access the url
		// aliased by this by using the syntax req.params.username
		MongoClient.connect(DB, function(err, db) {
			if (err) console.log("Failed to connect to TinDrive database...");
			else {
				db.collection("ActiveUsers").findOne({"name": req.params.username}, function(err, doc) {
					if (err) console.log("Error in finding the name in database...");
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
	}

	// check mongodb if the active user is pressed, if they are from the database (facade class)
	// grab the users file system, ls it using the path sent to you through the route and then
	// send the array back by putting it inside a json object
	init(req, res) {
		var self = this;
		// Checking ActiveUsers is important as even REST APIS need to momentarily
		// login the users, a user that isn't logged in CANNOT make a request
		MongoClient.connect(DB, function(err, db) {
			if (err) console.log("Failed to connect to TinDrive database...");
			else {
				db.collection("ActiveUsers").findOne({"name": req.params.username}, function(err, doc) {
					if (err) console.log("Error in finding the user");
					else {
						// retrieve the file system of the user from the facade class
						var userFS = self.database.retrieve(req.params.username);
						// retrieve the array from the tree encapsulated inside the users file system
						var ls = userFS.tree.lsL(req.body.path);
						// create the response object
						var responseObj = {};
						// encapsulate the directory contents array inside the response object
						responseObj.ls = ls;
						// send the response objet
						res.status(200).send(responseObj);
					}
				});
			}
		});
	}

	uploadFiles(req, res) {
		var self = this;
		// Due to the limit set by the body parser module, in order to send data via HTTP
		// post request I had to use the req.on data asynchronous function, where data is
		// accumulated asynchronously and recursively and stored inside a variable.
		// To avoid body parser from handling the request I bounded the bodyparser middleware
		// after the request

		// check for the username provided is found in the collection of active users in the database
		MongoClient.connect(DB, function(err, db) {
			if (err) console.log("Failed to connect to TinDrive database...");
			else {
				db.collection("ActiveUsers").findOne({"name": req.params.username}, function(err, doc) {
					if (err) console.log("Error in finding the name in database...");
					else {
						if (doc === null) res.sendStatus(404);
						else {
							var bytes = "";
							// bytes being send in as chunks that get stored inside the bytes variable asynchronously
							req.on("data", function(chunk) {
								bytes += chunk;
							});

							req.on("end", function() {
								var requestObj = JSON.parse(bytes); // a string object is being sent which represents a JSON object, so parsiing it to the JSON object is required

								// retrieve the user' file system
								var userFS = self.database.retrieve(req.params.username);

								// file uploaded and saved to file system
								userFS.uploadFile(requestObj);

								db.close();

							});
						}
					}
				});
			}
		});		
	}

	// the instructions to create a folder is being sent from the client side
	// "/:username means that the route is dynamic depending on whatever is being sent!"
	uploadFolders(req, res) {
		var self = this;
		// to obtain the dynamic url's variable aliased by :username we can directly access it
		// using req.params.username

		// searches the Mongodb TinDrive database in the active users collection for the username that is
		// contained in the part of the url
		MongoClient.connect(DB, function(err, db) {
			if (err) console.low("Failed to connect to TinDrive database...");
			else {
				db.collection("ActiveUsers").findOne({"name": req.params.username}, function(err, doc) {
					if (err) console.log("Error in finding the name in database...");
					else {
						if (doc === null) res.status(200).render("404");
						else { // we have found a user by the name of req.params.username in the database for ActiveUsers collections!
							// make the folder with the specific path provided through the request object which 
							// represents a folder						

							// retrieve the file system of the user from the facade class
							var userFS = self.database.retrieve(req.params.username);

							// delegate the responsibilities to the userFS
							userFS.uploadFolder(req.body);

							res.sendStatus(200);						
							db.close();		
						}
					}
				});
			}
		});		
	}

	logout(req, res) {
		MongoClient.connect(DB, function(err, db) {
			console.log("Logged out!");
			if (err) console.log("Failed to connect to TinDrive database...");
			else {
				db.collection("ActiveUsers").remove({"name": req.body.name});
				res.sendStatus(200);
			}
		});
	}

	err(req, res) {
		res.status(404).render("404");		
	}


}


module.exports = DriveController;