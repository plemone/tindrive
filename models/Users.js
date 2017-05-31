'use strict' // to make JavaScript strictly typed

var MongoClient = require("mongodb").MongoClient; // database module

// NOTE** - The reason that the successCallBack and failureCallBack will work and can successfully access
//			the variables is because the class Users has a composition releationship with the Controller,
//          this means that because of lexical scoping the Users class can access the variables scoped 
//          within the Controller class. I am specifying this to remind you that the function that invokes
//          has to supply all the variables and resources for the function being passed on to do the job!


// Represents the collection Users
class Users {

	constructor() {
		this.db = "mongodb://localhost:27017/TinDriveUsers";
		this.collection = "Users";
	}

	insert(user, successCallBack, failureCallBack) {
		var self = this;
		MongoClient.connect(this.db, function(err, db) {
			if (err) console.log("Error in finding the name in the database...");
			else {
				db.collection(self.collection).insert(user, function(err, doc) {
					if (err) {
						console.log("Error in inserting user in the database...");
						// don't call if a function is not passed through the params, if it is not passed it will be undefined
						if (failureCallBack) failureCallBack(); // callback function that is passed through the param
					} else {
						// don't call if a function is not passed through the params, if its not passed it will be undefined
						if (successCallBack) successCallBack(doc); // callback function that is passed through the param
					}
					db.close();
				});
			}
		});
	}
	
	// always use find one if you are absolutely sure that there is one document you are looking for
	query(name, successCallBack, failureCallBack) {
		var self = this;
		MongoClient.connect(this.db, function(err, db) {
			if (err) console.log("Failed to Connect to database...");
			else {
				db.collection(self.collection).findOne({"name": name}, function(err, doc) {
					// the doc here is the doc that is being found
					if (err) console.log("Error in finding the name in the database...");
					else {
						if (doc === null) {
							console.log("No user with the name found in the database...")
							// don't call if a function is not passed through the params, if it is not passed it will be undefined		
							if (failureCallBack) failureCallBack(); // callback function that is passed through the param
						} else {
							// don't call if a function is not passed through the params, if it is not passed it will be undefined	
							if (successCallBack) successCallBack(doc); // callback function that is passed through the param, passes
																	   // the doc found from mongo into the callback function which can be accessed
																	   // in mongo later, really think about this, it is tricky, but you are basically
																	   // you take in a function prototype from an outer scope and you call it here
																	   // passing in whatever value you want from this current scope! This is very
																	   // list like programming
							/*

								modelU.query(someName, function(someVar) {
									console.log(someVar);
								});
								
								This is how the query method is suppose to be used
								when the anonymous function/lambda is passed, it actually
								gets invoked inside the query method itself and the query method
								passes on doc which gets aliased by someVar.

							*/
						}
					}
					db.close();					
				});;
			}
		});
	}
}

module.exports = Users;