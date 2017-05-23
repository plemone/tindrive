'use strict' // to make JavaScript strict syntactically

var bcrypt = require("bcrypt"); // password encryption module 
var MongoClient = require("mongodb").MongoClient; // database module

class ActiveUsers {

	constructor() { 
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
						failureCallBack();
					} else {
						successCallBack();
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
						failureCallBack();
					} else {
						successCallBack();
					}
					db.close();
				});
			}
		});
	}

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
							failureCallBack();
						} else {
							successCallBack();
						}
						db.close();
					}
				});;
			}
		});
	}

}

module.exports = ActiveUsers;