'use strict' // to make JavaScript strictly typed

var MongoClient = require("mongodb").MongoClient; // mongodb module

// Represents the Trashs collection which contains user's directory of trashes
class Trashes {

	constructor() {

		this.db = "mongodb://localhost:27017/TinDriveUsers"; // link which you use to connect to mongo db database
		this.collection = "Trashes";

	}

	// upsert means updating the existing document, and if the document doesn't exist it gets updated
	upsert(userTrash, successCallBack, failureCallBack) { // the logic of what happens upon success or failure gets passed on through the successCallBack and failureCallBack functions
		var self = this; // the keyword "this" has different meaning in different scopes
		MongoClient.connect(this.db, function(err, db) {
			if (err) {
				console.log("Error in finding the name in the database...");
			} else {
				db.collection(self.collection).update({"name": userTrash.name}, userTrash, {upsert: true}, function(err, result) {
					if (err) {
						console.log("Error in updating the trash directory...");
						if (failureCallBack) { // a check to see if the user provided the failureCallBack, if the user of this class didn't then it would be undefined
							failureCallBack(); // invoke the failure callBack function specified by the class using this object, where the class passes the function in
						}
					} else {
						if (successCallBack) { // a check to see if the user provided the successCallBack, if the user of this class didn't then it would be undefined
							successCallBack(); // invoke the successCallBack function specified by the class using this object, when the class passes the function in
						}
					}
					db.close(); // always close the database in the end
				});
			}
		});
	}

	// takes in the user name and finds the users trash directory from the Trashes collection
	query(name, successCallBack, failureCallBack) {
		var self = this; // the keyword "this" has different meaning in different scopes
		MongoClient.connect(this.db, function(err, db) { // the logic of what happens upon success or failure gets passed on through the successCallBack and failureCallBack functions
			if (err) {mongodb update call back
				console.log("Error in finding the name in the database...");
			} else {
				db.collection(self.collection).findOne({"name": name}, function(err, doc) {
					if (err) {
						console.log("Error in finding the user's trash...");
						if (failureCallBack) { // a check to see if the user provided the failureCallBack, if the user of this class didn't then it would be undefined
							failureCallBack(); // invoke the failure callBack function specified by the class using this object, where the class passes the function in
						}
					} else {
						if (successCallBack) { // a check to see if the user provided the successCallBack, if the user of this class didn't then it would be undefined
							successCallBack(); // invoke the successCallBack function specified by the class using this object, when the class passes the function in
						}

					}
					db.close(); // always close the database in the end
				});
			}
		});
	}

}


module.exports = Trashs;