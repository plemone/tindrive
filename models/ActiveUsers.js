'use strict' // to make JavaScript strict syntactically

var Users = require("./Users.js");
var MongoClient = require("mongodb").MongoClient; // database module

// represents the collection ActiveUsers
class ActiveUsers extends Users {

	constructor() { 
		super();
		this.db = "mongodb://localhost:27017/TinDriveUsers";
		this.collection = "ActiveUsers";		
	}

	insert(name, successCallBack, failureCallBack) {
		var self = this;
		MongoClient.connect(this.db, function(err, db) {
			if (err) console.log("Error in finding the name in the database...");
			else {
				db.collection(self.collection).insert({"name": name}, function(err, doc) {
					if (err) {
						console.log("Error in logging user in the database...");
						// don't call if a function is not passed through the params, if it is not passed it will be undefined
						if (failureCallBack) failureCallBack(); // callback function that is being passed through the params
					} else {
						// don't call if a function is not passed through the params, if it is not passed it will be undefined		
						if (successCallBack) successCallBack(doc); // callback function that is being passed through the params
					}
					db.close();
				});
			}
		});
	}

	remove(name, successCallBack, failureCallBack) {
		var self = this;
		MongoClient.connect(this.db, function(err, db) {
			if (err) console.log("Error in finding the name in the database...");
			else {
				db.collection(self.collection).remove({"name": name}, function(err, doc) {
					// the doc here is the doc that is being removed
					if (err) {
						console.log("Error in removing the user from the database...");
						// don't call if a function is not passed through the params, if it is not passed it will be undefined
						if (failureCallBack) failureCallBack(); // callback function that is being passed through the params
					} else {
						// don't call if a function is not passed through the params, if it is not passed it will be undefined	
						if (successCallBack) successCallBack(doc); // callback function that is being passed through the params
					}
					db.close();
				});
			}
		});
	}
}

module.exports = ActiveUsers;