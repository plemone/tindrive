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
					if (doc != null && doc.name === req.body.username) { // both these statements need to be true in order for the entire statement to evaluate to true
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
