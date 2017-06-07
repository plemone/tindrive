'use strict' // to make JavaScript less forgiving

/* Dependencies */
var IdGenerator = require("./../helpers/IdGenerator.js"); // unique user id generator ./../ means cd out of the current folder
var FileSystem = require("./../helpers/FileSystem.js"); // unique file system for the user ./../ means cd out of the current folder
var bcrypt = require("bcrypt"); // password encryption module 
var fs = require("fs"); // used to manipulate the file system 
var Database = require("./../helpers/Database.js"); // ./../ means cd out of the current folder

var ActiveUsers = require("./../models/ActiveUsers.js"); // ActiveUsers model imported
var Users = require("./../models/Users.js"); // Users model imported
var Trashes = require("./../models/Trashes.js"); // Trashes model imported
var archiver = require("archiver"); // module to zip files and folders

/* Constants */
const SALT = 10; // salt for the bcrypt password hashing
const FSPATH = "./filesystems/user-fs/"; 

/*
	
	NOTE** - there is no ./../ in path variables because it is only required when requiring a module from the directory,
			 since everything gets assembled by the file called app.js, everything is in relative to the
			 path that app.js exists in, therefore you don't need to cd out of the folder, only when require specific
			 modules you need to cd out, as requiring a module happens when you are relative to the path that the file
			 that is requiring the module is located at						

*/

// Main controller class

class DriveController {
	
	constructor() {
		this.modelAU = new ActiveUsers(); // composition relationship with the ActiveUsers model which is a collection
		this.modelU = new Users(); // composition relationship with the Users model which is a collection
		this.modelT = new Trashes(); // composition relationship with the Trashes model which is a collection
		// generate the database for every single user registered in the system
		this.database = new Database(); // database containing the file systems of different users
		this.initDatabase(); // traverses each users file system, creates the file system object and populates the FSTree of the file system
	
	}

	intro() {
		console.log("Server is listening on port 3000...");
	}

	initDatabase() {
		var self = this; // the keyword "this" has different meaning in different scopes
		// we find all the items in the trash directory which is basically we find the trash director for each user 
		// and pass it on to this.database.generate() which uses these items to filter flag the items when 
		// generating the FSTree for each when iterating through the each user's directory in the server' file system 
		this.modelT.queryAll(function(cursor) {
			cursor.toArray(function(err, items) {
				if (err) {
					console.log("Error in turning the cursor to array of trash directoy documents...");
				} else {
					self.database.generate(items); // generates the database of each user
				}
			});
		});
	}

	index(req, res) {
		res.status(200).render("index");
	}

	authenticate(req, res) {
		var self = this; // this keyword is different within different scopes
		var genObj = new IdGenerator();

		if (req.body.which === "#login") { // handles login
			this.modelU.query(req.body.username, function(doc) {
				// black box, and is an abstraction that I am willing to accept
				// when comes to how bcrypt module handles its security and authentication
				// the result is magically formulated by bcrypt to chec whether the password
				// provided by the user is correct or not				
				bcrypt.compare(req.body.password, doc.password, function(err, result) {
					if (result === true) {
						var responseObj = {};
						responseObj.id = doc.id;
						res.status(200).send(responseObj);
					} else { 
						res.status(200).send("login-password-error"); // 0 means not a success
					}
				});
			}, function() { res.status(200).send("loging-name-error"); }); // when user cannot be found in the database
	
		} else { // handles registration
			// object which will hold the user details to be added to the database
			var userDetails = {}; 

			// query mongoDb Users collection with the request body's username
			this.modelU.query(req.body.username, function() {
				// if a document exists with the name provided we know that its a problem
				res.status(200).send("0");

			}, function() {
				bcrypt.genSalt(SALT, function(err, salt) {
					bcrypt.hash(req.body.password, salt, function(err, hash) {
						userDetails.password = hash;
						if (req.body.username !== "") {
							userDetails.id = genObj.generateId(req.body.username);
							// user registered and inserted to the database
							self.modelU.insert(userDetails, function() {
								console.log("User " + userDetails.name + " registered...");
								
								// when user registration is successful we create the trash directory of the user in the Trashes collection as well
								
								// we create the object which will represent the trash directory of the user
								var userTrashedDir = {};

								// we assign a name attribute for the object to find the trash directory of the user by querying with the user's name
								userTrashedDir.name = userDetails.name;

								// create the empty directory which will contain the users empty files and folders
								userTrashedDir.trashedDir = [];

								// upsert the document to mongodb
								self.modelT.upsert(userTrashedDir, function() { // to create the Trash directory we need to provide the name of the user
									console.log("Trash directory for the user " + userDetails.name + " created....");
								});
							});
							// the file system folder needs to be created for individual users
							// each user has their own folder
							fs.mkdir(FSPATH + req.body.username, function(err) {
								if (err) console.log("Error in creating directory...");
								else console.log("Directory called " + req.body.username + " created...");
							});
							// added to the static database of users, NOTE** - on initial registration the user's FSTree is empty
							self.database.add(req.body.username);
							// this function body is the last thing that gets executed in this funciton body
							res.status(200).send("registration-success");
						} else {
							res.status(200).send("registration-failure");
						}
					});
				});
				// asynchronousity allows this to run first and this gets used within the nested scope
				userDetails.name = req.body.username;
			});
		}
	}

	// upon successful authentication this function is called which redirects the user by changing the url in the client side
	redirect(req, res) {
		this.modelAU.insert(req.body.name, function() {
			res.sendStatus(200);
		}, function() {
			res.status(200).send("404");
		});
	}

	// every word the user types in the registration box's username field gets checked with the server for any
	// possible matches in the mongodb, if found "0" is send if not found "1" is send back to the client
	nameCheck(req, res) {
		this.modelU.query(req.body.val, function() {
			res.status(200).send("0"); // if it is found in the database then red light
		}, function() { 
			res.status(200).send("1"); // if the name is not found in the data base then green light
		});
	}

	// renders a new page depending on the name of the user hence the route
	// "/:username means that the route is dynamic depending on whatever is being sent!"
	username(req, res) {
		// to obtain the dynamic url aliased by :username we can directly access the url
		// aliased by this by using the syntax req.params.username
		this.modelAU.query(req.params.username, function() {
			res.status(200).render("drive", {name: req.params.username});
		}, function() { res.status(200).render("404"); });

	}

	// Check mongodb if the active user is pressed, if they are from the database (facade class)
	// grab the users file system, ls it using the path sent to you through the route and then
	// send the array back by putting it inside a json object.
	init(req, res) {
		var self = this;
		this.modelAU.query(req.params.username, function() {
			// retrieve the file system of the user from the facade class
			var userFS = self.database.retrieve(req.params.username);
			// retrieve the array from the tree encapsulated inside the users file system
			var ls = userFS.listDirectoryContents(req.body.path);
			// create the response object
			var responseObj = {};
			// encapsulate the directory contents array inside the response object
			responseObj.ls = ls;
			// send the response objet
			res.status(200).send(responseObj);
		}, function() { res.status(200).render("404"); });
	}

	// files dropped into the dropzone from the client side gets written into the server's file system
	uploadFiles(req, res) {
		var self = this;
		// check for the username provided is found in the collection of active users in the database
		this.modelAU.query(req.params.username, function() {
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

				res.sendStatus(200);

			});
		}, function() { res.status(200).render("404"); });

	}

	// the instructions to create a folder is being sent from the client side
	// "/:username means that the route is dynamic depending on whatever is being sent!"
	uploadFolders(req, res) {
		var self = this;
		// to obtain the dynamic url's variable aliased by :username we can directly access it
		// using req.params.username

		// searches the Mongodb TinDrive database in the active users collection for the username that is
		// contained in the part of the url
		this.modelAU.query(req.params.username, function() {
			// we have found a user by the name of req.params.username in the database for ActiveUsers collections!
			// make the folder with the specific path provided through the request object which 
			// represents a folder						
			// retrieve the file system of the user from the facade class
			var userFS = self.database.retrieve(req.params.username);
			// delegate the responsibilities to the userFS
			console.log(req.body.path);
			userFS.uploadFolder(req.body);
			res.sendStatus(200);						
		}, function() { res.status(200).render("404"); });
	}

	// when doubleclick is made on the client side on a folder
	expandDir(req, res) {
		// this keyword is different for each function scope, so we make a variable point to this within
		// the current function scope's this	
		var self = this; 

		// Mongodb needs to be checked for the current client that is trying to communicate
		// with the db has gone through the authentication process or not

		this.modelAU.query(req.params.username, function() {
			// retrieve the userFS using the facade class
			var userFS = self.database.retrieve(req.params.username);

			// retrieve the list of contents in a particular directory
			var ls = userFS.listDirectoryContents(req.body.path);

			// encapsulate the diretory contents in a response object
			var responseObj = {};
			responseObj.ls = ls;

			// send the responseObject back
			res.status(200).send(responseObj);

		}, function() { res.status(200).render("404"); });
	}

	// when the back space is pressed on the client side
	back(req, res) {
		// the keyword this is varies between scopes, we make a variable which points to the this within the scope so that it can be used within nested scope inside the function
		var self = this; 
		/*
			TinDrive's ActiveUsers collection needs to be checked for the user who is trying to communicate
			with the server, if the user is not in the Active connection we refuse to give information back
			only through legit authentication can the user access information
		*/
		this.modelAU.query(req.params.username, function() {
			// retrieve the user's file system using the facade class-- database
			var userFS = self.database.retrieve(req.params.username);

			// retrieve the list of contents in a particular directory
			var ls = userFS.listDirectoryContents(req.body.path);

			// encapsulates the directory contents in a response object
			var responseObj = {};
			responseObj.ls = ls;

			// send the response object black
			res.status(200).send(responseObj);

		}, function() { res.status(200).render("404"); });

	}

	// when the user presses the delete button with a bunch of selected files
	trash(req, res) {
		var self = this; // this key word has different meanings in different scopes
		// query the active users database to check the username from the req.params is active or not
		this.modelAU.query(req.params.username, function() {
			/* THIS IS JUST A TEST UNDO THIS AND IMLEMENT THIS LATER */
			
			// succes in finding the user in the database
		
			// retrieve the user's file system object using the username
			var userFS = self.database.retrieve(req.params.username);

			// Either file or folder, both their paths will be the same, which is req.body.path
			// as req.body.path is the path of the container folder containing either the folder or file.
			var content = userFS.trash(req.body); // we return the content (file or folder) which we will use and insert to the database

			if (content) { // if and only if content exists we add it to the MongoDB database

				// query() method of modelT object will take three parameters, the name, a successcall back and the failure call back
				self.modelT.query(req.params.username, function(doc) {

					// this scenario might never really happen, but its still good to error check
					if (doc === null) {

						console.log("Unable to find the user " + req.params.username + "'s trash directory...");

						// render the 404 page upon failure
						res.status(200).render("404");

						// we return the function to prevent the code below from running
						return;

					} else {
						// if doc is not null that means doc has successfully returned the object that we were looking for and we can now
						// successfully update the object that we found

						// we access the trashedDir attribute from the object retrieved from mongodb
						var trashedDir = doc.trashedDir;

						// push the folder or file object that we just deleted into the trashedDir array
						trashedDir.push(content);

						// we create the new updated object which will be used to be updated back into mongodb
						var newUserTrashedDir = {};
						newUserTrashedDir.name = doc.name;
						newUserTrashedDir.trashedDir = trashedDir;

						// now with the new trashedDir array filled with more deleted objects we insert it back into the mongodb, by updating our prexisting object
						self.modelT.upsert(newUserTrashedDir);

						console.log("Trashed directory for the user " + req.params.username + " updated...");

					}

					// if we have reached this part of the code it means we have successfully passed all the error checks
					// and we simply respond with a 200 status, which indicates that all went well
					res.sendStatus(200); 
					
				}, function() { res.status(200).render("404"); }); // failureCallBack should always return a 404 page

			}

		}, function() { res.status(200).render("404"); }); // failure to find the user in the database
	}

	untrash(req, res) {
		var self = this; // the this keyword has different meaning in different scopes

		// we query the collection of active users with the username from the username provided in the route string
		this.modelAU.query(req.params.username, function() {

			// after user has been found in the active users collection it means that the user was correctly authenticated
			// and we can proceed in finding the users trashed directory contents by querying the Trashed collection
			self.modelT.query(req.params.username, function(doc) {

				// if doc is null that means mongodb failed to return a document by the username provided
				// that can only mean one thing that an object with that name attribute being queried doesn't exist
				// in that case we send an error indicator to the client side
				if (doc === null) {

					console.log("Unable to find the user " + req.params.username + "'s trash directory...");

					// render the 404 page upon failure
					res.status(200).render("404");

					// we return the function to prevent further code below from running
					return

				} else {

					// if do isn't null we have found the object which contains the directory of trash as its attriubte
					var trashedDir = doc.trashedDir;

					// retrieve the unique file system of the user from the static database generated on run time using the username provided from the route string
					var userFS = self.database.retrieve(req.params.username);

					// we have to loop over the trashedDir find the content that matches the object that the user sent and remove it from the trashDir
					for (var i = 0; i < trashedDir.length; ++i) {

						// if both the name and the path of the contents of the element being checked in the directory and the content that the client side provided is the same
						if (trashedDir[i].name === req.body.name && trashedDir[i].path === req.body.path) {
							
							// the file/folder that is to be untrashed gets found in the user's FSTree and the flag of the folder/file indicating trashed or untrashed gets set to false indicating that the file is untrashed
							userFS.untrash(trashedDir[i]);

							// then we remove one item from that index including that index
							trashedDir.splice(i, 1);

							// the newly modified directory now needs to be updated to mongodb
							// to do that we need to create a new object encapsulating new data to be updated in the mongodb replacing the older object
							var newUserTrashedDir = {};
							newUserTrashedDir.name = doc.name;
							newUserTrashedDir.trashedDir = trashedDir;

							// now we use the model object responsible for updating the trashed directory and we use the method upsert to update the old object with the new one
							self.modelT.upsert(newUserTrashedDir);
							
							// we break the loop as we don't want any more information from the rest of the array, since we have found our information already
							break;
						}


					}

				}

				// if we have reached this part of the code it means we have successfully passed all the error checks
				// and we simply respond with a 200 status, which indicates that all went well
				res.sendStatus(200);

			}, function() { res.status(200).render("404"); });

		}, function() { res.status(200).render("404"); });


	}
	// checks if the route contains authenticated user name, then deletes file/folder object form mongodb,
	// then from the FSTree and finally deletes the file/folder from the server's file system as well.
	deleteTrash(req, res) {

		var self = this; // the keyword "this" has different meaning in different scopes

		// as usual we query the collection of ActiveUsers in mongodb with the username extracted from the route
		this.modelAU.query(req.params.username, function() {

			// The first callback function is the success callback function, this means that we have
			// found the user's object in the ActiveUser's collection by querying the collection with the
			// atttribute and value of "name: req.params.username".

			// we retrieve the user from the facade class which gives acces to each user's file system object
			var userFS = self.database.retrieve(req.params.username);

			// we query the trashes collection with the username provided from the route string
			self.modelT.query(req.params.username, function(doc) {

				// we extract the value of the trashedDir attribute from the doc object returned by mongodb and store it in a variable
				var trashedDir = doc.trashedDir;

				// Next step is to loop over the trashedDir array which contains the directory of trashed files/folders for the user
				// and find the file/folder's name which matches the file/folder's name provided from the client side.
				for (var i = 0; i < trashedDir.length; ++i) {

					if (trashedDir[i].name === req.body.name) {

						// userFS's removeFile and removeFolder method will take care of both deleting
						// from the file system and deleting from the 

						// if the type of content sent to us by the client to be deleted is the file
						// then we call the appropriate FileSystem class's removeFile method
						if (req.body.type === "file") {
							userFS.removeFile(req.body); // req.body is the file object

						} else { // if the type is not file it has to be a folder so we call
								 // the appropriate FileSystem class's removeFolder method
							userFS.removeFolder(req.body); // req.body is the folder object
						}

						// Next step for us is to find the object from the Trashes collection using the req.params.username
						// to query the object encapsulating the trashDir

						// we remove an element at starting at i and we remove one element from i
						trashedDir.splice(i, 1);

						// create the new object encapsulating the users trashed directory which will be updated
						// replacing the old directory

						var newUserTrashedDir = {};
						newUserTrashedDir.name = req.params.username;
						newUserTrashedDir.trashedDir = trashedDir;

						// now that the object encapsulating the user's trashed directory is created we update the
						// old trashed directory
						self.modelT.upsert(newUserTrashedDir);

						// we break the loop as we don't want any more information from the rest of the array, since we have found our information already
						break;
					}

				}

				// if we have reached this part of the code it means we have successfully passed all the error checks
				// and we simply respond with a 200 status, which indicates that all went well
				res.sendStatus(200);

			}, function() { res.status(200).render("404"); }); // if the trashes object by the name attribute doesnt match the username specified in the route string then we render the 404 page indicating error

		}, function() { res.status(200).render("404"); }); // upon an error in authenticating the user we render the 404 page

	}

	// provides list of directory information about the trash directory which is inside a mongodb collection
	cdTrash(req, res) {
		var self = this; // the "this" keyword has different meaning in different scopes

		// As always any kind of request made from the client side needs to be under the username itself
		// and the username under which requests are sent should always be checked with mongodb ActiveUsers
		// collection before proceeding with sending back any information, because un authorized users who
		// have not currently logged in can never send or receive information from the server. We can select
		// parts of the route we want to extract and store it as a variable using req.params.
		this.modelAU.query(req.params.username, function() {

			// it is assumed that modelT.query will provide the anonymous function we are providing
			// through the param with the doc object returned from mongodb and it DOES!
			self.modelT.query(req.params.username, function(doc) {

				// object created which will contain the attribute ls which will contain the array of directories
				var responseObj = {};

				// we encapsulare the document object's trashedDir attribute which is an array containing the contents of the trashed directory
				responseObj.ls = doc.trashedDir;
				
				// we know format the array of objects that we will send so that it works properly with populateDropZone function	
				for (var i = 0 ; i < responseObj.ls.length; ++i) {
					if (responseObj.ls[i].type !== "folder") {
						responseObj.ls[i].type = "file";
					}
				}

				// and we send this response object to the client now
				res.status(200).send(responseObj);

			});

		}, function() { res.status(200).render("404"); });

	}

	// provides the size of the length of the trash directory array which is inside a mongodb
	trashDirSize(req, res) {

		var self = this; // the keyword this has different meaning in different scopes

		// as always we have to check whether the request made to the server is by a user who is currently
		// authenticated by checking the ActiveUsers collection in mongodb and check if the object with the user's name exists
		this.modelAU.query(req.params.username, function() {


			// We query mongodb collection of trashed directories to find the object where the array of trashed files/folder is encapsulated. The object also has an attribute
			// called name which is the user's name and thats what we use to find the object
			self.modelT.query(req.params.username, function(doc) {

				// we encapsulate the length of the trashedDir array in an object and send the object
				var responseObj = {};
				responseObj.size = doc.trashedDir.length;
				res.status(200).send(responseObj);

			}, function() { res.status(200).render("404"); }); // failure to find the user's trashed object with the user's name will render the 404 page


		}, function() {res.status(200).render("404"); }); // failure to find the user renders the 404 page

	}

	// responsible for the final piece in the puzzle which is to download the files from the server
	download(req, res) {

		var self = this; // the keyword "this" has different meaning in different scopes

		// as always we have to check whether the request made to the server is by a user who is currently
		// authenticated by checking the ActiveUsers collection in mongodb and check if the object with the user's name exists
		this.modelAU.query(req.params.username, function() {

			// lets generate a random name to avoid naming conflicts
			let folderName = function() {

				// variable to store the letters in
				let name = "";

				// we want to generate a number between 10 to 30 
				// start 									end
				// [10 ----------------------------------- +10]
				// [max - min ............................ +min]
				let numLetters = Math.random() * (20 - 10) + 10;

				// using the randomly generated number in the range of 20 to 30
				// we loop that many times, and the number will be atleast 20 to atleast 30 in between any of the number
				for (let i = 0; i < numLetters; ++i) {

					// In the ASCII table the letter "A" starts at code 65 and the letter z ends at letter 65 + 57 = 122
					// and so we want to generate a number in between 65 and 122
					// Although the characters from 90 to 97 are not letters of english alphabet so any number
					// between 91 and 96 (the condition is that they have to be both 90 and 97 for the entire statement
					// to evaluate to true) need to be excluded. So remedy the situation we simply scheck how close the
					// number is to 97 and we just help the number get to 97 by adding how many numbers its missing to
					// itself. This makes any number between 91 to 96 into 97.
					let randomNum = 65 + Math.round((Math.random() * 57));
					if (randomNum > 90 && randomNum < 97) {
						let toAdd = 97 - randomNum;
						randomNum += toAdd;
					}

					// now we add the randomly generated alphabet to the string variable
					name += String.fromCharCode(randomNum);

				}

				// at the very end of the function we return the name
				return name;
			}(); // at the end of the function body we invoke it, from the "()" parenthesis you can see the function being invoked and the function being invoked returns the name string which gets saved righ away by the variable folderName


			// we have to modify the folder name slightly to add the .zip at the end of the random string
			folderName = folderName + ".zip";

			// we create the object that will be used to zip files or folders
			let archive = archiver("zip");

			// we create a write stream where bytes will get piped to
			let output = fs.createWriteStream("./" + folderName);

			// archive object .on close event takes a callback where you can log to the screen
			output.on("close", function() {
				console.log(archive.pointer() + " bytes in total zipped...");
				console.log("Archiver has been finalized and the output file descriptor has been closed...");
			});

			archive.on("error", function(err) {
				console.log(err);
				console.log("Error occured in zipping files...");
			})

			// loop over the array of selected files/folders and zip the selected items and send it over to the client side
			for (let i = 0; i < req.body.selections.length; ++i) {

				// We deal with two type of content either a file or a folder
				// archive object has two methods called archive.directory and archive.file
				// these two methods will be used to actually zipping the file or folder into one
				// zip file. These methods shoves the files/folders into the object and when we call
				// the pipe method the data stream gets dumped into our write stream called output.
				// when the finalize method is called the close event is triggered and we end the whole process
				// of zipping.
				if (req.body.selections[i].type === "folder") {

					// if we are dealing with a folder we call the directory method of the archive object
					archive.directory(req.body.selections[i].path.slice(2) + req.body.selections[i].name);

				} else {

					// if we are dealing with a file we call the file method of the archive object
					archive.file(req.body.selections[i].path.slice(2) + req.body.selections[i].name);
				}

			}

			// here we pipe the data to the write stream
			archive.pipe(output);

			// then we finalize the archive triggering the close event
			archive.finalize();

			res.status(200).sendFile(folderName, {root: "./"});

		}, function() { res.status(200).render("404"); }); // failure to find the user renders the 404 page

	}



	// removes the user from the ActiveUsers collection
	logout(req, res) {
		this.modelAU.remove(req.body.name, function() { 
			res.sendStatus(200); 
		}, function() { 
			res.status(200).render("404"); 
		});
	}

	// on 404 errors
	err(req, res) { res.status(200).render("404"); }

}


module.exports = DriveController;